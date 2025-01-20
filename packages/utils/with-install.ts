import { Plugin, App, Component } from 'vue'

export type SFCWithInstall<T> = T & Plugin

// 给传入的组件添加一个 install 方法
export function withInstall<T>(comp: T) {
  ;(comp as SFCWithInstall<T>).install = function (app: App) {
    const { name } = comp as unknown as { name: string }
    // 注册组件
    app.component(name, comp as Component)
  }

  return comp as SFCWithInstall<T> // 导出组件
}
