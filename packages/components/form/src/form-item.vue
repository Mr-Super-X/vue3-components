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
import AsyncValidator, { Values } from 'async-validator'
import { computed, inject, onMounted, provide, reactive, ref, toRefs } from 'vue'
import { createNamespace } from '@cjp-cli-dev/vue3-components-utils/create'
import {
  Arrayable,
  FormItemContext,
  formItemContextKey,
  formItemProps,
  FormItemRule,
  FormItemValidateState,
} from './form-item'
import { FormContext, formContextKey } from './form'

// 注入form上下文
const formContext: FormContext = inject(formContextKey)

defineOptions({
  name: 'c-form-item',
  inheritAttrs: false, // 不继承已声明的props之外的乱七八糟的属性（你随便绑定属性，我只接受我想要的）
})

const bem = createNamespace('form-item')
const props = defineProps(formItemProps)

const validateState = ref<FormItemValidateState>('')
const validateErrorMessage = ref('')

// 将rule配置转为数组
const convertArray = (rules: Arrayable<FormItemRule> | undefined): FormItemRule[] => {
  return rules ? (Array.isArray(rules) ? rules : [rules]) : []
}

// 处理自己的rule和form组件的rule合并
const _rules = computed(() => {
  // 自己的rules
  const myRules: FormItemRule[] = convertArray(props.rules)

  // form组件的rules
  const formRules = formContext.rules

  // 如果form组件有rules且自己有prop，则进行合并，最后返回
  if (formRules && props.prop) {
    const _temp = formRules[props.prop]

    // 父级rules优先
    if (_temp) {
      myRules.push(...convertArray(_temp))
    }
  }

  // 返回合并后的规则
  return myRules
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

// 校验成功处理
const onValidationSuccessed = () => {
  validateState.value = 'success'
  validateErrorMessage.value = ''

  // callback && callback()
}
// 校验失败处理
const onValidationFailed = (err: Values) => {
  validateState.value = 'error'
  const { errors } = err
  const message = errors ? errors[0].message : ''
  validateErrorMessage.value = message

  // callback && callback(error)
}

// 校验方法
const validate: FormItemContext['validate'] = async (trigger: string, callback?) => {
  // 拿到触发的时机，校验是否通过可以调用callback或者调用promise.then方法
  const rules = getRuleFiltered(trigger)

  // rules是触发的规则，trigger是触发的方式
  // 需要找到数据源对应的prop

  // 触发事件，找到rules和数据源，校验哪个属性

  // 拿到prop
  const modelName = props.prop!

  // 拿到校验器
  const validator = new AsyncValidator({
    [modelName]: rules,
  })

  // 拿到数据源
  const model = formContext.model || {}

  // 开始校验
  return validator
    .validate({
      [modelName]: model[modelName],
    })
    .then(() => {
      onValidationSuccessed()
    })
    .catch(error => {
      onValidationFailed(error)

      // 透传抛出错误
      return Promise.reject(error)
    })
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

// 组件加载完毕则将自己的上下文添加到父级form组件中管理
onMounted(() => {
  formContext.addField(context)
})
</script>

<style scoped></style>
