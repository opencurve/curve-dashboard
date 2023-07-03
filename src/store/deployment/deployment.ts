import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

import {
  deployClusterAddApi,
  deployClusterCheckoutApi,
  deployClusterDeployApi,
  deployClusterListApi,
  deployConfigCommitApi,
  deployConfigShowApi,
  deployDiskCommitApi,
  deployDiskListApi,
  deployFormatApi,
  deployFormatStatusApi,
  deployHostCommitApi,
  deployHostListApi,
} from '@/api/deployment'

// state类型
// export interface IPoolData {
//   count: number
// }

export const useDeploymentStore = defineStore('deployment', () => {
  const atStepFlag = ref(1)
  //当所处步骤发生变化的时候
  const changeStepFlag = (val: number) => {
    atStepFlag.value = val
  }
  const finishStepFlag = reactive({
    stepOne: false,
    stepTwo: false,
    stepThree: true,
    stepFour: false,
    stepFive: false,
  })

  const currentCluster = ref('')

  const updateFinishStep = (val: number) => {
    switch (val) {
      case 1:
        finishStepFlag.stepOne = true
        break
      case 2:
        finishStepFlag.stepTwo = true
        break
      case 3:
        finishStepFlag.stepThree = true
        break
      case 4:
        finishStepFlag.stepFour = true
        break
      case 5:
        finishStepFlag.stepFive = true
        break
    }
  }

  //获取存储池列表
  const deployHostList = async () => {
    const [err, res] = await deployHostListApi()
    if (err) {
      console.log('请求报错啦', err)
    } else if (res.status === 200) {
      return res
    }
  }

  //获取存储池信息
  const deployHostCommit = async (data: { hosts: string }) => {
    const [err, res] = await deployHostCommitApi(data)
    if (err) {
      console.log('请求报错啦', err)
    } else if (res.status === 200) {
      return res
    }
  }

  const deployDiskList = async () => {
    const [err, res] = await deployDiskListApi()
    if (err) {
      console.log('请求报错啦', err)
    } else if (res.status === 200) {
      return res
    }
  }
  const deployDiskCommit = async (data: { disks: string }) => {
    const [err, res] = await deployDiskCommitApi(data)
    if (err) {
      console.log('请求报错啦', err)
    } else if (res.status === 200) {
      return res
    }
  }

  const deployFormatStatus = async () => {
    const [err, res] = await deployFormatStatusApi()
    if (err) {
      console.log('请求报错啦', err)
    } else if (res.status === 200) {
      return res
    }
  }

  const deployFormat = async () => {
    const [err, res] = await deployFormatApi()
    if (err) {
      console.log('请求报错啦', err)
    } else if (res.status === 200) {
      return res
    }
  }

  const deployConfigShow = async () => {
    const [err, res] = await deployConfigShowApi()
    if (err) {
      console.log('请求报错啦', err)
    } else if (res.status === 200) {
      return res
    }
  }

  const deployConfigCommit = async (data: { name: string; conf: string }) => {
    const [err, res] = await deployConfigCommitApi(data)
    if (err) {
      console.log('请求报错啦', err)
    } else if (res.status === 200) {
      return res
    }
  }

  const deployClusterAdd = async (data: {
    name: string
    conf: string
    desc: string
  }) => {
    const [err, res] = await deployClusterAddApi(data)
    if (err) {
      console.log('请求报错啦', err)
    } else if (res.status === 200) {
      return res
    }
  }

  //第五步，部署集群：获取当前集群配置
  const showClusterDeploy = async () => {
    const [err, res] = await deployConfigShowApi()
    if (err) {
      console.log('请求报错啦', err)
    } else if (res.status === 200) {
      return res
    }
  }
  //部署集群
  const deployClusterDeploy = async () => {
    const [err, res] = await deployClusterDeployApi()
    if (err) {
      console.log('请求报错', err)
    } else if (res.status === 200) {
      return res
    }
  }
  //获取所有集群
  const deployClusterList = async () => {
    const [err, res] = await deployClusterListApi()
    if (err) {
      console.log('请求报错啦', err)
    } else if (res.status === 200) {
      return res
    }
  }
  //切换集群
  const deployClusterCheckout = async (data: { name: string }) => {
    const [err, res] = await deployClusterCheckoutApi(data)
    if (err) {
      console.log('请求报错啦', err)
    } else if (res.status === 200) {
      currentCluster.value = data.name
      return res
    }
  }

  return {
    deployHostList,
    deployHostCommit,
    deployDiskList,
    deployDiskCommit,
    deployFormatStatus,
    deployFormat,
    deployConfigShow,
    deployConfigCommit,
    deployClusterAdd,
    showClusterDeploy,
    deployClusterDeploy,
    deployClusterList,
    deployClusterCheckout,
    changeStepFlag,
    updateFinishStep,
    currentCluster,
    atStepFlag,
    finishStepFlag,
  }
})
