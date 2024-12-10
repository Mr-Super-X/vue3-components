// 这里准备组件相关属性和ts类型
import { ExtractPropTypes, PropType } from 'vue'

export const iconProps = {
  color: String,
  size: [Number, String] as PropType<number | string>
} as const;

// 通过vue提供的方法提取正确的属性类型
export type IconProps = ExtractPropTypes<typeof iconProps>;