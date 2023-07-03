import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { getVolumeListApi,
   snapshotManagementApi,
    getVolumeDetailApi, 
    deleteVolumeApi, 
    createVolumeApi,
    cloneVolumeApi,
    lazyCloneVolumeApi,
    createSnapshotApi,
    expandVolumeApi,
    throttleVolumeApi,
    recoverVolumeApi,
    createVolumeNamespaceApi,
    deleteSnapshotApi,
    cancelSnapshotApi
  } from '@/api/block'
import type {  getVolumeApiDataItem } from '@/api/block'

// state类型
// export interface BlockData {
//   volumeList: getVolumeApiDataItem[]
// }

export const useBlockStore = defineStore('block', () => {
  const state = reactive<BlockData>({
    volumeList: [],
    volumePerformance: []
  })
  
/* 卷相关 */
  //获取卷列表
  const getVolumeList = async (data: any) => {
    const [err, res] = await getVolumeListApi(data)
    if (err) {
      console.log('请求报错啦', err);
      return err;
    } else if (res.status === 200) {
      let data = res.data.data.info;
      for(let i = 0; i<data.length; i++) {
        data[i].key = "volume_" + i;
      }
      state.volumeList = data ;
      return res
    }
  }
  //获取卷信息（detail）
  const getVolumeDetail = async (data: any) => {
    const [err, res] = await getVolumeDetailApi(data)
    if(err) {
      console.log('请求报错喽', err)
      return err;
    } else if (res.status === 200) {
      if(res.data.data === null) {
      return res
      }
      else{
      state.volumePerformance = res.data.data.performance;
      return res;
      }
    }
  }

  //删除卷
  const deleteVolume = async (data: any) => {
    const [err, res] = await deleteVolumeApi(data)
    if (err) {
      console.log('请求报错啦', err);
      return err;
    } else if (res.status === 200) {
      return res
    }
  }

  //恢复卷
  const recoverVolume = async (data: any) => {
    const [err, res] = await recoverVolumeApi(data)
    if (err) {
      console.log('请求报错啦', err);
      return err;
    } else if (res.status === 200) {
      return res
    }
  }

    //创建普通卷
    const createVolume = async (data: any) => {
      const [err, res] = await createVolumeApi(data)
      if (err) {
        console.log('请求报错啦', err);
        return err;
      } else if (res.status === 200) {
        return res
      }
    }
    //克隆卷
    const cloneVolume = async (data: any) => {
      const [err, res] = await cloneVolumeApi(data)
      if (err) {
        console.log('请求报错啦', err);
        return err;
      } else if (res.status === 200) {
        return res
      }
    }
    //lazy克隆卷安装数据
    const lazyCloneVolume = async (data: any) => {
      const [err, res] = await lazyCloneVolumeApi(data)
      if (err) {
        console.log('请求报错啦', err);
        return err;
      } else if (res.status === 200) {
        return res
      }
    }
    //打快照
    const createSnapshot = async (data: any) => {
      const [err, res] = await createSnapshotApi(data)
      if (err) {
        console.log('请求报错啦', err);
        return err;
      } else if (res.status === 200) {
        return res
      }
    }
    //删除快照
    const deleteSnapshot = async (data: any) => {
      const [err, res] = await deleteSnapshotApi(data)
      if (err) {
        console.log('请求报错啦', err);
        return err;
      } else if (res.status === 200) {
        return res
      }
    }
    //取消快照
    const cancelSnapshot = async (data: any) => {
      const [err, res] = await cancelSnapshotApi(data)
      if (err) {
        console.log('请求报错啦', err);
        return err;
      } else if (res.status === 200) {
        return res
      }
    }
    //卷扩容
    const expandVolume = async (data: any) => {
      const [err, res] = await expandVolumeApi(data)
      if (err) {
        console.log('请求报错啦', err);
        return err;
      } else if (res.status === 200) {
        return res
      }
    }
    //设置卷限流
    const throttleVolume = async (data: any) => {
      const [err, res] = await throttleVolumeApi(data)
      if (err) {
        console.log('请求报错啦', err);
        return err;
      } else if (res.status === 200) {
        return res
      }
    }
    //创建卷命名空间 
    const  createVolumeNamespace = async (data: any) => {
      const [err, res] = await createVolumeNamespaceApi(data)
      if (err) {
        console.log('请求报错啦', err);
        return err;
      } else if (res.status === 200) {
        return res
      }
    }
    
/* 快照相关 */
  //获取快照列表
  const snapshotManagement = async (data: any) => {
    const [err, res] = await snapshotManagementApi(data)
    if (err) {
      console.log('请求报错啦', err)
    } else if (res.status === 200) {
      return res
    }
  }
  // const setState=(state)=>{
  //   state
  // }


  return { state, 
    getVolumeList,
     getVolumeDetail,
      snapshotManagement,
       deleteVolume, 
       createVolume,
       cloneVolume,
       lazyCloneVolume,
       createSnapshot,
       expandVolume,
       throttleVolume,
       recoverVolume,
       createVolumeNamespace,
       deleteSnapshot,
       cancelSnapshot
      }
})
