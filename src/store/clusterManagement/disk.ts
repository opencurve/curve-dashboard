import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { getDiskListApi } from '@/api/disk'

// state类型
export interface IPoolData {
  count: number
}

export const useDiskStore = defineStore('disk', () => {
  const state = reactive<IPoolData>({ count: 0 })

  const getDiskList = async (data) => {
    const [err, res] = await getDiskListApi(data)
    if (err) {
      console.log('请求报错啦', err)
      return err;
    } 
    else if (res.status === 200) {
      return res;
    }
  }

  return { state, getDiskList}
})
