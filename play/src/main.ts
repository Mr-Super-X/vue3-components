import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

const app = createApp(App)

// 引入样式
import "@cjp-cli-dev/vue3-components-theme/src/index.scss"
// 引入icon组件
import Icon from "@cjp-cli-dev/vue3-components/icon"
// 引入tree组件
import Tree from "@cjp-cli-dev/vue3-components/tree"

const plugins = [
  Icon,
  Tree,
]

plugins.forEach(plugin => app.use(plugin))

app.mount('#app')
