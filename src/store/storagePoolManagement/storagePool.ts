import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { getStoragepoolApi, getStoragepoolDetailApi } from '@/api/storagepool'

// state类型
// export interface IPoolData {
//   count: number
// }

export const usePoolStore = defineStore('pool', () => {
  const state = reactive({ 
    storagePoolDetail: null 
  })
  
  //获取存储池列表
  const getStoragepool = async () => {
    const [err, res] = await getStoragepoolApi()
    if (err) {
      console.log('请求报错啦', err)
    } 
    else if (res.status === 200) {
      return res.data.data;
    }
  }

//获取存储池信息
const getStoragepoolDetail = async (data: any) => {
  const [err, res] = await getStoragepoolDetailApi(data)
  if (err) {
    console.log('请求报错啦', err)
  } 
  else if (res.status === 200) {
    state.storagePoolDetail = res.data.data;
    return res.data.data;
  }
}

  return { state, getStoragepool, getStoragepoolDetail }
})
