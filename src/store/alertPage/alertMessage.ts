import { defineStore } from 'pinia'
import { reactive } from 'vue'

import {
  getAlertConfigApi,
  getAlertReadIdUpdateApi,
  getSystemLogApi,
  getUnreadAlertMessageApi,
  updateAlertCandidateApi,
} from '@/api/alert'

// state类型
export interface IPoolData {
  count: number
}

export const useAlertStore = defineStore('alert', () => {
  const state = reactive<IPoolData>({ count: 0 })

  const getSystemLog = async (data: {
    start: number
    end: number
    page: number
    size: number
    filter: string
  }) => {
    const [err, res] = await getSystemLogApi(data)
    if (err) {
      console.log('请求报错啦', err)
      return err
    } else if (res.status === 200) {
      return res
    }
  }

  const getUnreadAlertMessage = async () => {
    const [err, res] = await getUnreadAlertMessageApi()
    if (err) return console.log('请求报错啦', err)
    state.count = res.data.data
  }

  const getAlertReadIdUpdate = async (data: object) => {
    const [err, res] = await getAlertReadIdUpdateApi(data)
    if (err) {
      console.log('请求报错啦', err)
      return err
    } else if (res.status === 200) {
      return res
    }
  }

  const getAlertConfig = async () => {
    const [err, res] = await getAlertConfigApi()
    if (err) {
      console.log('请求报错啦', err)
      return err
    } else if (res.status === 200) {
      return res
    }
  }

  const updateAlertCandidate = async (data: object) => {
    const [err, res] = await updateAlertCandidateApi(data)
    if (err) {
      console.log('请求报错啦', err)
      return err
    } else if (res.status === 200) {
      return res
    }
  }

  return {
    state,
    getSystemLog,
    getUnreadAlertMessage,
    getAlertReadIdUpdate,
    getAlertConfig,
    updateAlertCandidate,
  }
})
