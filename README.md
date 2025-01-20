# cjp-vue3-components

- build 负责打包 通过gulp编译ts、样式、单文件组件等
- dist 最终生成的打包结果
- packages 存放组件、样式、工具方法等包，采用monorepo范式管理
- play 用来测试运行组件，调试用
- server 用来模拟后端服务，实现真实请求
- types 垫片，存放ts类型声明
- .npmrc npm配置文件，用于pnpm提升幽灵依赖
- tsconfig.json ts配置文件，将ts转成js靠它

## packages

- components 组件文件，最终通过 index.ts 导出所有组件
- theme 样式和字体文件，BEM规范
- utils 模块公共的工具方法

## build

打包模块，通过gulp来控制构建流程，根目录下的gulpfile.ts为流程控制入口，通过它来控制串行执行以下流程

1.打包样式2.打包工具方法3.打包所有组件4.打包每个组件5.生成组件库6.发布组件

运行 `pnpm run build` 时执行gulp，随后会在node子进程中执行命令 `pnpm run --filter ./packages/** --parallel build` ，意思是找到packages目录下的所有build命令，--parallel表示并行打包，所以需要在packages里面每个包中添加build命令，并创建gulpfile.ts。

由于packages下可能会有n个包，很多流程是类似的，所以将构建流程统一提取封装到build目录下的packages.ts中，每个包中只需要引入packages.ts提供的buildPackages方法，传入参数即可。

## dist

打包出来的整体结果，包含esm规范和cjs规范目录。

- es
- lib
- theme

最终发布到npm上的模块就是dist模块。

## packages/cjp-components

组件库的整合入口，负责导入导出所有组件。
