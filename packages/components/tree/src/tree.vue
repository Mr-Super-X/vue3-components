<template>
  <div>Tree111</div>
</template>

<script setup lang="ts">
import { computed, CSSProperties, ref, watch } from 'vue'
import { createNamespace } from '@cjp-cli-dev/vue3-components-utils/create'
import { treeProps, TreeNode, TreeOption } from './tree'

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
function createTree(data: TreeOption[]): any {
  function traversal(data: TreeOption[], parent: TreeNode | null = null) {
    return data.map(node => {
      const children = treeOption.getChildren(node) || []

      const treeNode: TreeNode = {
        key: treeOption.getKey(node),
        label: treeOption.getLabel(node),
        children: [], // 默认为空
        rawNode: node,
        level: parent ? parent.level + 1 : 0, // 层级
        // 优先使用用户传递的isLeaf属性，否则判断子级是否存在
        isLeaf: node.isLeaf ?? children.length === 0,
      }

      // 有子级再去递归，将其格式化成treeNode类型
      if (children.length > 0) {
        node.children = traversal(children, treeNode)
      }

      return treeNode
    })
  }

  const result: TreeNode[] = traversal(data)

  return result
}

// 监控数据变化，调用格式化方法，初始执行一次
watch(
  () => props.data,
  (data: TreeOption[]) => {
    treeData.value = createTree(data)
    console.log(treeData.value)
  },
  {
    immediate: true,
  }
)
</script>

<style scoped></style>
