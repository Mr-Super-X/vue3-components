import { ExtractPropTypes, PropType } from "vue"

// 原始类型定义
export type Size = 'small' | 'medium' | 'large'
export type Type = 'primary' | 'success' | 'warning' | 'danger' | 'default'
export type NativeType = 'button' | 'submit' | 'reset'
export type Placement = 'left' | 'right'

// as const 表示属性不可被修改
export const buttonProps = {
  // 大小
  size: String as PropType<Size>,
  // 颜色类型
  type: {
    type: String as PropType<Type>,
    validator(val: string) {
      return ['primary', 'success', 'warning', 'danger', 'default'].includes(val)
    },
    default: ''
  },
  // 按钮原生类型
  nativeType: {
    type: String as PropType<NativeType>,
    validator(val: string) {
      return ['button', 'submit', 'reset'].includes(val)
    },
    default: 'button'
  },
  // 图标位置
  iconPlacement: {
    type: String as PropType<Placement>,
    validator(val: string) {
      return ['left', 'right'].includes(val)
    },
    default: 'left'
  },
  // 是否禁用
  disabled: Boolean,
  // 是否正在加载
  loading: Boolean,
  // 是否圆角按钮
  round: Boolean,
} as const

export const buttonEmits = {
  click: (e: MouseEvent) => e instanceof MouseEvent,
  mousedown: (e: MouseEvent) => e instanceof MouseEvent,
  mouseup: (e: MouseEvent) => e instanceof MouseEvent,
  // ...
}

// 导出类型
export type ButtonProps = ExtractPropTypes<typeof buttonProps>
export type ButtonEmits = ExtractPropTypes<typeof buttonEmits>