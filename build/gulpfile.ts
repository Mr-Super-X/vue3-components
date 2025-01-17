/**
 * series表示执行串行打包流程
 * parallel表示执行并行打包流程
 */
import { series, parallel } from 'gulp'
import { run, withTaskName } from './utils'

export default series(
  // 任务一，删除dist目录
  withTaskName('删除旧的dist目录', async () => run('rm -rf ./dist')),
  // 任务二，打包静态资源（命令的意思是找到packages目录下的所有build命令，--parallel表示并行打包）
  withTaskName('构建packages中的所有包', async () => run('pnpm run --filter ./packages/** --parallel build'))
)
