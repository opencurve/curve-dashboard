<template>
    <div ref="main" style="width: 100%; height: 400px"></div>
  </template>

  <script setup lang="ts">
  import * as echarts from "echarts";
  import { ref, watch } from 'vue'
  import router from "@/router"
  import { usePoolStore } from '@/store/storagePoolManagement/storagePool'


  const poolStore = usePoolStore()
// const { getStoragepoolDetail } = poolStore;
const {state} = poolStore
  
  //获取概览数据从接口
  
  const main = ref<HTMLDivElement>() // 使用ref创建虚拟DOM引用，使用时用main.value
  
  // onMounted(() => {
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
  
      const drawChart = () => {
      const timeStamp: Array<string> = [];
    const readIOPS: Array<number> = [];
    const writeIOPS: Array<number> = [];
        let poolPerformance = state.storagePoolDetail.performance;

        poolPerformance.forEach(item => {
        let convertedTime = timestampToTime(item.timestamp)
        timeStamp.push(convertedTime);

        let readIOPSdata = +item.readIOPS;
        let writeIOPSdata = +item.writeIOPS;

        readIOPSdata = readIOPSdata.toFixed(2);
        writeIOPSdata = writeIOPSdata.toFixed(2);
  
        readIOPS.push(readIOPSdata);
        writeIOPS.push(writeIOPSdata);

      })
  
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(main.value);
      // 指定图表的配置项和数据
      var option = {
        title: { text: "存储池IOPS" },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['读IOPS', '写IOPS']
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
      formatter: '{value} io/s'
        },
        },
        series: [
          {
            name: '读IOPS',
            type: 'line',
            data: readIOPS
          },
          {
            name: '写IOPS',
            type: 'line',
            data: writeIOPS
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
  
    }
   watch(state, (() => {
    drawChart();
   }))
  
  </script>