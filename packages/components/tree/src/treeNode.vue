<template>
  <div :class="bem.b()">
    <div :class="bem.e('content')">
      <span :class="[bem.e('expend-icon')]">
        <c-icon size="16" color="blue"><Switcher /></c-icon>
      </span>
      <span :class="bem.e('label')">{{ node.label }}</span>
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
