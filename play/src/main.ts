import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

const app = createApp(App)

// 引入样式
import '@cjp-cli-dev/vue3-components-theme/src/index.scss'
// 引入icon组件
import Icon from '@cjp-cli-dev/vue3-components/icon'
// 引入tree组件
import Tree from '@cjp-cli-dev/vue3-components/tree'
// 引入checkbox组件
import Checkbox from '@cjp-cli-dev/vue3-components/checkbox'
// 引入button组件
import Button from '@cjp-cli-dev/vue3-components/button'
// 引入input组件
import Input from '@cjp-cli-dev/vue3-components/input'
// 引入form-item组件
import { FormItem } from '@cjp-cli-dev/vue3-components/form'

const plugins = [Icon, Tree, Checkbox, Button, Input, FormItem]

plugins.forEach(plugin => app.use(plugin))

app.mount('#app')
