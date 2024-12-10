<template>
  <i :class="bem.b()" :style="styles">
    <slot></slot>
  </i>
</template>


<script setup lang="ts">
import { computed, CSSProperties } from "vue";
import { createNamespace } from "@cjp-cli-dev/vue3-components-utils/create";
import { iconProps } from "./icon";

// 需安装：unplugin-vue-define-options
defineOptions({
  name: 'c-icon', // 定义组件的名字
})

const bem = createNamespace("icon");

const props = defineProps(iconProps);

// 计算属性处理样式
const styles = computed<CSSProperties>(() => {
  if(!props.size && !props.color) return {};

  return {
    ...(props.size ? {'font-size': props.size + 'px'} : {}),
    ...(props.color ? {'color': props.color} : {})
  }
})
</script>
