<template>
  <div :class="bem.b()" @dragover.prevent="onDragover" @dragleave.prevent="onDragleave" @drop.prevent="onDrop">
    <slot></slot>
  </div>
</template>

<!-- 解决ts无法解析并输出声明文件 -->
<script lang="ts">
export default {}
</script>

<script setup lang="ts">
import { createNamespace } from '@cjp-cli-dev/vue3-components-utils/create'
import { ref } from 'vue'
import { uploadDraggerEmits } from './upload-dragger'

defineOptions({
  name: 'c-upload-dragger',
  inheritAttrs: false,
})

const bem = createNamespace('upload-dragger')

const emits = defineEmits(uploadDraggerEmits)

// 拖拽状态
const isOver = ref(false)

// 拖拽结束
const onDragover = () => {
  isOver.value = true
}

// 离开拖拽
const onDragleave = () => {
  isOver.value = false
}

// 松手
const onDrop = (e: Event) => {
  const dragEvent = e as DragEvent // 解决rollup打包报错
  // 阻止事件冒泡，否则浏览器会自动打开或下载文件
  e.stopPropagation()
  // 通过DragEvent拿到文件，并转成数组通过事件发出去
  const files = dragEvent.dataTransfer!.files
  emits('file', Array.from(files))
}
</script>

<style scoped></style>
