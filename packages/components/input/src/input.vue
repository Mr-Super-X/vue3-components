<template>
  <div :class="[bem.b()]">
    <div :class="bem.b('group')">
      <div v-if="slots.prepend" :class="bem.be('group', 'prepend')">
        <slot name="prepend"></slot>
      </div>

      <div :class="bem.be('group', 'wrapper')">
        <span v-if="slots.prefix" :class="bem.be('group', 'prefix')">
          <slot name="prefix"></slot>
        </span>
        <!-- 需要显示密码，再看当前是普通文本还是密码 -->
        <input
          ref="inputRef"
          v-bind="attrs"
          :class="bem.be('group', 'inner')"
          :type="showPassword ? (passwordVisible ? 'text' : 'password') : type"
          :placeholder="placeholder"
          :clearable="clearable"
          :disabled="disabled"
          :readonly="readonly"
          @input="handleInput"
          @change="handleChange"
          @focus="handleFocus"
          @blur="handleBlur"
        />

        <c-icon v-if="showPwdVisible" :class="bem.be('group', 'icon-eye')" @click="handlePasswordVisible">
          <!-- 替换实际图标 -->
          <span v-if="passwordVisible">h</span>
          <span v-else>e</span>
        </c-icon>
        <c-icon v-if="showClearVisible" :class="bem.be('group', 'icon-clear')" @click="handleClear">
          <!-- 替换实际图标 -->
          <span>x</span>
        </c-icon>

        <span v-if="slots.suffix" :class="bem.be('group', 'suffix')">
          <slot name="suffix"></slot>
        </span>
      </div>

      <div v-if="slots.append" :class="bem.be('group', 'append')">
        <slot name="append"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { createNamespace } from '@cjp-cli-dev/vue3-components-utils/create'
import { useAttrs, useSlots, watch, ref, onMounted, nextTick, computed } from 'vue'
import { inputEmits, inputProps } from './input'

defineOptions({
  name: 'c-input',
  inheritAttrs: false,
})

const bem = createNamespace('input')

const emits = defineEmits(inputEmits)
const props = defineProps(inputProps)
const slots = useSlots()
const attrs = useAttrs()

const inputRef = ref<HTMLInputElement>()

const focus = async () => {
  await nextTick() // 下一次Tick后获取焦点
  inputRef.value?.focus()
}

const passwordVisible = ref(false)
const handlePasswordVisible = () => {
  passwordVisible.value = !passwordVisible.value

  focus() // 获取焦点
}

const showPwdVisible = computed(() => {
  return props.modelValue && props.showPassword && !props.disabled && !props.readonly
})

const showClearVisible = computed(() => {
  return props.modelValue && props.clearable && !props.disabled && !props.readonly
})

function setNativeInputValue(value: string) {
  const inputEl = inputRef.value
  if (!inputEl) return

  inputEl.value = value
}

// 组件加载完成后设置输入框的值
onMounted(() => {
  setNativeInputValue(props.modelValue as string)
})

// 监控绑定值的改变
watch(
  () => props.modelValue,
  value => {
    setNativeInputValue(value as string)
  }
)

// 触发input事件
const handleInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  emits('input', value)
  emits('update:modelValue', value) // 触发事件，实现双向绑定
}

// 触发change事件
const handleChange = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  emits('change', value)
}

// 触发focus事件
const handleFocus = (e: Event) => {
  emits('focus', e)
}

// 触发blur事件
const handleBlur = (e: Event) => {
  emits('blur', e)
}

// 触发clear事件
const handleClear = (e: Event) => {
  emits('input', '')
  emits('update:modelValue', '') // 触发事件，实现双向绑定
  emits('clear')

  focus() // 获取焦点
}
</script>

<style scoped></style>
