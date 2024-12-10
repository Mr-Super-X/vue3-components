# Icon 图标

c-ui 推荐使用 [xicons](https://xicons.org/#/zh-CN) 作为图标库，你需要先安装它到你的项目中。

```bash
pnpm install @vicons/ionicons5
```

## 使用图标

- 如果你想像用例一样直接使用，你需要全局注册组件。

<!-- vitepress中天然支持vue组件 -->
<script setup lang="ts">
import { AccessibilitySharp } from '@vicons/ionicons5'
</script>

<div>
  <c-icon :size="40" color="red">
    <AccessibilitySharp />
  </c-icon>
  <c-icon :size="40" color="yellow">
    <AccessibilitySharp />
  </c-icon>
</div>

<div>
  <c-icon :size="60" color="red">
    <AccessibilitySharp />
  </c-icon>
  <c-icon :size="60" color="yellow">
    <AccessibilitySharp />
  </c-icon>
</div>

<div>
  <c-icon :size="80" color="red">
    <AccessibilitySharp />
  </c-icon>
  <c-icon :size="80" color="yellow">
    <AccessibilitySharp />
  </c-icon>
</div>

<details>

<summary style="cursor: pointer; color: #1989fa;">显示代码</summary>

```vue
<script setup lang="ts">
// 打开网站：https://xicons.org/#/zh-CN
// 复制名称并使用import导入即可使用
import { AccessibilitySharp } from '@vicons/ionicons5'
</script>

<template>
  <c-icon :size="40" color="red">
    <AccessibilitySharp />
  </c-icon>
</template>
```

</details>

## API

### Icon Props

| 名称  | 类型             | 默认值    | 说明                   |
| ----- | ---------------- | --------- | ---------------------- |
| color | string           | undefined | 图标颜色               |
| size  | number \| string | undefined | 图标大小（不用带单位） |
