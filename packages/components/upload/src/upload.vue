<template>
  <upload-content v-bind="uploadContentProps">
    <slot></slot>
  </upload-content>

  {{ uploadFiles }}
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { uploadEmits, UploadFile, UploadFiles, uploadProps, UploadRawFile } from './upload'
import uploadContent from './upload-content.vue'
import { UploadContentProps } from './upload-content'

// 通过unplugin-vue-define-options插件设置组件name
defineOptions({
  name: 'c-upload',
  inheritAttrs: false,
})

const emits = defineEmits(uploadEmits)
// 父组件接收props
const props = defineProps(uploadProps)

const uploadFiles = ref<UploadFiles>(props.fileList)

// 监控文件变化，抛出双向绑定事件
watch(
  () => uploadFiles.value,
  newVal => {
    emits('update:file-list', newVal)
  }
)

const findFile = (rawFile: UploadRawFile) => {
  return uploadFiles.value.find(file => file.uid === rawFile.uid)
}

// 重写uploadContentProps中的props
const uploadContentProps = computed<UploadContentProps>(() => ({
  ...props,
  onStart: rawFile => {
    const { uid, name, size } = rawFile

    const uploadFile: UploadFile = {
      uid,
      name,
      size,
      percentage: 0,
      raw: rawFile,
      status: 'starting',
    }

    // 生成预览路径
    uploadFile.url = URL.createObjectURL(rawFile)

    uploadFiles.value = [...uploadFiles.value, uploadFile]
    props.onChange(uploadFile)
  },
  onProgress: (e, rawFile) => {
    const file = findFile(rawFile)!

    file.status = 'uploading'

    file.percentage = e.percentage

    props.onProgress(e, file, uploadFiles.value)
  },
  onSuccess: (res, rawFile) => {
    const file = findFile(rawFile)!
    file.status = 'success'
    props.onSuccess(res, file, uploadFiles.value)
  },
  onError: (err, rawFile) => {
    const file = findFile(rawFile)!
    file.status = 'error'
    const fileList = uploadFiles.value
    fileList.splice(fileList.indexOf(file), 1)
    props.onError(err, file, fileList)
  },
  onRemove: async rawFile => {
    const file = findFile(rawFile)!

    const r = await props.beforeRemove(file, uploadFiles.value)

    if (r !== false) {
      const fileList = uploadFiles.value
      fileList.splice(fileList.indexOf(file), 1)
      props.onRemove(file, fileList)
    }
  },
}))
</script>

<style scoped></style>
