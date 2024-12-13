<script setup lang="ts">
// https://xicons.org/#/zh-CN
import { AccessibilitySharp, AddCircle } from '@vicons/ionicons5'
import { ref } from 'vue'

function createData(level = 4, parentKey = ''): any {
  if (!level) {
    return []
  }

  const arr = new Array(6 - level).fill(0)
  return arr.map((_, idx: number) => {
    const key = parentKey + level + idx
    return {
      label: createLabel(level),
      nodeKey: key,
      children: createData(level - 1, key),
    }
  })
}

function createLabel(level: number): string {
  if (level === 4) {
    return '道生一'
  }
  if (level === 3) {
    return '一生二'
  }
  if (level === 2) {
    return '二生三'
  }
  if (level === 1) {
    return '三生万物'
  }
  return ''
}

const treeData = ref(createData())
</script>

<template>
  <c-icon :size="40" color="red"><AccessibilitySharp /></c-icon>
  <c-icon :size="40" color="yellow"><AddCircle /></c-icon>

  <c-tree
    :data="treeData"
    key-field="nodeKey"
    label-field="label"
    children-field="children"
    :default-expanded-keys="['40', '41']"
  ></c-tree>
</template>

<style scoped></style>
