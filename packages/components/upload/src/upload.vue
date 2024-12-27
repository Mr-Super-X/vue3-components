<template>
  <div :class="bem.b()">upload组件</div>
</template>

<script setup lang="ts">
import { createNamespace } from '@cjp-cli-dev/vue3-components-utils/create'

// 通过unplugin-vue-define-options插件设置组件name
defineOptions({
  name: 'c-upload',
  inheritAttrs: false,
})

// 创建bem规范命名空间
const bem = createNamespace('upload')
</script>

<style scoped></style>
