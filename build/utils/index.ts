import type { TaskFunction } from 'gulp'
import { spawn } from 'child_process'
import { projectRoot } from './paths'

/**
 * 给gulp任务添加名字的公共方法
 * @param taskName 任务名
 * @param callback 回调函数
 * @returns
 */
export const withTaskName = (taskName: string, callback: TaskFunction) =>
  Object.assign(callback, {
    displayName: taskName,
  })

/**
 * 在node中使用子进程来运行脚本
 * @param command 具体命令
 */
export const run = async (command: string) => {
  return new Promise((resolve, reject) => {
    // 切分并取出命令和参数
    const [cmd, ...args] = command.split(' ')
    const app = spawn(cmd, args, {
      cwd: projectRoot, // 设置执行目录为项目根路径
      stdio: 'inherit', // 在父进程输出子进程的日志
      shell: true, // 使用shell执行命令，默认情况下linux才支持rm -rf语法，windows有缺陷，所以要开启此项
    })

    app.on('exit', resolve)
    app.on('error', reject)
  })
}

/**
 * 重写路径
 * @param format
 */
export const pathRewriter = (format) => {
  return (id: string) => {
    const reg = /@cjp-cli-dev\/vue3-components(-?)/g;
    // 带-表示是工具包或其他包路径，不带表示组件包路径
    // 输入@cjp-cli-dev/vue3-components/icon时输出cjp-components/${format}/components/icon
    // 输入@cjp-cli-dev/vue3-components-utils/create时输出cjp-components/${format}/utils/create
    id = id.replace(reg, (_, dash) => (dash ? `cjp-components/${format}/` : `cjp-components/${format}/components`));
    return id
  }
}
