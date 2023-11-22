<template>
  <button @click="Try">Button</button>
  <div ref="main" style="width: 100%; height: 400px"></div>
</template>

<script setup lang="ts">
import type { ECharts } from 'echarts'
import * as echarts from 'echarts'
import { onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'

import { getClusterStatusApi } from '@/api/dashboard'
import { useDashboardStore } from '@/store/clusterOverview/dashboard'
const dashBoardStore = useDashboardStore()
const state = dashBoardStore.state
const myChart = ref<ECharts>()

//获取概览数据从接口

const main = ref<HTMLDivElement>() // 使用ref创建虚拟DOM引用，使用时用main.value

let clusterStatus = reactive({})
const getClusterStatus = async () => {
  const [err, res] = await getClusterStatusApi()
  if (err) {
    console.log('请求报错啦', err)
  } else if (res.status === 200) {
    return res
  }
}

const Try = () => {
  myChart.value?.resize()
}

const drawChart = () => {
  getClusterStatus().then(res => {
    clusterStatus = res.data.data
    const healthy =
      clusterStatus.copysetNum.total - clusterStatus.copysetNum.unhealthy
    const unhealthy = clusterStatus.copysetNum.unhealthy
    // 基于准备好的dom，初始化echarts实例

    // 指定图表的配置项和数据
    var data = [
      { value: healthy, name: '健康CopySet数量' },
      { value: unhealthy, name: '不健康CopySet数量' },
    ]
    var total = data[0].value + data[1].value

    var option = {
      tooltip: {
        show: true,
        formatter: function (params) {
          return params.name + ' : ' + params.value + '个'
        },
      },
      title: {
        text: total + ' ' + '个',
        subtext: '总量',
        x: 'center',
        y: 'center',
        textStyle: {
          color: '#000',
          fontSize: 24,
        },
        subtextStyle: {
          color: '#aaa',
          fontSize: 16,
        },
      },
      series: [
        {
          name: 'copyset状态',
          type: 'pie',
          color: ['#2080f0', '#ee6666'],
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: 'outside',
            formatter: '{b}: {c}',
          },
          labelLine: {
            show: true,
          },
          data: data,
        },
      ],
      legend: {
        bottom: 10,
        left: 'center',
        data: ['健康CopySet数量', '不健康CopySet数量'],
      },
    }
    // 使用刚指定的配置项和数据显示图表。
    myChart.value?.setOption(option)
  })
}

onMounted(() => {
  myChart.value = echarts.init(main.value!)
  drawChart()
  window.addEventListener('resize', () => {
    myChart.value?.resize()
  })
})
// 为免内存泄露
onBeforeUnmount(() => {
  window.removeEventListener('resize', () => {
    myChart.value?.resize()
  })
})

let timer = setInterval(drawChart, 1800000)

watch(
  () => state.timeInterval,
  newVal => {
    if (newVal === 0) {
      clearInterval(timer)
    } else {
      clearInterval(timer)
      timer = setInterval(drawChart, newVal * 1000)
    }
  },
)

defineExpose({ drawChart })
</script>
