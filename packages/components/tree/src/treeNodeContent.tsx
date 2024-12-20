import { defineComponent, inject } from 'vue'
import { TreeInjectionKey, TreeNodeContentProps } from './tree'

// JSX比模板更灵活，用来渲染更复杂的操作，基本操作用模板渲染即可
export default defineComponent({
  name: 'ZTreeNodeContent',
  props: TreeNodeContentProps,
  setup(props) {
    // 注入tree组件传过来的上下文，如slot/emit等等
    const treeContext = inject(TreeInjectionKey)
    const { node } = props
    // 返回render函数
    return () => {
      return treeContext?.slots.default ? treeContext.slots.default({ node }) : node?.label
    }
  },
})
