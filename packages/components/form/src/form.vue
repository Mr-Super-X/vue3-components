<template>
  <form :class="bem.b()">
    <slot></slot>
  </form>
</template>

<script setup lang="ts">
import { createNamespace } from '@cjp-cli-dev/vue3-components-utils/create'
import { FormContext, formContextKey, formProps } from './form'
import { provide } from 'vue'
import { FormItemContext } from './form-item'
import { Values } from 'async-validator'

defineOptions({
  name: 'c-form',
  inheritAttrs: false,
})

const bem = createNamespace('form')
const props = defineProps(formProps)

const fields: FormItemContext[] = [] // 在父级中收集子级的所有字段
// 子级form-item组件加载完成后调用该方法将属性收集给父级form组件
const addField: FormContext['addField'] = context => {
  fields.push(context)
}

// form组件校验，调用所有form-item的校验方法
const validate = async (callback?: (isValid: boolean, invalidFields?: Values) => void) => {
  let errors: Values = {}

  for (const field of fields) {
    try {
      await field.validate('')
    } catch (error) {
      errors = {
        ...errors,
        ...(error as Values).fields,
      }
    }
  }

  if (Object.keys(errors).length === 0) {
    if (callback) {
      return callback(true)
    } else {
      return Promise.resolve(true)
    }
  } else {
    if (callback) {
      return callback(false, errors)
    } else {
      return Promise.reject(errors)
    }
  }
}

// 导出上下文，便于跨级别组件inject注入使用
const context: FormContext = {
  ...props,
  addField,
}
provide(formContextKey, context)

// 将form表单的校验方法暴露给用户，用户可以通过ref来调用
defineExpose({
  validate,
})
</script>

<style scoped></style>
