import { ExtractPropTypes, PropType } from "vue"

// 包装文件类型
export interface UploadFile {
  uid?: number // 文件的唯一id
  name: string // 文件的名称
  url?: string // 文件预览路径
  percentage?: number // 上传的进度
  raw?: File // 原始文件
  size?: number // 文件大小
  status: string // 上传的状态
}

// 文件列表类型
export type UploadFiles = UploadFile[];
// 扩展原始文件类型
export type UploadRawFile = File & { uid: number }
// 扩展上传进度类型
export type UploadProgressEvent = ProgressEvent & { percentage: number }
// 空函数默认值
export const NOOP = () => { }

// 提供给用户使用的基本props
export const baseProps = {
  fileList: { // 上传的文件列表
    type: Array as PropType<UploadFiles>,
    default: () => [] as const
  },
  action: { // 上传的地址
    type: String,
    default: ''
  },
  multiple: { // 上传多个文件，默认单个
    type: Boolean,
    default: false,
  },
  // input需要的
  name: { // 上传的文件名，默认file
    type: String,
    default: 'file'
  },
  accept: { // 允许上传的文件类型
    type: String,
    default: ''
  },
  // 上传文件ajax需要的
  method: { // 请求方法，默认post
    type: String,
    default: 'post'
  },
  headers: { // 请求头
    type: Object as PropType<Record<string, string>>,
    default: () => ({})
  },
  data: { // 请求体
    type: Object as PropType<Record<string, any>>,
    default: () => ({})
  },
  drag: { // 是否可拖拽上传
    type: Boolean,
    default: false,
  }
} as const

// 提供给用户使用的钩子props
export const hookProps = {
  onPreview: { // 预览的钩子
    type: Function as PropType<(file: UploadFile) => void>,
    default: NOOP,
  },
  beforeUpload: { // 文件上传前的钩子
    type: Function as PropType<(file: UploadRawFile) => Promise<boolean> | boolean>,
    default: NOOP,
  },
  onChange: { // 文件变更时的钩子
    type: Function as PropType<(file: UploadFile) => void>,
    default: NOOP,
  },
  beforeRemove: { // 文件删除前的钩子
    type: Function as PropType<(file: UploadFile, uploadFiles: UploadFiles) => Promise<boolean> | boolean>,
    default: NOOP,
  },
  onRemove: { // 文件删除后的钩子
    type: Function as PropType<(file: UploadFile, uploadFiles: UploadFiles) => void>,
    default: NOOP,
  },
  onProgress: { // 文件上传中的钩子
    type: Function as PropType<(file: UploadProgressEvent, uploadFile: UploadFile, uploadFiles: UploadFiles) => void>,
    default: NOOP,
  },
  onSuccess: { // 文件上传成功的钩子
    type: Function as PropType<(response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => void>,
    default: NOOP,
  },
  onError: { // 文件上传失败的钩子
    type: Function as PropType<(error: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => void>,
    default: NOOP,
  },
} as const

// 组件的props
export const uploadProps = {
  ...baseProps,
  ...hookProps,
} as const


// 组件的emit事件
export const uploadEmits = {
  // 同步响应式v-model:file-list
  'update:file-list': (fileList: UploadFiles) => fileList,
} as const

// 导出类型
export type UploadProps = Partial<ExtractPropTypes<typeof uploadProps>>
// 导出事件
export type UploadEmits = Partial<ExtractPropTypes<typeof uploadEmits>>

// 生成uid
let uid = 0
export const genUid = () => uid++