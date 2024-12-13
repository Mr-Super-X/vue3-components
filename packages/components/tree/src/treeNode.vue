<template>
  <div :class="bem.b()">
    <div :class="bem.e('content')" :style="{ paddingLeft: `${node?.level * 16}px` }">
      <span :class="[bem.e('expend-icon'), { expended: expended && !node?.isLeaf }]">
        <c-icon size="20" color="blue"><Switcher /></c-icon>
      </span>
      <span :class="bem.e('label')">{{ node?.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import Switcher from './icon/Switcher'
import CIcon from '@cjp-cli-dev/vue3-components/icon'
import { treeNodeProps } from './tree'
import { createNamespace } from '@cjp-cli-dev/vue3-components-utils/create'

const bem = createNamespace('tree-node')

defineProps(treeNodeProps)
</script>

<style scoped></style>
