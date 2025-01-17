import path from 'path'
import { outDir } from './paths'

export const buildConfig = {
  esm: {
    module: 'ESNext', // tsconfig输出结果是es6模块
    format: 'esm', // 需要配置格式化后的模块规范
    output: {
      name: 'es', // 输出到dist目录下的es目录中
      path: path.resolve(outDir, 'es'),
    },
    bundle: {
      path: 'cjp-vue3-components/es', // 转化的路径
    },
  },
  cjs: {
    module: 'CommonJS',
    format: 'cjs',
    output: {
      name: 'lib',
      path: path.resolve(outDir, 'lib'),
    },
    bundle: {
      path: 'cjp-vue3-components/lib',
    },
  },
}

// 导出ts类型
export type BuildConfig = typeof buildConfig
