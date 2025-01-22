<template>
  <label :class="bem.b()">
    <span :class="bem.e('input')">
      <input
        v-model="model"
        ref="inputRef"
        type="checkbox"
        :disabled="disabled"
        :value="label"
        @change="handleChange"
      />
    </span>

    <span :class="bem.e('label')">
      <!-- 优先展示默认slot，否则显示label属性 -->
      <slot></slot>
      <template v-if="!$slots.default">{{ label }}</template>
    </span>
  </label>
</template>

<!-- 解决ts无法解析并输出声明文件 -->
<script lang="ts">
export default {}
</script>

<script setup lang="ts">
import { createNamespace } from '@cjp-cli-dev/vue3-components-utils/create'
import { checkboxEmits, checkboxProps } from './checkbox'
import { ref, computed, onMounted, watch } from 'vue'

const bem = createNamespace('checkbox')

const emits = defineEmits(checkboxEmits)
const props = defineProps(checkboxProps)

defineOptions({
  name: 'c-checkbox',
})

const model = computed({
  get() {
    return props.modelValue
  },
  set(value: string | number | boolean) {
    emits('update:modelValue', value)
  },
})

const inputRef = ref<HTMLInputElement>()

function handleChange(e: Event) {
  const target = e.target as HTMLInputElement

  const value = target.checked ? true : false

  emits('change', value)
}

// 半选状态处理
function indeterminate(val: boolean) {
  inputRef.value!.indeterminate = val
}

watch(() => props.indeterminate, indeterminate)

onMounted(() => {
  indeterminate(props.indeterminate)
})
</script>

<style scoped></style>
