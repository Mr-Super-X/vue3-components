import { ExtractPropTypes } from "vue"

// 组件的事件
export const uploadDraggerEmits = {
  // 拖拽上传的文件集合事件
  file: (fileList: File[]) => fileList,
} as const

export type UploadDraggerEmits = Partial<ExtractPropTypes<typeof uploadDraggerEmits>>