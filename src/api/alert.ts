import type { AlertMsgData, GetAlertMsgsParams } from '@/model/alert'
import type { Res } from '@/utils/_fetch'
import _fetch from '@/utils/_fetch'

//获取告警信息
export const getAlertMessageApi = (data: GetAlertMsgsParams) => {
  return _fetch<Res<AlertMsgData>>({
    method: 'POST',
    url: `/curvebs?method=alert.get`,
    data,
  })
}

//获取用户未读告警数量
export const getUnreadAlertMessageApi = () => {
  return _fetch<Res<{ result: any }>>({
    method: 'GET',
    url: `/curvebs?method=alert.unread.num.get`,
  })
}

//更新用户已读告警信息ID
export const getAlertReadIdUpdateApi = (data: Object) => {
  return _fetch<Res<{ result: any }>>({
    method: 'POST',
    url: `/curvebs?method=alert.read.id.update`,
    data,
  })
}

//获取告警配置
export const getAlertConfigApi = () => {
  return _fetch<Res<{ result: any }>>({
    method: 'GET',
    url: `/curvebs?method=alert.conf.get`,
  })
}
//获取系统操作日志
export const getSystemLogApi = (data: {
  start: number
  end: number
  page: number
  size: number
  filter: string
}) => {
  return _fetch<Res<{ result: any }>>({
    method: 'POST',
    url: `/curvebs?method=syslog.get`,
    data,
  })
}

//更新告警责任人
export const updateAlertCandidateApi = (data: Object) => {
  return _fetch<Res<{ result: any }>>({
    method: 'POST',
    url: `/curvebs?method=alert.user.update`,
    data,
  })
}

//更新告警配置
export const updateAlertRuleApi = (data: Object) => {
  return _fetch<Res<{ result: any }>>({
    method: 'POST',
    url: `/curvebs?method=alert.conf.update`,
    data,
  })
}

//获取告警联系人候选人
export const getAlertCandidateApi = () => {
  return _fetch<Res<{ result: any }>>({
    method: 'GET',
    url: `/curvebs?method=alert.candidate.get`,
  })
}

//更新告警联系人
export const updateAlertUserApi = (data: Object) => {
  return _fetch<Res<{ result: any }>>({
    method: 'POST',
    url: `/curvebs?method=alert.user.update`,
    data,
  })
}
