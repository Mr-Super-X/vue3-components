<template>
  <div :class="[bem.b(), bem.is('success', validateState === 'success'), bem.is('error', validateState === 'error')]">
    <label :class="bem.e('label')">
      <!-- 支持自定义label -->
      <slot name="label">
        {{ label }}
      </slot>
    </label>
    <div :class="bem.e('content')">
      <slot></slot>
      <div :class="bem.e('error-msg')">
        <!-- 支持自定义error -->
        <slot name="error">
          {{ validateErrorMessage }}
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, provide, reactive, ref, toRefs } from 'vue'
import { createNamespace } from '@cjp-cli-dev/vue3-components-utils/create'
import { FormItemContext, formItemContextKey, formItemProps, FormItemRule, FormItemValidateState } from './form-item'

defineOptions({
  name: 'c-form-item',
  inheritAttrs: false, // 不继承已声明的props之外的乱七八糟的属性（你随便绑定属性，我只接受我想要的）
})

const bem = createNamespace('form-item')
const props = defineProps(formItemProps)

const validateState = ref<FormItemValidateState>('')
const validateErrorMessage = ref('校验失败')

const _rules = computed(() => {
  // 将rules转为数组
  const rules: FormItemRule[] = props.rules ? (Array.isArray(props.rules) ? props.rules : [props.rules]) : []
  return rules
})

const getRuleFiltered = (trigger: string) => {
  // blur change
  const rules = _rules.value

  const filterRules = rules.filter(rule => {
    // 处理用户没传trigger的情况，默认都要校验
    if (!rule.trigger || !trigger) {
      return true
    }

    // 看用户传递的rules是对象还是数组
    if (Array.isArray(rule.trigger)) {
      return rule.trigger.includes(trigger)
    } else {
      return rule.trigger === trigger
    }
  })

  return filterRules
}

const validate: FormItemContext['validate'] = async (trigger: string, callback?) => {
  // 拿到触发的时机，校验是否通过可以调用callback或者调用promise.then方法

  // rules是触发的规则，trigger是触发的方式
  const rules = getRuleFiltered(trigger)
  console.log('trigger: ', trigger, rules)
}

// 保障响应性，但不要添加.value
// const context: FormItemContext = reactive({
//   ...toRefs(props),
//   validate,
// })

const context: FormItemContext = {
  ...props,
  validate,
}

provide(formItemContextKey, context)
</script>

<style scoped></style>
