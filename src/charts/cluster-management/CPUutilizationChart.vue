<template>
  <div ref="main" style="width: 100%; height: 400px"></div>
</template>
  
<script setup lang="ts">
import * as echarts from "echarts";
import { ref, toRefs, watch } from 'vue'
import { useServerStore } from '@/store/clusterManagement/server'
import router from "@/router"

const serverStore = useServerStore()
const state = serverStore.state;
const { fullServerDetail } = toRefs(state);

//获取概览数据从接口

const main = ref<HTMLDivElement>() // 使用ref创建虚拟DOM引用，使用时用main.value



const drawChart = (() => {
  function timestampToTime(timestamp: number) {
    const dateObj = new Date(+timestamp * 1000) // ps, 必须是数字类型，不能是字符串, +运算符把字符串转化为数字，更兼容
    const year = dateObj.getFullYear() // 获取年，
    const month = dateObj.getMonth() + 1 // 获取月，必须要加1，因为月份是从0开始计算的
    const date = dateObj.getDate() // 获取日，记得区分getDay()方法是获取星期几的。
    const hours = pad(dateObj.getHours())  // 获取时, pad函数用来补0
    const minutes = pad(dateObj.getMinutes()) // 获取分
    const seconds = pad(dateObj.getSeconds()) // 获取秒
    return hours + ':' + minutes + ':' + seconds
  }

  function pad(str: any) {
    return +str >= 10 ? str : '0' + str
  }

  const timeStamp: Array<string> = [];
  const cpuUtilizationArray: Array<number> = []

  let cpuUtilization = fullServerDetail.value.cpuUtilization;
  cpuUtilization.forEach(item => {
    let convertedTime = timestampToTime(item.timestamp)
    timeStamp.push(convertedTime);
    let percentageValue = +item.value;
    let val = percentageValue.toFixed(2);
    cpuUtilizationArray.push(val)
  })

  // 基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(main.value);
  // 指定图表的配置项和数据
  var option = {
    title: { text: "cpu使用率" },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['cpu使用率']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: timeStamp
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value} % '
      }
    },
    series: [
      {
        name: 'cpu使用率',
        type: 'line',
        data: cpuUtilizationArray
      },
    ]
  };
  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option);

})

watch(fullServerDetail, (newVal) => {
  drawChart();
})

</script>