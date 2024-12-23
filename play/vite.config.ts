import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// 使.vue文件setup方式支持调用defineOptions来定义组件名称
import DefineOptions from 'unplugin-vue-define-options/vite'
// 使vue.js中的jsx语法可以正常工作
import VueJsxPlugin from '@vitejs/plugin-vue-jsx'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), DefineOptions(), VueJsxPlugin()],
})
