import path from 'path'
import fs from 'fs'
import { cjpComponentsRoot, outDir, projectRoot } from './utils/paths'
import { glob } from 'fast-glob'
import { Project, ModuleKind, ScriptTarget, SourceFile } from 'ts-morph'
import { run } from './utils'
import { parallel, series } from 'gulp'

const genEntryTypes = async () => {
  const files = await glob("*.ts", {
    cwd: cjpComponentsRoot,
    absolute: true,
    onlyFiles: true,
  })

  const project = new Project({
    compilerOptions: {
      module: ModuleKind.ESNext, // 打包的语法 es6
      target: ScriptTarget.ESNext, // 生成的目标语法 es6
      allowJs: true, // 允许js
      declaration: true, // 要声明文件
      emitDeclarationOnly: true, // 仅抛出声明
      noEmitOnError: false, // 不抛出错误
      outDir: path.resolve(outDir, 'entry/types'), // 输出目录 dist/entry/types
      rootDir: cjpComponentsRoot,
      strict: false, // 不要严格模式
    },
    tsConfigFilePath: path.resolve(projectRoot, 'tsconfig.json'), // tsconfig的路径配置
    skipAddingFilesFromTsConfig: true, // 跳过从tsconfig里面添加文件
    skipFileDependencyResolution: true, //
  })


  const sourceFiles: SourceFile[] = []

  files.map(f => {
    const sourceFile = project.addSourceFileAtPath(f)
    sourceFiles.push(sourceFile)
  })

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

      // 写入文件，将路径重写 @cjp-cli-dev/vue3-components => ./components，下一步会将它拷贝到对应的es/lib目录下，./components就会去找当前es或lib目录下的components
      fs.writeFileSync(filePath, outputFile.getText().replaceAll('@cjp-cli-dev/vue3-components', './components'), 'utf8')
    })
    await Promise.all(outputTasks)
  })

  await Promise.all(tasks)
}

// 拷贝入口声明文件
const copyEntryTypes = () => {
  const src = path.resolve(outDir, 'entry/types')

  const copy = (module) => {
    // 拿到出口
    let output = path.resolve(outDir, module)

    // 返回执行命令
    return () => run(`cp -r ${src}/* ${output}`)
  }

  // 分别拷贝，并行执行
  return parallel(
    copy("es"),
    copy("lib")
  )
}

// 导出任务
export const genTypes = series(genEntryTypes, copyEntryTypes())