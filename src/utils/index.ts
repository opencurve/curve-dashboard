import { NIcon } from 'naive-ui'
import type { Component } from 'vue'
import { h } from 'vue'
export type LiteralUnion<T extends U, U = string> =
  | T
  | (U & { neverKey?: never }) // 单词枚举联合类型,如果是u&{}，我的编辑器会把后者识别成string,导致整体识别成string

export type Recordable<T = any> = Record<string, T>

export function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}
