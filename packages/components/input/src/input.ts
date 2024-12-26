import { ExtractPropTypes, PropType } from 'vue'
import { isString } from '@vue/shared'

export const inputProps = {
  type: {
    type: String as PropType<string>,
    default: 'text',
  },
  modelValue: {
    type: [String, Number] as PropType<string | number>,
    default: '',
  },
  showPassword: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  label: {
    type: String as PropType<string>,
    default: '',
  },
  placeholder: String,
  clearable: Boolean,
  disabled: Boolean,
  readonly: Boolean,
} as const


export const inputEmits = {
  'update:modelValue': (value: string) => isString(value),
  input: (value: string) => isString(value),
  change: (value: string) => isString(value),
  focus: (e: Event) => e,
  blur: (e: Event) => e,
  clear: () => true,
}


// 导出类型
export type InputProps = ExtractPropTypes<typeof inputProps>
export type InputEmits = ExtractPropTypes<typeof inputEmits>