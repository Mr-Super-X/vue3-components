<template>
  <div :class="[bem.b(), bem.is('selected', isSelected), bem.is('disabled', node?.disabled)]">
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
      <span :class="bem.e('label')" @click="handleSelected">
        <c-tree-node-content :node="node">
          <!-- {{ node?.label }} -->
        </c-tree-node-content>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import Switcher from './icon/Switcher'
import Loading from './icon/Loading'
import CIcon from '@cjp-cli-dev/vue3-components/icon'
import CTreeNodeContent from './treeNodeContent'
import { computed } from 'vue'
import { treeNodeProps, TreeNodeEmits } from './tree'
import { createNamespace } from '@cjp-cli-dev/vue3-components-utils/create'

const bem = createNamespace('tree-node')

const emits = defineEmits(TreeNodeEmits)
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
</script>

<style scoped></style>
