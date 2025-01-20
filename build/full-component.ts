import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import vue from 'rollup-plugin-vue'
import typescript from 'rollup-plugin-typescript2'
import { parallel } from 'gulp'
import path from 'path'
import { cjpComponentsRoot, outDir } from './utils/paths'
import { rollup, OutputOptions } from 'rollup'

const buildFull = async () => {
  // rollup打包配置
  const config = {
    input: path.resolve(cjpComponentsRoot, 'index.ts'), // 打包入口
    plugins: [nodeResolve(), typescript(), vue(), commonjs()], // 打包需要用哪些插件，依次调用
    external: (id: string) => /^vue/.test(id), // 表示打包时排除vue源代码
  }

  // 组件库有两种主流使用方式，esm（import导入） umd（script src导入）
  const buildConfig = [
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
  return Promise.all(buildConfig.map(conf => bundle.write(conf as OutputOptions)))
}

// buildFullComponent 任务名
export const buildFullComponent = parallel(buildFull)
