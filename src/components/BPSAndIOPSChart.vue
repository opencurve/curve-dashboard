<template>
  <div ref="main" class="chart"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted, ref, watch } from 'vue'

import { getEChartsFormatter } from '@/utils/functions'

type chartData = [number, number][]
const main = ref<HTMLDivElement>()
let chartIns: echarts.ECharts // NOTE: chartIns实例不能用ref接收，否则会导致echarts的事件监听失效

const props = withDefaults(
  defineProps<{
    readList: chartData
    writeList: chartData
    range: [number, number]
    title: string
    readTitle?: string
    writeTitle?: string
  }>(),
  {
    writeList: () => [],
    readList: () => [],
    range: () => [0, 0],
    readTitle: '',
    writeTitle: '',
  },
)

const drawChart = () => {
  const formatter = getEChartsFormatter(...props.range)
  const readTitle = props.readTitle || `读${props.title}`
  const writeTitle = props.writeTitle || `写${props.title}`

  var option = {
    title: { text: props.title },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: [readTitle, writeTitle],
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
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
      axisLabel: {
        formatter: '{value} MB/s',
      },
    },
    series: [
      {
        name: readTitle,
        type: 'line',
        data: props.readList,
      },
      {
        name: writeTitle,
        type: 'line',
        data: props.writeList,
      },
    ],
  }
  chartIns.setOption(option)
}

onMounted(() => {
  chartIns = echarts.init(main.value!)
  window.addEventListener('resize', () => {
    chartIns.resize()
  })
})

// 因为父元素中赋值和push是一起出发的，这种监听的操作可以监听到数据变化
watch(() => [props.writeList, props.readList], drawChart)
</script>
<style lang="postcss" scoped>
.chart {
  width: 100%;
  height: 400px;
  margin-top: 8px;
}
</style>
