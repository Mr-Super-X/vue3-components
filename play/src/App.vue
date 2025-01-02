<script setup lang="ts">
// https://xicons.org/#/zh-CN
import { FormInstance } from '@cjp-cli-dev/vue3-components/form'
import { Key, TreeOption } from '@cjp-cli-dev/vue3-components/tree'
import { UploadRawFile } from '@cjp-cli-dev/vue3-components/upload'
import { AccessibilitySharp, AddCircle } from '@vicons/ionicons5'
import { reactive, ref } from 'vue'

function createData(level = 4, parentKey = ''): any {
  if (!level) {
    return []
  }

  const arr = new Array(20 - level).fill(0)
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

// 测试异步加载
// function createData() {
//   return [
//     {
//       label: nextLabel(),
//       nodeKey: 1,
//       isLeaf: false, // 动态加载子节点
//     },
//     {
//       label: nextLabel(),
//       nodeKey: 2,
//       isLeaf: false,
//     },
//   ]
// }

// function nextLabel(currentLabel?: string): string {
//   if (!currentLabel) return 'Out of Tao，One is born'
//   if (currentLabel === 'Out of Tao，One is born') return 'Out of One，Two'
//   if (currentLabel === 'Out of One，Two') return 'Out of Two，Three'
//   if (currentLabel === 'Out of Two，Three') return 'Out of Three，the created universe'
//   if (currentLabel === 'Out of Three，the created universe') return 'Out of Tao，One is born'

//   return ''
// }

const handleLoad = (node: TreeOption) => {
  return new Promise<TreeOption[]>((resolve, reject) => {
    // 模拟异步加载数据
    setTimeout(() => {
      resolve([
        {
          label: nextLabel(node.label),
          nodeKey: node.nodeKey + nextLabel(node.label),
          isLeaf: false, // 动态加载子节点
        },
      ])
    }, 1000)
  })
}

const treeData = ref(createData())

// 测试禁用数据
// const treeData = ref<TreeOption[]>([
//   {
//     nodeKey: '0',
//     label: '0',
//     children: [
//       {
//         nodeKey: '0-0',
//         label: '0-0',
//       },
//       {
//         disabled: true, // 禁用节点
//         nodeKey: '0-1',
//         label: '0-1',
//         children: [
//           {
//             nodeKey: '0-1-0',
//             label: '0-1-0',
//           },
//           {
//             nodeKey: '0-1-1',
//             label: '0-1-1',
//           },
//         ],
//       },
//     ],
//   },
// ])

const value = ref<Key[]>([])

const checked = ref(true)

function onCheckboxChange(val: boolean) {
  console.log(val)
}

const handleClick = () => {
  console.log(123)
}

const username = ref('hello')

const onInputFocus = (e: Event) => {
  console.log('🚀 ~ onInputFocus ~ e:', (e.target as HTMLInputElement).value)
}

const onInputBlur = (e: Event) => {
  console.log('🚀 ~ onInputBlur ~ e:', (e.target as HTMLInputElement).value)
}

const state = reactive({
  username: '',
  password: '',
})

const formRef = ref<FormInstance>()

const handleSubmit = async () => {
  formRef.value?.validate((valid, errors) => {
    console.log(valid, errors)
  })
}

const handleUpload = () => {}

const onBeforeUpload = (rawFile: UploadRawFile) => {
  console.log('🚀 ~ onBeforeUpload ~ rawFile:', rawFile)
  return true
}
</script>

<template>
  <c-icon :size="40" color="red"><AccessibilitySharp /></c-icon>
  <c-icon :size="40" color="yellow"><AddCircle /></c-icon>

  <c-tree
    v-model:selected-keys="value"
    selectable
    show-checkbox
    :default-checked-keys="['40', '41']"
    :data="treeData"
    :on-load="handleLoad"
  >
    <template #default="{ node }">
      {{ node.nodeKey }}
      -
      {{ node.label }}
    </template>
  </c-tree>

  {{ checked }}
  <c-checkbox
    v-model="checked"
    label="节点"
    :disabled="false"
    :indeterminate="true"
    @change="onCheckboxChange"
  ></c-checkbox>

  <br />

  <c-button @click="handleClick" size="medium" loading round type="danger">
    <template #icon>
      <c-icon :size="20" color="yellow"><AddCircle /></c-icon>
    </template>
    按钮
  </c-button>

  <br />

  <c-input v-model="username" :show-password="true" clearable @focus="onInputFocus" @blur="onInputBlur">
    <template #prepend>哈哈</template>
    <template #prefix>
      <c-icon :size="20"><AddCircle /></c-icon>
    </template>
    <!-- <template #suffix>
      <c-icon :size="20"><AccessibilitySharp /></c-icon>
    </template> -->
    <template #append>呵呵</template>
  </c-input>
  {{ username }}

  <br />

  <c-form
    ref="formRef"
    :model="state"
    :rules="{
      username: [{ min: 6, max: 10, message: '用户名长度6-10位', trigger: ['blur', 'change'] }],
    }"
  >
    <c-form-item prop="username" label="用户名" :rules="[{ required: true, message: '请输入用户名', trigger: 'blur' }]">
      <template #label>用户名：</template>
      <!-- <template #error>自定义错误信息</template> -->
      <c-input v-model="state.username" placeholder="请输入用户名"></c-input>
    </c-form-item>
    <c-form-item prop="password" label="用户名" :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]">
      <template #label>密码：</template>
      <!-- <template #error>自定义错误信息</template> -->
      <c-input v-model="state.password" placeholder="请输入密码" type="password"></c-input>
      <c-button @click="handleSubmit" size="medium" type="primary">提交</c-button>
    </c-form-item>
  </c-form>

  <br />

  <!-- 进入server项目，启动express服务进行测试 -->
  <c-upload multiple :before-upload="onBeforeUpload" action="http://localhost:4000/upload" drag>
    <c-button @click="handleUpload" size="small" type="primary">点击上传</c-button>
  </c-upload>
</template>

<style scoped></style>
