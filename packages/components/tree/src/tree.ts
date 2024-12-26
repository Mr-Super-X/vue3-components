// 这里准备组件相关属性和ts类型
import { ExtractPropTypes, InjectionKey, PropType, SetupContext } from 'vue'

export type Key = string | number

export interface TreeOption {
  label?: Key
  nodeKey?: Key
  children?: TreeOption[]
  isLeaf?: boolean // 是否叶子节点
  disabled?: boolean // 是否禁用节点
  [key: string]: unknown // 支持任意接口
}

// 继承TreeOption所有属性，并使用内置Required类型要求属性必填
export interface TreeNode extends Required<TreeOption> {
  level: number // 继承的基础上新增level属性
  children: TreeNode[] // 修改children的类型
  rawNode: TreeOption // 原来的属性也拿到
  parentKey: Key | undefined // 父节点的key是什么
}

export const treeProps = {
  data: {
    type: Array as PropType<TreeOption[]>,
    default: () => [],
  },
  // 自定义label字段
  labelField: {
    type: String,
    default: 'label',
  },
  // 自定义key字段
  keyField: {
    type: String,
    default: 'nodeKey',
  },
  // 自定义children字段
  childrenField: {
    type: String,
    default: 'children',
  },
  // 默认展开的key数组
  defaultExpandedKeys: {
    type: Array as PropType<Key[]>,
    default: () => [],
  },
  selectedKeys: {
    // 选中节点集合
    type: Array as PropType<Key[]>,
  },
  selectable: {
    // 是否可以选中节点，默认true
    type: Boolean,
    default: true,
  },
  multiple: {
    // 是否可以多选节点，默认false
    type: Boolean,
    default: false,
  },
  showCheckbox: {
    // 是否展示checkbox
    type: Boolean,
    default: false,
  },
  defaultCheckedKeys: {
    // 默认勾选的节点集合
    type: Array as PropType<Key[]>,
    default: () => [],
  },
  // 异步加载数据方法
  onLoad: {
    type: Function as PropType<(node: TreeOption) => Promise<TreeOption[]>>,
    default: null,
  },
} as const

export const treeNodeProps = {
  node: {
    // 节点
    type: Object as PropType<TreeNode>,
    required: true,
  },
  expended: {
    // 是否展开
    type: Boolean,
    required: true,
  },
  loadingKeys: {
    // 正在加载的节点
    type: Object as PropType<Set<Key>>,
    required: true,
  },
  selectedKeys: {
    // 选中节点集合
    type: Array as PropType<Key[]>,
  },
  showCheckbox: {
    // 是否展示checkbox
    type: Boolean,
    default: false,
  },
  checked: {
    // 是否选中
    type: Boolean,
    default: false,
  },
  disabled: {
    // 是否禁用
    type: Boolean,
    default: false,
  },
  indeterminate: {
    // 是否半选
    type: Boolean,
    default: false,
  },
}

export const treeNodeContentProps = {
  node: {
    type: Object as PropType<TreeNode>,
    required: true,
  },
}

// 导出 TreeNode 事件
export const treeNodeEmits = {
  toggle: (node: TreeNode) => node,
  select: (node: TreeNode) => node,
  check: (node: TreeNode, value: boolean) => typeof value === 'boolean',
}

// 导出 tree 事件
export const treeEmits = {
  // 同步响应式属性 selectedKeys
  'update:selectedKeys': (keys: Key[]) => keys,
}

// 通过vue提供的方法提取正确的属性类型 Partial是ts内置的，会自动将当前类型中的属性变为非必填
export type TreeProps = Partial<ExtractPropTypes<typeof treeProps>>
export type TreeNodeProps = Partial<ExtractPropTypes<typeof treeNodeProps>>

export interface TreeContext {
  slots: SetupContext['slots'] // 插槽
  // emits: SetupContext<typeof treeEmits>['emit'], // 事件
}

// 提供出去的属性
export const treeInjectionKey: InjectionKey<TreeContext> = Symbol()
