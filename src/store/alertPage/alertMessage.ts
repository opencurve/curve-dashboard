import { reactive } from 'vue'
import { defineStore } from 'pinia'
import {
  getAlertMessageApi,
  getUnreadAlertMessageApi,
  getAlertReadIdUpdateApi,
  getAlertConfigApi,
  updateAlertCandidateApi,
  getAlertCandidateApi,
  updateAlertUserApi,
  updateAlertRuleApi,
  getSystemLogApi,
} from '@/api/alert'

// state类型
export interface IPoolData {
  count: number
}

export const useAlertStore = defineStore('alert', () => {
  const state = reactive<IPoolData>({ count: 0 })

  const getAlertMessage = async (data: object) => {
    const [err, res] = await getAlertMessageApi(data)
    if (err) {
      console.log('请求报错啦', err)
      return err
    } else if (res.status === 200) {
      return res
    }
  }

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
    if (err) {
      console.log('请求报错啦', err)
      return err
    } else if (res.status === 200) {
      return res
    }
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

  const getAlertCandidate = async () => {
    const [err, res] = await getAlertCandidateApi()
    if (err) {
      console.log('请求报错啦', err)
      return err
    } else if (res.status === 200) {
      return res
    }
  }

  const updateAlertUser = async (data: object) => {
    const [err, res] = await updateAlertUserApi(data)
    if (err) {
      console.log('请求报错啦', err)
      return err
    } else if (res.status === 200) {
      return res
    }
  }

  const updateAlertRule = async (data: object) => {
    const [err, res] = await updateAlertRuleApi(data)
    if (err) {
      console.log('请求报错啦', err)
      return err
    } else if (res.status === 200) {
      return res
    }
  }

  return {
    state,
    getAlertMessage,
    getSystemLog,
    getUnreadAlertMessage,
    getAlertReadIdUpdate,
    getAlertConfig,
    updateAlertCandidate,
    getAlertCandidate,
    updateAlertUser,
    updateAlertRule,
  }
})
