<template>
  <div ref="main" style="width: 100%; height: 400px"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { ref, watch } from 'vue'

import router from '@/router'
import { useBlockStore } from '@/store/blockStorageManagement/block'

const blockStore = useBlockStore()
const { state } = blockStore

//获取概览数据从接口

const main = ref<HTMLDivElement>() // 使用ref创建虚拟DOM引用，使用时用main.value

function timestampToTime(timestamp: number) {
  const dateObj = new Date(+timestamp * 1000) // ps, 必须是数字类型，不能是字符串, +运算符把字符串转化为数字，更兼容
  const year = dateObj.getFullYear() // 获取年，
  const month = dateObj.getMonth() + 1 // 获取月，必须要加1，因为月份是从0开始计算的
  const date = dateObj.getDate() // 获取日，记得区分getDay()方法是获取星期几的。
  const hours = pad(dateObj.getHours()) // 获取时, pad函数用来补0
  const minutes = pad(dateObj.getMinutes()) // 获取分
  const seconds = pad(dateObj.getSeconds()) // 获取秒
  return hours + ':' + minutes + ':' + seconds
}

function pad(str: any) {
  return +str >= 10 ? str : '0' + str
}
const timeStamp: Array<string> = []
const readBPS: Array<number> = []
const writeBPS: Array<number> = []

const { path } = router.currentRoute.value.params
let handledPath = Array.isArray(path) ? path.join('/') : path
handledPath = '/' + handledPath
const params = {
  volumeName: handledPath,
}

const drawChart = () => {
  let volumePerformance = state.volumePerformance

  volumePerformance.forEach(item => {
    let convertedTime = timestampToTime(item.timestamp)
    timeStamp.push(convertedTime)

    let readBPSdata = +item.readBPS / (1024 * 1024)
    let writeBPSdata = +item.writeBPS / (1024 * 1024)
    readBPSdata = readBPSdata.toFixed(2)
    writeBPSdata = writeBPSdata.toFixed(2)
    readBPS.push(readBPSdata)
    writeBPS.push(writeBPSdata)
  })

  // 基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(main.value)
  // 指定图表的配置项和数据
  var option = {
    title: { text: '卷带宽' },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['读带宽', '写带宽'],
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: timeStamp,
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value} MB/s',
      },
    },
    series: [
      {
        name: '读带宽',
        type: 'line',
        data: readBPS,
      },
      {
        name: '写带宽',
        type: 'line',
        data: writeBPS,
      },
    ],
  }
  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option)
}

watch(state, () => {
  drawChart()
})
</script>
