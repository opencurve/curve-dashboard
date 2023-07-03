<template>
  <div>
    <div ref="main" class="chart"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'

import { getClusterTrendApi } from '@/api/dashboard'
import type { onChange as onTimeChange } from '@/components/TrendChartTimePicker'
import { getEChartsFormatter } from '@/utils/functions'

//获取概览数据从接口

const main = ref<HTMLDivElement>()
let chartIns: echarts.ECharts // NOTE: chartIns实例不能用ref接收，否则会导致echarts的事件监听失效

const state = reactive({
  params: {
    start: 0,
    end: 0,
    interval: 0,
  },
  total: [] as [number, number][],
  alloc: [] as [number, number][],
})

const props = withDefaults(
  defineProps<{
    range: [number, number]
    interval: number
  }>(),
  { interval: 3600, range: () => [0, 0] },
)

const getClusterTrend = async () => {
  // 时间变化，或者集群变化，都要触发请求
  const [err, res] = await getClusterTrendApi(state.params)
  if (err) return console.log('请求报错啦', err)
  const total = [] as [number, number][]
  const alloc = [] as [number, number][]
  res.data.data.forEach(item => {
    total.push([item.timestamp * 1000, item.total])
    alloc.push([item.timestamp * 1000, item.alloc])
  })
  state.total = total
  state.alloc = alloc
  drawChart()
}

const onChange: onTimeChange = async ([start, end], interval) => {
  const params = {
    start: Math.floor(start / 1000),
    end: Math.floor(end / 1000),
    interval: interval,
  }
  state.params = params
  getClusterTrend()
}

const drawChart = () => {
  // 指定图表的配置项和数据
  const formatter = getEChartsFormatter(...props.range)
  var option: echarts.EChartsOption = {
    legend: {
      data: ['总量', '已分配'],
    },
    tooltip: {
      trigger: 'axis',
      show: true,
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
        name: '总量',
        type: 'line',
        data: state.total,
      },
      {
        name: '已分配',
        type: 'line',
        data: state.alloc,
      },
    ],
  }
  chartIns?.setOption(option)
}

onMounted(() => {
  chartIns = echarts.init(main.value!)
  window.addEventListener('resize', () => {
    chartIns.resize()
  })
})

onBeforeUnmount(() => {
  // 销毁 ECharts 实例
  if (main.value) {
    echarts.dispose(main.value)
  }
})

watch(
  () => [props.range, props.interval],
  () => {
    onChange(props.range, props.interval)
  },
)
</script>
<style lang="postcss" scoped>
.chart {
  width: 100%;
  height: 400px;
  margin-top: 8px;
}
</style>
