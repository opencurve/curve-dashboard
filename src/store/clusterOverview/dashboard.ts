import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

import {
  getChunkServerStatusApi,
  getClusterPerformanceApi,
  getClusterSpaceApi,
  getClusterTrendApi,
  getETCDStatusApi,
  getMDSStatusApi,
  getSnapshotCloneServerStatusApi,
} from '@/api/dashboard'

// state类型
// export interface IDashboardData {
//   clusterPerformanceData: Array<object>
// }

export const useDashboardStore = defineStore('dashboard', () => {
  const state = ref({
    clusterPerformanceData: [],
    timeInterval: 0,
  })

  const setTimeIntervalValInStore = (val: number) => {
    state.value.timeInterval = val
    console.log('farking set', state.value.timeInterval)
  }

  const getETCDStatus = async () => {
    const [err, res] = await getETCDStatusApi()
    if (err) {
      console.log('请求报错啦', err)
    } else if (res.status === 200) {
      return res
    }
  }

  const getMDSStatus = async () => {
    const [err, res] = await getMDSStatusApi()
    if (err) {
      console.log('请求报错啦', err)
    } else if (res.status === 200) {
      return res
    }
  }

  const getSnapshotCloneServerStatus = async () => {
    const [err, res] = await getSnapshotCloneServerStatusApi()
    if (err) {
      console.log('请求报错啦', err)
    } else if (res.status === 200) {
      return res
    }
  }

  const getChunkServerStatus = async () => {
    const [err, res] = await getChunkServerStatusApi()
    if (err) {
      console.log('请求报错啦', err)
    } else if (res.status === 200) {
      return res
    }
  }

  const getClusterSpace = async () => {
    const [err, res] = await getClusterSpaceApi()
    if (err) {
      console.log('请求报错啦', err)
    } else if (res.status === 200) {
      return res
    }
  }

  const getClusterPerformance = async data => {
    const [err, res] = await getClusterPerformanceApi(data)
    if (err) {
      console.log('请求报错啦', err)
    } else if (res.status === 200) {
      state.value.clusterPerformanceData = res.data.data
      return res
    }
  }

  return {
    state,
    getETCDStatus,
    getMDSStatus,
    getSnapshotCloneServerStatus,
    getChunkServerStatus,
    getClusterSpace,
    getClusterPerformance,
    setTimeIntervalValInStore,
  }
})
