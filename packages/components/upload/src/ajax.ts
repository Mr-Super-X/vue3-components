import { RequestOptions } from "./upload-content";
import { UploadProgressEvent } from './upload'

export function httpRequest(options: RequestOptions) {
  const xhr = new XMLHttpRequest()

  const { method, action, headers, data, name, file, onProgress, onSuccess, onError } = options

  // 打开xhr，传入请求方法，请求路径，true表示异步（实现同步请求主要靠改为false）
  xhr.open(method, action, true)

  xhr.upload.addEventListener('progress', (e: ProgressEvent<XMLHttpRequestEventTarget>) => {
    // 加载进度百分比
    const processEvents: UploadProgressEvent = {
      ...e,
      percentage: e.total > 0 ? (e.loaded / e.total) * 100 : 0
    }
    // processEvents.percentage = e.total > 0 ? (e.loaded / e.total) * 100 : 0

    // 调用上传进度钩子
    onProgress(processEvents)
  })

  // 处理headers
  if (headers) {
    for (const [key, value] of Object.entries(headers)) {
      xhr.setRequestHeader(key, value)
    }
  }


  // 处理data
  const formData = new FormData()

  if (data) {
    for (const [key, value] of Object.entries(data)) {
      formData.append(key, value)
    }
  }

  formData.append(name, file)

  // 处理成功
  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      onSuccess(xhr.response)
    } else {
      onError({
        status: xhr.status,
        statusText: xhr.statusText,
        message: xhr.responseText,
      })
    }
  }

  // 处理失败
  xhr.addEventListener('error', (err) => {
    onError(err)
  })

  // 发送数据
  xhr.send(formData)

  return xhr // 方便返回xhr以便在上传结束后做一些操作
}