<template>
  <div :class="bem.b()" @click="handleClick">
    <!-- 是否启用退拽上传 -->
    <template v-if="drag">
      <UploadDragger @file="uploadFiles">
        <slot></slot>
      </UploadDragger>
    </template>
    <template v-else>
      <slot></slot>
    </template>

    <input
      ref="inputRef"
      type="file"
      :class="bem.e('input-file')"
      :name="name"
      :accept="accept"
      :multiple="multiple"
      @change="handleChange"
    />
  </div>
</template>

<script setup lang="ts">
import { createNamespace } from '@cjp-cli-dev/vue3-components-utils/create'
import { genUid, UploadRawFile } from './upload'
import { ref } from 'vue'
import { uploadContentProps } from './upload-content'
import { httpRequest } from './ajax'

import UploadDragger from './upload-dragger.vue'

// 通过unplugin-vue-define-options插件设置组件name
defineOptions({
  name: 'c-upload-content',
  inheritAttrs: false,
})

// 创建bem规范命名空间
const bem = createNamespace('upload')
const props = defineProps(uploadContentProps)

const inputRef = ref<HTMLInputElement>()

const handleClick = () => {
  // 点击上传前先清空文件
  inputRef.value!.value = ''
  // 模拟触发input file的点击
  inputRef.value?.click()
}

const upload = async (rawFile: UploadRawFile) => {
  // 上传前先清空文件
  inputRef.value!.value = ''

  const result = await props.beforeUpload(rawFile)

  // 没有结果终止执行，并调用onRemove钩子
  if (!result) return props.onRemove(rawFile)

  // 添加ajax上传逻辑
  const { method, name, action, data, headers, onError, onProgress, onSuccess } = props
  httpRequest({
    method,
    file: rawFile,
    name,
    action,
    data,
    headers,
    onError: e => {
      onError(e, rawFile)
    },
    onProgress: e => {
      onProgress(e, rawFile)
    },
    onSuccess: res => {
      onSuccess(res, rawFile)
    },
  })
}

function uploadFiles(files: FileList | never[]) {
  for (let i = 0; i < files.length; i++) {
    // 拿到原始文件
    const rawFile = files[i] as UploadRawFile
    // 添加uid
    rawFile.uid = genUid()
    // 调用上传前的钩子
    props.onStart(rawFile)
    // 上传
    upload(rawFile)
  }
}

const handleChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files || []

  uploadFiles(files)
}
</script>

<style scoped></style>
