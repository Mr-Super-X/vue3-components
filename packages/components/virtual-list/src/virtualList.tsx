/* @jsxImportSource vue */
/* 顶部注释是vue的标记位，用于获得vue jsx类型推导，也可以加在tsconfig.json中，https://cn.vuejs.org/guide/extras/render-function#jsx-type-inference */
import { createNamespace } from '@cjp-cli-dev/vue3-components-utils/create'
import { computed, defineComponent, onMounted, reactive, ref, watch } from 'vue'

export default defineComponent({
  name: 'c-virtual-list',
  props: {
    items: {
      // 数据，不限制具体类型，只要是数组即可
      type: Array,
      default: () => [],
    },
    size: {
      // 一条的高度大小是多少
      type: Number,
      default: 30,
    },
    remain: {
      // 显示几条
      type: Number,
      default: 8,
    },
  },
  setup(props, { slots }) {
    const bem = createNamespace('virtual-list')
    const wrapperRef = ref<HTMLElement>()
    const scrollBarRef = ref<HTMLElement>()

    const state = reactive({
      // 计算显示的区域
      start: 0,
      end: props.remain,
    })

    const prev = computed(() => {
      // 如果前面要补的条数不够，则取最小能补的条数
      return Math.min(state.start, props.remain)
    })

    const next = computed(() => {
      // 如果后面要补的条数不够，则取最小能补的条数
      return Math.min(props.items.length - state.end, props.remain)
    })

    // 计算显示的数据
    const visibleData = computed(() => {
      // 展示3屏，返回前remain和后remain条数据，保证用户在快速滚动时不会白屏
      return props.items.slice(state.start - prev.value, state.end + next.value)
    })

    // 偏移量
    const offset = ref(0)

    // 监听滚动事件，计算开始和结束位置以及当前滚动偏移量
    const onScroll = () => {
      // 根据当前滚动距离计算滚动了几个数据
      const scrollTop = wrapperRef.value!.scrollTop

      state.start = Math.floor(scrollTop / props.size)
      state.end = state.start + props.remain
      // 当前位置 - 补充的数量 = 偏移量
      offset.value = state.start * props.size - props.size * prev.value
    }

    // 更新滚动高度函数
    const updateScrollHeight = () => {
      wrapperRef.value!.style.height = props.remain * props.size + 'px'
      scrollBarRef.value!.style.height = props.items.length * props.size + 'px'
    }

    // 当数据发生变化时，动态更新滚动高度
    watch(
      () => props.items,
      () => {
        updateScrollHeight()
      }
    )

    // 初始计算滚动高度
    onMounted(() => {
      updateScrollHeight()
    })

    return () => {
      return (
        <div class={bem.b()} ref={wrapperRef} onScroll={onScroll}>
          {/* 模拟滚动条长度 */}
          <div class={bem.e('scroll-bar')} ref={scrollBarRef}></div>
          {/* 更新列表显示内容，永远只展示props.remain条数据 */}
          <div class={bem.e('scroll-list')} style={{ transform: `translate3d(0, ${offset.value}px, 0)` }}>
            {visibleData.value.map((node, idx) => slots.default!({ node }))}
          </div>
        </div>
      )
    }
  },
})
