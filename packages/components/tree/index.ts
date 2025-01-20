// 用来整合组件，最终实现导出组件
import _Tree from './src/tree.vue'
import { withInstall } from '@cjp-cli-dev/vue3-components-utils/with-install'

const Tree = withInstall(_Tree) // 生成带有 install 方法的组件

// 导出组件，可以通过app.use(Icon)来使用，也可以通过 import 方式使用
export default Tree
export { Tree }

// 导出组件的ts类型
export * from './src/tree'

// 给 volar 插件用的，在这里扩展的类型可以在模版中被解析
// https://marketplace.visualstudio.com/items?itemName=Vue.volar
declare module 'vue' {
  export interface GlobalComponents {
    CTree: typeof Tree
  }
}
