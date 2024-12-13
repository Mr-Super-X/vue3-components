<template>
  <div :class="bem.b()">
    <!-- 动画可以使用内置transition-group组件来完成 -->
    <c-tree-node
      v-for="node in flattenTree"
      :key="node.nodeKey"
      :node-key="node.nodeKey"
      :node="node"
      :expended="isExpanded(node)"
      @toggle="toggleExpand"
      :data-level="node.level"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { createNamespace } from '@cjp-cli-dev/vue3-components-utils/create'
import { treeProps, TreeNode, TreeOption } from './tree'
import CTreeNode from './treeNode.vue'

// 需安装：unplugin-vue-define-options
defineOptions({
  name: 'c-tree', // 定义组件的名字
})

const bem = createNamespace('tree')

const props = defineProps(treeProps)

// 有了props之后，要对用户传入的参数进行格式化
const treeData = ref<TreeNode[]>([])

// 辅助方法，用于动态获取用户传入的数据
function createOption(key: string, label: string, children: string) {
  return {
    getKey(node: TreeOption) {
      return node[key] as string
    },
    getLabel(node: TreeOption) {
      return node[label] as string
    },
    getChildren(node: TreeOption) {
      return node[children] as TreeOption[]
    },
  }
}

const treeOption = createOption(props.keyField, props.labelField, props.childrenField)

// 格式化方法
function createTree(tree: TreeOption[]): any {
  function traversal(data: TreeOption[], parent: TreeNode | null = null) {
    return data.map(node => {
      const children = treeOption.getChildren(node) || []

      const treeNode: TreeNode = {
        nodeKey: treeOption.getKey(node),
        label: treeOption.getLabel(node),
        children: [], // 默认为空
        rawNode: node,
        level: parent ? parent.level + 1 : 0, // 层级
        // 优先使用用户传递的isLeaf属性，否则判断子级是否存在
        isLeaf: node.isLeaf ?? children.length === 0,
      }

      // 有子级再去递归，将其格式化成treeNode类型
      if (children.length > 0) {
        treeNode.children = traversal(children, treeNode)
      }

      return treeNode
    })
  }

  const result: TreeNode[] = traversal(tree)

  return result
}

// 监控数据变化，调用格式化方法，初始执行一次
watch(
  () => props.data,
  (data: TreeOption[]) => {
    treeData.value = createTree(data)
  },
  {
    immediate: true,
  }
)

// 将一棵树结构拍平，点击节点还能实现展开操作
// 默认展开第一层，支持用户自定义展开哪一层

// 需要展开的key有哪些
const expandedKeysSet = ref(new Set(props.defaultExpandedKeys))

// 拍平tree
const flattenTree = computed(() => {
  const flattenNodes: TreeNode[] = [] // 拍平后的结果

  const expandedKeys = expandedKeysSet.value // 要展开的key有哪些

  const nodes = treeData.value || [] // 用户传递的被格式化好的数据节点

  const stack: TreeNode[] = [] // 用于遍历树的栈

  // 深度优先遍历

  // [40, 41]
  for (let i = nodes.length - 1; i >= 0; --i) {
    // 从后往前推入节点，好处是数组不会塌陷
    // 可以用积木来理解，积木的最下层为数组的开始，最上层为数组的末尾
    // 拆掉积木的最下层则积木塌陷
    stack.push(nodes[i])
  }
  // [41, 40]

  while (stack.length > 0) {
    const node = stack.pop() // 弹出末尾节点
    if (!node) {
      continue
    } // 边界处理，没有节点则跳出循环
    flattenNodes.push(node)
    // 判断当前节点是否有子级，有的话再进行一次倒序深度遍历
    if (expandedKeys.has(node.nodeKey)) {
      const children = node.children
      if (children) {
        for (let i = children.length - 1; i >= 0; --i) {
          stack.push(node.children[i]) // 从后往前推入节点
        }
      }
    }
  }

  // 返回拍平结果集
  return flattenNodes
})

// 是否展开节点
function isExpanded(node: TreeNode): boolean {
  return expandedKeysSet.value.has(node.nodeKey)
}

// 折叠功能
function collapse(node: TreeNode) {
  expandedKeysSet.value.delete(node.nodeKey)
}

// 展开功能
function expand(node: TreeNode) {
  expandedKeysSet.value.add(node.nodeKey)
}

// 切换展开
function toggleExpand(node: TreeNode) {
  const expandKeys = expandedKeysSet.value
  if (expandKeys.has(node.nodeKey)) {
    collapse(node)
  } else {
    expand(node)
  }
}
</script>

<style scoped></style>
