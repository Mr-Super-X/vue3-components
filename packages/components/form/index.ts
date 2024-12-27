// 用来整合组件，最终实现导出组件
import _Form from './src/form.vue'
import _FormItem from './src/form-item.vue'
import { withInstall } from '@cjp-cli-dev/vue3-components-utils/with-install'

const Form = withInstall(_Form) // 生成带有 install 方法的组件
const FormItem = withInstall(_FormItem) // 生成带有 install 方法的组件

// 导出组件，可以通过app.use(Form)来使用，也可以通过 import 方式使用
export { Form, FormItem }

// 导出Form组件的ts类型
export * from './src/form'
export * from './src/form-item'

// 导出form组件实例的类型，用户可以通过ref<FormInstance>()获得当前组件的属性编辑器提示
export type FormInstance = InstanceType<typeof Form>

// 给 volar 插件用的，在这里扩展的类型可以在模版中被解析
// https://marketplace.visualstudio.com/items?itemName=Vue.volar
declare module 'vue' {
  export interface GlobalComponents {
    CForm: typeof Form
    CFormItem: typeof FormItem
  }
}
