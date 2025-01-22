import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import vue from 'rollup-plugin-vue'
import typescript from 'rollup-plugin-typescript2'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { parallel } from 'gulp'
import path from 'path'
import { cjpComponentsRoot, outDir } from './utils/paths'
import { rollup, OutputOptions } from 'rollup'
import fs from 'fs'
import { buildConfig } from './utils/config'
import { pathRewriter } from './utils'

const buildFull = async () => {
  // rollup打包配置
  const config = {
    input: path.resolve(cjpComponentsRoot, 'index.ts'), // 打包入口
    plugins: [nodeResolve(), commonjs(), vue(), vueJsx(), typescript()], // 打包需要用哪些插件，依次调用
    external: (id: string) => /^vue/.test(id), // 表示打包时排除vue源代码
  }

  // 组件库有两种主流使用方式，esm（import导入） umd（script src导入）
  const buildConfigs = [
    {
      format: 'umd', // 打包格式
      file: path.resolve(outDir, 'index.js'), // 打包输出目录
      name: 'CjpComponents', // 打包后导出的全局变量名称
      exports: 'named', // 加了name属性必须使用exports属性设置为named，表示用命名的方式导出
      globals: {
        // 防止浏览器报警告
        vue: 'Vue', // 表示使用的vue是全局的
      },
    },
    {
      format: 'esm', // 打包格式
      file: path.resolve(outDir, 'index.esm.js'), // 打包输出目录
    },
  ]

  // 调用rollup产生bundle，调用bundle.write(output)输出结果
  const bundle = await rollup(config)

  // 遍历输出
  return Promise.all(buildConfigs.map(conf => bundle.write(conf as OutputOptions)))
}

// 打包组件库（packages/cjp-components/index.ts）入口
const buildEntry = async () => {
  // 读cjpComponentsRoot根目录，withFileTypes 携带文件类型
  const entryFiles = fs.readdirSync(cjpComponentsRoot, { withFileTypes: true })
  // 找出入口，排除 package.json 并返回拼接路径
  const entryPoints = entryFiles
    .filter(f => f.isFile()) // 看它是不是文件
    .filter(f => !['package.json'].includes(f.name)) // 不能是package.json
    .map(f => path.resolve(cjpComponentsRoot, f.name)) // 返回拼接路径

  // 创建rollup配置
  const config = {
    input: entryPoints,
    plugins: [nodeResolve(), vue(), typescript()],
    external: (id: string) => /^vue/.test(id) || /^@cjp-cli-dev/.test(id), // 排除vue源码和@cjp-cli-dev的源码,
  }

  const bundle = await rollup(config)

  return Promise.all(
    Object.values(buildConfig)
      .map(conf => ({
        format: conf.format, // 输出什么格式
        dir: conf.output.path, // 输出的目录
        paths: pathRewriter(conf.output.name), // 重写路径
        // 解决打包警告：Entry module "/xxx/index.ts" is using named and default exports together. Consumers of your bundle will have to use `chunk.default` to access the default export, which may not be what you want. Use `output.exports: "named"` to disable this warning.
        exports: 'named',
      }))
      .map(output => bundle.write(output as OutputOptions))
  )
}

// buildFullComponent 任务名
export const buildFullComponent = parallel(buildFull, buildEntry)
