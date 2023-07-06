export type chartData = [number, number][]
export interface ChartSeries {
  type: string
  data: chartData
  name: string
}
