<template>
  <div :class="bem.b()">
    <div
      :class="[bem.e('content'), bem.is('expended', expended && !node?.isLeaf)]"
      :style="{ paddingLeft: `${defaultNodeLevelPaddingLeft}px` }"
    >
      <span
        :class="[
          bem.e('expend-icon'),
          bem.is('leaf', node?.isLeaf),
          { [bem.em('expend-icon', 'expended')]: expended && !node?.isLeaf },
        ]"
        @click="handleExpand"
      >
        <c-icon size="20" color="blue"><Switcher /></c-icon>
      </span>
      <span :class="bem.e('label')">{{ node?.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import Switcher from './icon/Switcher'
import CIcon from '@cjp-cli-dev/vue3-components/icon'
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
</script>

<style scoped></style>
