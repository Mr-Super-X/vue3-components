<template>
  <button
    :type="nativeType"
    :disabled="disabled || loading"
    :class="[
      bem.b(),
      bem.m(type),
      bem.m(size),
      bem.is('round', round),
      bem.is('loading', loading),
      bem.is('disabled', disabled),
    ]"
    @click="emitClick"
    @mousedown="emitMousedown"
    @mouseup="emitMouseup"
  >
    <template v-if="iconPlacement === 'left'">
      <c-icon :size="23" v-if="loading">
        <!-- <Loading /> -->
      </c-icon>
      <!-- 用户自定义icon slot -->
      <component v-else :is="slots.icon"></component>
    </template>

    <!-- 插槽 -->
    <slot></slot>

    <template v-if="iconPlacement === 'right'">
      <c-icon :size="23" v-if="loading">
        <!-- <Loading /> -->
      </c-icon>
      <!-- 用户自定义icon slot -->
      <component v-else :is="slots.icon"></component>
    </template>
  </button>
</template>

<!-- 解决ts无法解析并输出声明文件 -->
<script lang="ts">
export default {}
</script>

<script setup lang="ts">
import CIcon from '@cjp-cli-dev/vue3-components/icon'
// import Loading from '@cjp-cli-dev/vue3-components/internal-icon/Loading'
import { createNamespace } from '@cjp-cli-dev/vue3-components-utils/create'
import { buttonEmits, buttonProps } from './button'
import { useSlots } from 'vue'

const bem = createNamespace('button')

defineOptions({
  name: 'c-button',
  inheritAttrs: false, // 不继承已声明的props之外的乱七八糟的属性（你随便绑定属性，我只接受我想要的）
})

// 如果组件声明了emits如click事件，则需要在组件上绑定该事件并用emits('click')发送事件，否则使用组件时绑定的click事件不会触发
// 如果组件未声明emits，则使用组件时绑定的事件将会被透传到组件的最外层dom，假设当前button组件变得更复杂如外层再套一个div，点击div也会触发事件，可能不是我们想要的结果
const emits = defineEmits(buttonEmits)
const props = defineProps(buttonProps)
const slots = useSlots()

// 定义由组件自己触发的事件，将事件传递出去
const emitClick = (e: MouseEvent) => {
  emits('click', e)
}

const emitMousedown = (e: MouseEvent) => {
  emits('mousedown', e)
}

const emitMouseup = (e: MouseEvent) => {
  emits('mouseup', e)
}
</script>

<style scoped></style>
