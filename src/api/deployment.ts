import _fetch from '@/utils/_fetch'
import type { Res } from '@/utils/_fetch'


//第一步：机器列表
export const deployHostListApi = () => {
    return _fetch<Res<{ result: any }>>({
        method:'GET',
        url:`/curvebs?method=deploy.host.list`,
    })
  }

  export const deployHostCommitApi = (data: {hosts: string}) => {
    return _fetch<Res<{ result: any }>>({
        method:'POST',
        url:`/curvebs?method=deploy.host.commit`,
        data,
        timeout: 60000
    })
  }

//第二步：磁盘列表
  export const deployDiskListApi = () => {
    return _fetch<Res<{ result: any }>>({
        method:'GET',
        url:`/curvebs?method=deploy.disk.list`,
    })
  }

  export const deployDiskCommitApi = (data: {disks: string}) => {
    return _fetch<Res<{ result: any }>>({
        method:'POST',
        url:`/curvebs?method=deploy.disk.commit`,
        data,
        timeout: 60000
    })
  }

  //第三步：格式化磁盘

  export const deployFormatStatusApi = () => {
    return _fetch<Res<{ result: any }>>({
        method:'GET',
        url:`/curvebs?method=deploy.disk.format.status`,
    })
  }

  export const deployFormatApi = () => {
    return _fetch<Res<{ result: any }>>({
        method:'GET',
        url:`/curvebs?method=deploy.disk.format`,
    })
  }

  // 第四步：创建集群

  export const deployConfigShowApi = () => {
    return _fetch<Res<{ result: any }>>({
        method:'GET',
        url:`/curvebs?method=deploy.config.show`,
    })
  }

  export const deployConfigCommitApi = (data: {name: string, conf: string}) => {
    return _fetch<Res<{ result: any }>>({
        method:'POST',
        url:`/curvebs?method=deploy.config.commit`,
        data,
        timeout: 60000
    })
  }

  export const deployClusterAddApi = (data: {name: string, conf: string, desc: string}) => {
    return _fetch<Res<{ result: any }>>({
        method:'POST',
        url:`/curvebs?method=deploy.cluster.add`,
        data,
        timeout: 60000
    })
  }

/*   第五步：部署集群 */

  //部署集群
  export const deployClusterDeployApi = () => {
    return _fetch<Res<{ result: any }>>({
        method:'GET',
        url:`/curvebs?method=deploy.cluster.deploy`,
    })
  }

 //获取所有集群配置
  export const deployClusterListApi = () => {
    return _fetch<Res<{ result: Array<String> }>>({
        method:'GET',
        url:`/curvebs?method=deploy.cluster.list`,
    })
  }
  //切换集群
  export const deployClusterCheckoutApi = (data: {name: string}) => {
    return _fetch<Res<{ result: any }>>({
        method:'POST',
        url:`/curvebs?method=deploy.cluster.checkout`,
        data
    })
  }
