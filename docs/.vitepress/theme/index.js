import DefaultTheme from 'vitepress/theme'

import Icon from '@cjp-cli-dev/vue3-components/icon'
import '@cjp-cli-dev/vue3-components-theme/src/index.scss'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.use(Icon) // 在vitepress中注册全局组件
  },
}
