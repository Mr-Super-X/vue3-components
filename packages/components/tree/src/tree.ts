// 这里准备组件相关属性和ts类型
import { ExtractPropTypes, PropType } from 'vue'

export type Key = string | number

export interface TreeOption {
  label?: Key
  key?: Key
  children?: TreeOption[]
  isLeaf?: boolean // 是否叶子节点
  [key: string]: unknown // 支持任意接口
}

// 继承TreeOption所有属性，并使用内置Required类型要求属性必填
export interface TreeNode extends Required<TreeOption> {
  level: number // 继承的基础上新增level属性
  children: TreeNode[], // 修改children的类型
  rawNode: TreeOption // 原来的属性也拿到
}

export const treeProps = {
  data: {
    type: Array as PropType<TreeOption[]>,
    default: () => []
  },
  labelField: {
    type: String,
    default: 'label'
  },
  keyField: {
    type: String,
    default: 'key'
  },
  childrenField: {
    type: String,
    default: 'children'
  },
} as const;

// 通过vue提供的方法提取正确的属性类型 Partial是ts内置的，会自动将当前类型中的属性变为非必填
export type TreeProps = Partial<ExtractPropTypes<typeof treeProps>>;