import { Button, Checkbox, Form, Icon, Input, Upload } from '@cjp-cli-dev/vue3-components'
import type { App } from 'vue'

const components = [Button, Checkbox, Form, Icon, Input, Upload]

// 支持app.use(CjpComponents)注册全部组件
export default {
  install(app: App) {
    // 遍历所有组件，注册组件
    components.forEach(component => {
      // 每个组件编写时都提供了install方法
      app.use(component)
    })
  },
}

// 支持 import { Button } from '@cjp-cli-dev/vue3-components' 按需解构使用
export * from '@cjp-cli-dev/vue3-components'
