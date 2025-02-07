// 专门打包utils/指令/hooks等

import path from 'path'
import ts from 'gulp-typescript'
import { series, parallel, src, dest } from 'gulp'
import { buildConfig } from './utils/config'
import { projectRoot } from './utils/paths'
import { withTaskName } from './utils'

export const buildPackages = (dirPath: string, modelName: string) => {
  // 需要什么样的打包格式？模块规范 cjs、es
  // umd 是在浏览器中直接使用的

  // 有多个包需要打包，循环遍历打包即可，可以用rollup进行打包，但是这里的逻辑比较简单，只是让 ts => js即可
  const tasks = Object.entries(buildConfig).map(([module, config]) => {
    const tsConfig = path.resolve(projectRoot, 'tsconfig.json') // 拿到ts配置文件路径
    const inputs = ['**/*.ts', '!gulpfile.ts', '!node_modules'] // 整合要打包的文件和排除的文件
    const output = path.resolve(dirPath, config.output.name) // 输出路径 传入的模块路径/配置的输出目录

    return series(
      withTaskName(`构建：${modelName}模块 => dist/${config.output.name}/${modelName}`, () => {
        // 将入口inputs匹配的.ts文件转换成js
        return src(inputs)
          .pipe(
            ts.createProject(tsConfig, {
              declaration: true, // 打包ts需要生成声明配置文件 xxx.d.ts（获取ts类型检测）
              strict: false, // 关闭严格模式，防止莫名其妙的报错
              module: config.module, // 打包输出的结果 es/commonjs
            })()
          ) // 调用gulp-typescript转换ts文件
          .pipe(dest(output)) // 输出到output
      }),
      withTaskName(`拷贝：${modelName}模块 => dist/${config.output.name}/${modelName}`, () => {
        // 将输出目录下的结果放到dist下 es => utils 和 lib => utils 中
        // 例如将utils打包结果拷贝到 dist/es/utils中
        return src(`${output}/**`).pipe(dest(path.resolve(config.output.path, modelName)))
      })
    )
  })

  // 最后返回并行任务
  return parallel(...tasks)
}
