<template>
  <div ref="main" class="chart"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted, ref, watch } from 'vue'

import { getEChartsFormatter } from '@/utils/functions'
import type { ChartSeries } from '#/index'

const main = ref<HTMLDivElement>()
let chartIns: echarts.ECharts // NOTE: chartIns实例不能用ref接收，否则会导致echarts的事件监听失效

const props = withDefaults(
  defineProps<{
    data: ChartSeries[]
    range: [number, number]
    title: string
    color?: string[]
    yAxisFormatter?: string
  }>(),
  {
    data: () => [],
    range: () => [0, 0],
    color: () => [],
    yAxisFormatter: '{value} MB/s',
  },
)

const drawChart = () => {
  const formatter = getEChartsFormatter(...props.range)
  const legendData = props.data.map(({ name }) => name as string)

  const option = {
    title: { text: props.title },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      bottom: '2px',
      data: legendData,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'time',
      axisLabel: {
        formatter,
      },
    },
    yAxis: {
      type: 'value',
      scale: true,
      axisLabel: {
        formatter: props.yAxisFormatter,
      },
    },
    series: props.data,
  }

  type Opt = typeof option

  const chartOpt: Opt & { color?: string[] } = {
    ...option,
  }

  if (props.color.length) chartOpt.color = props.color

  chartIns.setOption(chartOpt)
}

onMounted(() => {
  chartIns = echarts.init(main.value!)
  window.addEventListener('resize', () => {
    chartIns.resize()
  })
})

// 因为父元素中赋值和push是一起出发的，这种监听的操作可以监听到数据变化
watch(() => props.data, drawChart)
</script>
<style lang="postcss" scoped>
.chart {
  width: 100%;
  height: 400px;
  margin-top: 8px;
}
</style>
