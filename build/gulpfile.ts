/**
 * series表示执行串行打包流程
 * parallel表示执行并行打包流程
 */
import { series, parallel } from 'gulp'
import { run, withTaskName } from './utils'

/**
 * 静态资源构建步骤
 * 1.打包样式
 * 2.打包工具方法
 * 3.打包所有组件
 * 4.打包每个组件
 * 5.生成组件库
 * 6.发布组件
 */
export default series(
  // 任务一，删除dist目录
  withTaskName('删除旧的dist目录', async () => run('rm -rf ./dist')),
  // 并行执行，可以同时执行的任务放这里
  parallel(
    // 任务二，打包所有package（命令的意思是找到packages目录下的所有build命令，--parallel表示并行打包）
    withTaskName('构建packages中的所有包', async () => run('pnpm run --filter ./packages/** --parallel build')),
    // 任务三，打包所有组件（执行build命令，指定执行参数为buildFullComponent，gulp会解析这个参数并执行任务，这个任务的名字就叫buildFullComponent，不指定默认执行default）
    // 相当于执行gulp -f build/gulpfile.ts buildFullComponent，随后gulp就会去找这个buildFullComponent任务
    withTaskName('打包全部组件', async () => run('pnpm run build buildFullComponent')),
    // 任务四，打包单个组件
    withTaskName('打包每个组件', async () => run('pnpm run build buildComponent'))
  )
)

// gulp：任务执行器，如 gulp 任务名 就会执行对应的任务
export * from './full-component' // 管理打包所有组件
export * from './component' // 管理打包每个组件
