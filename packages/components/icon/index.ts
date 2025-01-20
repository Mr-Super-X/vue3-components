// 用来整合组件，最终实现导出组件
import _Icon from './src/icon.vue'
import { withInstall } from '@cjp-cli-dev/vue3-components-utils/with-install'

const Icon = withInstall(_Icon) // 生成带有 install 方法的组件

// 导出组件，可以通过app.use(Icon)来使用，也可以通过 import 方式使用
export default Icon
export { Icon }

// 导出icon组件的ts类型
export * from './src/icon'

// 给 volar 插件用的，在这里扩展的类型可以在模版中被解析
// https://marketplace.visualstudio.com/items?itemName=Vue.volar
declare module 'vue' {
  export interface GlobalComponents {
    CIcon: typeof Icon
  }
}
