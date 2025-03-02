<template>
  <div :class="[bem.b(), bem.is('selected', !!isSelected), bem.is('disabled', node?.disabled)]">
    <div
      :class="[bem.e('content'), bem.is('expended', expended && !node?.isLeaf)]"
      :style="{ paddingLeft: `${defaultNodeLevelPaddingLeft}px` }"
    >
      <c-icon
        size="20"
        color="blue"
        :class="[
          bem.e('expend-icon'),
          bem.is('leaf', node?.isLeaf),
          { [bem.em('expend-icon', 'expended')]: expended && !node?.isLeaf },
        ]"
        @click="handleExpand"
      >
        <Switcher class="icon-switch" v-if="!isLoading" />
        <Loading class="icon-loading" v-else />
      </c-icon>

      <c-checkbox
        v-if="showCheckbox"
        :model-value="checked"
        :disabled="disabled"
        :indeterminate="indeterminate"
        @change="handleCheckedChange"
      ></c-checkbox>

      <span :class="bem.e('label')" @click="handleSelected">
        <c-tree-node-content :node="node">
          <!-- {{ node?.label }} -->
        </c-tree-node-content>
      </span>
    </div>
  </div>
</template>

<!-- 解决ts无法解析并输出声明文件 -->
<script lang="ts">
export default {}
</script>

<script setup lang="ts">
import Switcher from '@cjp-cli-dev/vue3-components/internal-icon/Switcher'
import Loading from '@cjp-cli-dev/vue3-components/internal-icon/Loading'
import CIcon from '@cjp-cli-dev/vue3-components/icon'
import CCheckbox from '@cjp-cli-dev/vue3-components/checkbox'
import CTreeNodeContent from './treeNodeContent'
import { computed } from 'vue'
import { treeNodeProps, treeNodeEmits, TreeNode } from './tree'
import { createNamespace } from '@cjp-cli-dev/vue3-components-utils/create'

const bem = createNamespace('tree-node')

const emits = defineEmits(treeNodeEmits)
const props = defineProps(treeNodeProps)

function handleExpand() {
  // 非空断言
  emits('toggle', props.node!)
}

// 根据层级来计算左侧内边距，默认 层级 * 18 px
const defaultNodeLevelPaddingLeft = computed(() => {
  return props.node?.level! * 18
})

// 是否正在加载中
const isLoading = computed(() => {
  return props.loadingKeys?.has(props.node?.nodeKey!)
})

// 是否选中
const isSelected = computed(() => {
  return props.selectedKeys?.includes(props.node?.nodeKey!)
})

function handleSelected() {
  // 是否禁用
  if (props.node?.disabled) return

  emits('select', props.node!)
}

// checkbox改变事件
function handleCheckedChange(val: boolean) {
  emits('check', props.node as TreeNode, val)
}
</script>

<style scoped></style>
