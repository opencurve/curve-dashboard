export interface AlertMsg {
  duration: number
  id: number
  level: string
  name: string
  summary: string
  time: string
}
export interface AlertMsgData {
  info: AlertMsg[] | null
  total: number
}

export interface GetAlertMsgsParams {
  start: number
  end: number
  page: number
  size: number
  name?: string
  level?: string
  content?: string
}

export interface AlertItem {
  alertUsers: string[]
  desc: string
  enable: boolean
  interval: number
  level: string
  name: string
  rule: string
  times: number
}

export interface PostAlertConfig {
  name: string
  enable: boolean
  interval: number
  times: number
  rule: string
  alertUsers: string[]
}
