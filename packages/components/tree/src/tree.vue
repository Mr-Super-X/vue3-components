<template>
  <div :class="bem.b()">
    <!-- 动画可以使用内置transition-group组件来完成 -->
    <c-virtual-list :items="flattenTree" :remain="8" :size="30">
      <template #default="{ node }">
        <c-tree-node
          :key="node.nodeKey"
          :node="node"
          :expended="isExpanded(node)"
          :loading-keys="loadingKeysRef"
          :selected-keys="selectedKeysRef"
          :show-checkbox="showCheckbox"
          :checked="isChecked(node)"
          :disabled="isDisabled(node)"
          :indeterminate="isIndeterminate(node)"
          :data-level="node.level"
          @toggle="toggleExpand"
          @select="handleSelect"
          @check="handleCheck"
        />
      </template>
    </c-virtual-list>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, provide, ref, useSlots, watch } from 'vue'
import { createNamespace } from '@cjp-cli-dev/vue3-components-utils/create'
import { treeProps, TreeNode, TreeOption, Key, treeEmits, TreeInjectionKey } from './tree'
import CTreeNode from './treeNode.vue'
import CVirtualList from '@cjp-cli-dev/vue3-components/virtual-list'

// 需安装：unplugin-vue-define-options
defineOptions({
  name: 'c-tree', // 定义组件的名字
})

const bem = createNamespace('tree')

const props = defineProps(treeProps)

// 有了props之后，要对用户传入的参数进行格式化
const treeData = ref<TreeNode[]>([])

// 1、实现辅助方法，用于动态获取用户传入的数据
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

// 2、实现格式化方法，将用户传入的数据进行格式化
function createTree(tree: TreeOption[], parent: TreeNode | null = null): any {
  function traversal(data: TreeOption[], parent: TreeNode | null = null) {
    return data.map(node => {
      const children = treeOption.getChildren(node) || []

      const treeNode: TreeNode = {
        nodeKey: treeOption.getKey(node),
        label: treeOption.getLabel(node),
        children: [], // 默认为空
        rawNode: node,
        level: parent ? parent.level + 1 : 0, // 层级
        disabled: !!node.disabled, // 是否禁用
        // 优先使用用户传递的isLeaf属性，否则判断子级是否存在
        isLeaf: node.isLeaf ?? children.length === 0,
        parentKey: parent?.nodeKey, // 父节点key
      }

      // 有子级再去递归，将其格式化成treeNode类型
      if (children.length > 0) {
        treeNode.children = traversal(children, treeNode)
      }

      return treeNode
    })
  }

  const result: TreeNode[] = traversal(tree, parent)

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

// 3、拍平树结构，动态计算展开节点，为实现虚拟列表做铺垫
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

const loadingKeysRef = ref(new Set<Key>())

function triggerLoading(node: TreeNode) {
  // 不是叶子节点且没有子节点，则需要异步加载
  if (!node.children.length && !node.isLeaf) {
    const loadingKeys = loadingKeysRef.value
    // 如果没有加载过节点才加载
    if (!loadingKeys.has(node.nodeKey)) {
      loadingKeys.add(node.nodeKey)
      const onLoad = props.onLoad
      // 判断onLoad是否存在，存在则调用
      if (onLoad) {
        onLoad(node.rawNode).then(children => {
          // 修改原来的节点
          node.rawNode.children = children
          // 更新自定义节点
          node.children = createTree(children, node)
          // 清除状态
          loadingKeys.delete(node.nodeKey)
        })
      }
    }
  }
}

// 展开功能
function expand(node: TreeNode) {
  expandedKeysSet.value.add(node.nodeKey)

  triggerLoading(node)
}

// 4、实现点击展开折叠节点功能
function toggleExpand(node: TreeNode) {
  const expandKeys = expandedKeysSet.value
  // 当前节点已展开且没有正在加载时才折叠
  if (expandKeys.has(node.nodeKey) && !loadingKeysRef.value.has(node.nodeKey)) {
    collapse(node)
  } else {
    expand(node)
  }
}

// 5、实现选中节点
const emits = defineEmits(treeEmits)

const selectedKeysRef = ref<Key[]>([])

watch(
  () => props.selectedKeys,
  value => {
    if (value) {
      selectedKeysRef.value = value
    }
  },
  {
    immediate: true,
  }
)

// 处理选中节点
function handleSelect(node: TreeNode) {
  // 拷贝数组
  let keys = Array.from(selectedKeysRef.value)

  if (!props.selectable) return // 不能选择无需继续

  // 处理多选和单选
  if (props.multiple) {
    const idx = keys.findIndex(key => key === node.nodeKey)
    // 存在删除，不存在推入
    if (idx === -1) {
      keys.push(node.nodeKey)
    } else {
      keys.splice(idx, 1)
    }
  } else {
    if (keys.includes(node.nodeKey)) {
      keys = []
    } else {
      keys = [node.nodeKey]
    }
  }

  emits('update:selectedKeys', keys)
}

// 透传插槽
provide(TreeInjectionKey, {
  slots: useSlots(),
})

const checkedKeysRef = ref(new Set(props.defaultCheckedKeys))

function isChecked(node: TreeNode) {
  return checkedKeysRef.value.has(node.nodeKey)
}

function isDisabled(node: TreeNode) {
  return !!node.disabled
}

const indeterminateKeysRef = ref<Set<Key>>(new Set())

function isIndeterminate(node: TreeNode) {
  return indeterminateKeysRef.value.has(node.nodeKey)
}

// 从父节点开始更新子节点（从外到内）
function toggleCheck(node: TreeNode, checked: boolean) {
  // 处理node不存在时的边界情况
  if (!node) return

  const checkedKeys = checkedKeysRef.value

  // 已经选中时，去除半选状态
  if (checked) {
    indeterminateKeysRef.value.delete(node.nodeKey)
  }

  // 选中就添加，不选中就删除
  checkedKeys[checked ? 'add' : 'delete'](node.nodeKey)

  // 子节点状态联动
  const children = node.children
  if (children) {
    children.forEach(childNode => {
      // 子节点处在非禁用状态时选中
      if (!childNode.disabled) {
        toggleCheck(childNode, checked)
      }
    })
  }
}

function findNode(key: Key) {
  return flattenTree.value.find(node => node.nodeKey === key)
}

// 从子节点开始更新父节点（从内到外）
function updateCheckedKeys(node: TreeNode) {
  // 当前节点存在父节点才需要更新
  if (node.parentKey) {
    const parentNode = findNode(node.parentKey)

    // 处理parentNode不存在的边界情况
    if (!parentNode) return

    let allChecked = true // 默认全选子节点
    let hasChecked = false // 子节点有没有选中

    const nodes = parentNode?.children || []

    // 遍历子节点，处理全选状态，一共分三种情况
    // 1. 子节点被选中
    // 2. 子节点有半选
    // 3. 子节点没有被选中
    for (let n of nodes) {
      if (checkedKeysRef.value.has(n.nodeKey)) {
        hasChecked = true // 子节点被选中了
      } else if (indeterminateKeysRef.value.has(n.nodeKey)) {
        allChecked = false // 有半选的子节点则全选状态为false
        hasChecked = true
      } else {
        allChecked = false // 子节点没有被选中且没有半选，则全选状态为false
      }
    }

    if (allChecked) {
      // 如果全选状态为true，则将父节点的key添加到checkedKeysRef
      // 并去除父节点的半选状态
      checkedKeysRef.value.add(parentNode.nodeKey)
      indeterminateKeysRef.value.delete(parentNode.nodeKey)
    } else if (hasChecked) {
      // 如果有子节点被选中（包含半选，因为当前子节点可能还有子节点），则去除父节点选中状态
      // 并为父节点添加半选状态
      checkedKeysRef.value.delete(parentNode.nodeKey)
      indeterminateKeysRef.value.add(parentNode.nodeKey)
    } else {
      // 如果全选状态为false且没有选中的子节点（包含半选），则去除父节点选中和半选状态
      checkedKeysRef.value.delete(parentNode.nodeKey)
      indeterminateKeysRef.value.delete(parentNode.nodeKey)
    }

    // 节点自己的状态更新完了再去更新父节点状态，调用递归处理
    updateCheckedKeys(parentNode)
  }
}

// 当复选框被点击的时候触发事件
function handleCheck(node: TreeNode, checked: boolean) {
  // 触发更新，点击父节点时向下选中所有子节点，点击子节点时向上更新父节点
  toggleCheck(node, checked)
  updateCheckedKeys(node)
}

onMounted(() => {
  // 组件加载完后初始执行选中key操作
  checkedKeysRef.value.forEach((key: Key) => {
    toggleCheck(findNode(key) as TreeNode, true)
  })
})
</script>

<style scoped></style>
