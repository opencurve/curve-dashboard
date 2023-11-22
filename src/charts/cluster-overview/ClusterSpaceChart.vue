<template>
  <div ref="main" style="width: 100%; height: 400px"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { onBeforeUnmount, onMounted, reactive, ref, toRefs, watch } from 'vue'

import { useDashboardStore } from '@/store/clusterOverview/dashboard'

const dashBoardStore = useDashboardStore()
const { getClusterSpace } = dashBoardStore
const state = dashBoardStore.state

//获取概览数据从接口

const main = ref<HTMLDivElement>() // 使用ref创建虚拟DOM引用，使用时用main.value

const myChart = ref(null)
let clusterSpace = reactive({})

const drawChart = () => {
  getClusterSpace().then(res => {
    clusterSpace = res.data.data
    const alloc = res.data.data.alloc - res.data.data.canRecycled
    const canRecycled = res.data.data.canRecycled
    const unAlloc = res.data.data.total - res.data.data.alloc
    // 指定图表的配置项和数据
    var data = [
      { value: alloc, name: '已分配不可回收容量' },
      { value: canRecycled, name: '已分配可回收容量' },
      { value: unAlloc, name: '未分配容量' },
    ]
    var total = data[0].value + data[2].value

    var option = {
      tooltip: {
        show: true,
        formatter: function (params: any) {
          return params.name + ' : ' + params.value + 'GiB'
        },
      },
      title: {
        text: total + ' ' + 'GiB',
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
          name: '集群容量',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: 'outside',
            formatter: '{c} GiB',

            // '{b}: {c}'
          },
          labelLine: {
            show: true,
            length: 3,
            // length2: 15
          },
          data: data,
        },
      ],
      legend: {
        bottom: 10,
        left: 'center',
        data: ['已分配不可回收容量', '已分配可回收容量'],
      },
    }
    myChart.value.setOption(option)
  })
}

onMounted(() => {
  myChart.value = echarts.init(main.value)
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

onBeforeUnmount(() => {
  clearInterval(timer)
  echarts.dispose(main.value)
})

defineExpose({ drawChart })
</script>
