import path from 'path'
import { series, parallel } from 'gulp'
import { sync } from 'fast-glob'
import { componentRoot, outDir, projectRoot } from './utils/paths'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import vue from 'rollup-plugin-vue'
import typescript from 'rollup-plugin-typescript2'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { rollup, OutputOptions } from 'rollup'
import { buildConfig } from './utils/config'
import { pathRewriter, run } from './utils'
import { Project, SourceFile } from 'ts-morph'
import glob from 'fast-glob'
import fs from 'fs'
import * as VueCompiler from '@vue/compiler-sfc'

const buildEachComponent = async () => {
  const files = sync("*", {
    cwd: componentRoot, // 设置目录
    onlyDirectories: true, // 只匹配文件夹
  })

  // 将packages/components下的所有组件分别放到 dist/es/component/ 下和 dist/lib/components 下
  const builds = files.map(async (file: string) => {
    // 拿到每个组件的入口
    const entry = path.resolve(componentRoot, file, 'index.ts')

    // 创建rollup配置
    const config = {
      input: entry, // 设置rollup入口
      plugins: [nodeResolve(), commonjs(), vue(), vueJsx(), typescript()], // 使用插件
      external: (id: string) => /^vue/.test(id) || /^@cjp-cli-dev/.test(id), // 排除vue源码和@cjp-cli-dev的源码
    }

    // 调用rollup，拿到bundle
    const bundle = await rollup(config)

    // 生成输出配置
    const outputOptions = Object.values(buildConfig).map(conf => ({
      format: conf.format, // 输出什么格式
      file: path.resolve(conf.output.path, `components/${file}/index.js`), // 输出到目录的某个组件下的index.js
      paths: pathRewriter(conf.output.name)
    }))

    // 打包输出
    await Promise.all(outputOptions.map((output) => bundle.write(output as OutputOptions)))
  })

  return Promise.all(builds)
}

// 生成ts类型提示文件
const genTypes = async () => {
  // 创建项目配置，生成.d.ts，需要一个tsconfig
  const project = new Project({
    compilerOptions: {
      allowJs: true, // 允许js
      declaration: true, // 要声明文件
      emitDeclarationOnly: true, // 仅抛出声明
      noEmitOnError: true, // 不抛出错误
      outDir: path.resolve(outDir, 'types'), // 输出目录 dist/types
      baseUrl: projectRoot, // 基础路径
      paths: { // 解析路径
        // 所有以@cjp-cli-dev开头的都去packages模块中查找
        "@cjp-cli-dev/*": ['packages/*']
      },
      skipLibCheck: true, // 跳过类库检测
      strict: false, // 不要严格模式
    },
    tsConfigFilePath: path.resolve(projectRoot, 'tsconfig.json'), // tsconfig的路径配置
    skipAddingFilesFromTsConfig: true, // 跳过从tsconfig里面添加文件
  })

  // 查找任意目录下的.vue .ts .tsx .js .jsx文件
  const filePaths = await glob('**/*.{vue,ts,tsx,js,jsx}', {
    cwd: componentRoot, // 以components中的所有文件为基准
    onlyFiles: true, // 只要文件类型
    absolute: true, // 使用绝对路径
  })

  const sourceFiles: SourceFile[] = []

  // 遍历所有文件，处理.vue文件和.ts文件
  await Promise.all(filePaths.map(file => {
    // 匹配文件是.vue文件和.ts文件，仅处理这两种
    if (file.endsWith('.vue')) {
      // 读取.vue文件的内容
      const source = fs.readFileSync(file, 'utf8')

      // 解析content
      const sfc = VueCompiler.parse(source)
      // 拿到脚本 可能是script lang='ts' 也可能是script setup lang='ts'
      const { script, scriptSetup } = sfc.descriptor
      if (script || scriptSetup) {
        let content = script?.content || scriptSetup?.content // 拿到脚本内容
        // 判断.vue lang='ts' 将icon.vue.ts => icon.vue.d.ts
        if (script?.lang === 'ts' || scriptSetup?.lang === 'ts') {
          // 创建文件
          const sourceFile = project.createSourceFile(file + '.ts', content)
          sourceFiles.push(sourceFile)
        }
      }
    } else {
      // 把所有的ts文件都放在一起发射成.d.ts
      const sourceFile = project.addSourceFileAtPath(file)
      sourceFiles.push(sourceFile)
    }
  }))

  // 生成声明文件.d.ts 默认是放到内存中的，需要手动写入文件
  await project.emit({
    emitOnlyDtsFiles: true, // 只生成.d.ts文件
  })


  // 遍历所有文件，手动写入文件
  const tasks = sourceFiles.map(async (sourceFile) => {
    // 获取发射脚本
    const emitOutput = sourceFile.getEmitOutput()

    // 拿到所有要输出的文件，遍历拿到路径
    const outputTasks = emitOutput.getOutputFiles().map(async (outputFile) => {

      // 拿到路径
      const filePath = outputFile.getFilePath()

      // 创建路径
      fs.mkdirSync(path.dirname(filePath), {
        recursive: true, // 递归创建
      })

      // 写入文件，将路径重写成es结尾 @cjp-cli-dev => cjp-components/es
      fs.writeFileSync(filePath, pathRewriter('es')(outputFile.getText()))
    })
    await Promise.all(outputTasks)
  })

  await Promise.all(tasks)
}

// 拷贝类型声明文件
const copyTypes = () => {
  // 要拷贝的路径
  const src = path.resolve(outDir, 'types/components/')

  const copy = (module) => {
    // 拿到出口
    let output = path.resolve(outDir, module, 'components')

    // 返回执行命令
    return () => run(`cp -r ${src}/* ${output}`)
  }

  // 分别拷贝，并行执行
  return parallel(
    copy('es'),
    copy('lib'),
  )
}

// 打包packages/components/index.ts
const buildComponentEntry = async () => {
  const config = {
    input: path.resolve(componentRoot, "index.ts"),
    plugins: [typescript()],
    external: () => true,
  }

  const bundle = await rollup(config)

  return Promise.all(
    Object.values(buildConfig)
      .map(conf => ({
        format: conf.format, // 输出格式
        // 将packages/components/index.ts打包输出到dist/es/components/index.js  dist/lib/components/index.js下
        file: path.resolve(conf.output.path, 'components/index.js'),
      }))
      .map(output => bundle.write(output as OutputOptions))
  )
}

export const buildComponent = series(
  buildEachComponent,
  genTypes,
  copyTypes(),
  buildComponentEntry,
)