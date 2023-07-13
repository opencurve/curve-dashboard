export type chartData = [number, number][]
export interface ChartSeries {
  type: string
  data: chartData
  name: string
}

export type Recordable<T = any> = Record<string, T>
export interface Fn<T = any, R = T> {
  (...arg: T[]): R
}
