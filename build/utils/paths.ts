import path from 'path'

// 项目根路径
export const projectRoot = path.resolve(__dirname, '../../')

// 模块输出路径
export const outDir = path.resolve(__dirname, '../../dist')

// 组件入口路径
export const cjpComponentsRoot = path.resolve(__dirname, '../../packages/cjp-components')

// 组件源码路径
export const componentRoot = path.resolve(projectRoot, 'packages/components')
