import { ExtractPropTypes, PropType } from "vue";

export const checkboxProps = {
  modelValue: { // 双向绑定value
    type: [Boolean, String, Number] as PropType<boolean | string | number>
  },
  indeterminate: { // 是否半选
    type: Boolean as PropType<boolean>,
    default: false,
  },
  disabled: { // 是否禁用
    type: Boolean as PropType<boolean>,
    default: false,
  },
  label: {
    type: String as PropType<string>,
  },
} as const

export const checkboxEmits = {
  'update:modelValue': (value: boolean | string | number) => true,
  change: (value: boolean) => true,
}

// 导出类型
export type CheckboxProps = Partial<ExtractPropTypes<typeof checkboxProps>>
export type CheckboxEmits = typeof checkboxEmits