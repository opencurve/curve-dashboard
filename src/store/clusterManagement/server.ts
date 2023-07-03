import { reactive } from 'vue'
import { defineStore } from 'pinia';
import {ref} from "vue";
import { getServerListApi, getServerDetailApi } from '@/api/server'

// state类型
export interface IPoolData {
  count: number
  fullServerDetail:any
}

export const useServerStore = defineStore('server', () => {
  const state = reactive<IPoolData>({ count: 0 ,fullServerDetail: null });

  // const fullServerDetail = ref(null);

  const getServerList = async (data) => {
    const [err, res] = await getServerListApi(data)
    if (err) {
      console.log('请求报错啦', err)
    } 
    else if (res.status === 200) {
      return res;
    }
  }

  const getServerDetail= async (data) => {
    const [err, res] = await getServerDetailApi(data)
    if (err) {
      console.log('请求报错啦', err)
    } 
    else if (res.status === 200) {
      state.fullServerDetail = res.data.data; 
      return res;
    }
  }

  return { state, getServerList, getServerDetail}
})
