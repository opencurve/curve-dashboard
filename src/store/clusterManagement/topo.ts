import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { getTopoListApi } from '@/api/topo'

// state类型
export interface IPoolData {
  count: number
}

export const useTopoStore = defineStore('topo', () => {
    const state = reactive<IPoolData>({ count: 0 })
  
    const getTopoList = async () => {
      const [err, res] = await getTopoListApi()
      if (err) {
        console.log('请求报错啦', err)
      } 
      else if (res.status === 200) {
        return res;
      }
    }
    return { state, getTopoList}
  })