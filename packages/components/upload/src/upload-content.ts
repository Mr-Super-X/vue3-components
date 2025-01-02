import { ExtractPropTypes, PropType } from 'vue'
import { baseProps, NOOP, UploadProgressEvent, uploadProps, UploadRawFile } from "./upload"

export const uploadContentProps = {
  ...baseProps,
  beforeUpload: uploadProps['beforeUpload'],
  onStart: {
    type: Function as PropType<(rawFile: UploadRawFile) => void>,
    default: NOOP
  },
  onProgress: {
    type: Function as PropType<(e: UploadProgressEvent, rawFile: UploadRawFile) => void>,
    default: NOOP
  },
  onSuccess: {
    type: Function as PropType<(res: any, rawFile: UploadRawFile) => void>,
    default: NOOP
  },
  onError: {
    type: Function as PropType<(err: any, rawFile: UploadRawFile) => void>,
    default: NOOP
  },
  onRemove: {
    type: Function as PropType<(rawFile: UploadRawFile) => void>,
    default: NOOP
  },
} as const

// 导出类型
export type UploadContentProps = Partial<ExtractPropTypes<typeof uploadContentProps>>


export interface RequestOptions {
  method: string
  file: File
  name: string,
  action: string
  headers: Record<string, any>
  data: Record<string, any>
  onError: (e: any) => void
  onSuccess: (res: any) => void
  onProgress: (e: UploadProgressEvent) => void
}