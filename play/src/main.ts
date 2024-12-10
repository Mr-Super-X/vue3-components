import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

const app = createApp(App)

// 引入icon组件
import Icon from "@cjp-cli-dev/vue3-components/icon"
import "@cjp-cli-dev/vue3-components-theme/src/index.scss"

const plugins = [
  Icon,
]

plugins.forEach(plugin => app.use(plugin))

app.mount('#app')
