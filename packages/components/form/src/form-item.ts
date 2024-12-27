import { ExtractPropTypes, InjectionKey, PropType } from 'vue'
import type { RuleItem } from 'async-validator'

export type Arrayable<T> = T | T[]

// 继承RuleItem并扩展自定义属性
export interface FormItemRule extends RuleItem {
  trigger?: Arrayable<string>
}

// 提取可复用数据
export const formItemValidateState = ['success', 'error', ''] as const

export const formItemProps = {
  prop: {
    // 绑定的属性
    type: String,
  },
  label: {
    type: String,
  },
  rules: {
    // 校验规则
    type: [Object, Array] as PropType<Arrayable<FormItemRule>>,
  },
  showMessage: {
    // 是否显示错误消息文本，默认显示
    type: Boolean,
    default: true,
  },
} as const

export const formItemEmits = {}

// 导出类型
export type FormItemProps = Partial<ExtractPropTypes<typeof formItemProps>>
export type FormItemValidateState = (typeof formItemValidateState)[number]

// 定义formItem组件上下文
export interface FormItemContext extends FormItemProps {
  // 接收两参数，trigger和callback
  validate: (trigger: string, callback?: (isValid: boolean) => void) => Promise<any>
}

// 通过provide/inject跨组件通信
export const formItemContextKey: InjectionKey<FormItemContext> = Symbol()
