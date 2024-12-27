import { ExtractPropTypes, InjectionKey, PropType } from "vue";
import { Arrayable, FormItemContext, FormItemRule } from "./form-item";

export const formProps = {
  model: Object,
  rules: Object as PropType<Record<string, Arrayable<FormItemRule>>>,
  showMessage: {
    // 是否显示错误消息文本，默认显示
    type: Boolean,
    default: true,
  },
} as const


// 导出类型
export type FormProps = Partial<ExtractPropTypes<typeof formProps>>

export interface FormContext extends FormProps {
  // 让formItem组件加载后调用该方法把所有字段交给form组件管理
  addField: (field: FormItemContext) => void
}
export const formContextKey: InjectionKey<FormContext> = Symbol()