import path from 'path'
import { series } from 'gulp'
import { sync } from 'fast-glob'
import { componentRoot } from './utils/paths'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import vue from 'rollup-plugin-vue'
import typescript from 'rollup-plugin-typescript2'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { rollup, OutputOptions } from 'rollup'
import { buildConfig } from './utils/config'
import { pathRewriter } from './utils'

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

export const buildComponent = series(
  buildEachComponent
)