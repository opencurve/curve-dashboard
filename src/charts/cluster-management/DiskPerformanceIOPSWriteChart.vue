<template>
  <div ref="main" style="width: 100%; height: 400px"></div>
</template>
  
<script setup lang="ts">
import * as echarts from "echarts";
import { ref, watch, toRefs } from 'vue'
import { useServerStore } from '@/store/clusterManagement/server'

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
  let diskPerformance = fullServerDetail.value.diskPerformance;
  //获取timestamp并将其存入相应数组
  let timeItem = Object.values(diskPerformance);
  timeItem[0].forEach(item => {
    let convertedTime = timestampToTime(item.timestamp);
    timeStamp.push(convertedTime)
  })

  // 获取键值
  const keys = []
  for (let key in diskPerformance) {
    keys.push(key);
  }

  //获取数据数组
  const diskPerformanceData = []
  timeItem.forEach(item => {
    let valueData = [];
    item.forEach(valueItem => {
      let val = +valueItem.writeIOPS;
      val = val.toFixed(2);
      valueData.push(val)
    })
    diskPerformanceData.push(valueData)
  })

  //整理出图标里需要的数据数组
  const charDiskPerformanceData = []
  for (let i = 0; i < keys.length; i++) {
    charDiskPerformanceData.push(
      {
        name: keys[i],
        type: 'line',
        data: diskPerformanceData[i]
      },
    );
  }
  // 基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(main.value);
  // 指定图表的配置项和数据
  var option = {
    title: { text: "磁盘写IOPS" },
    tooltip: {
      trigger: 'axis'
    },
  legend: {
    data: keys,
    bottom: '2px'
  },
    grid: {
      left: '3%',
      right: '4%',
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
        formatter: '{value} io/s'
      }
    },
    series: charDiskPerformanceData
  };
  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option);
})

watch(fullServerDetail, (newVal) => { 
  drawChart();
})
</script>