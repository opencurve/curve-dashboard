import type { AxiosRequestConfig, AxiosResponse, Method } from 'axios'
import axios from 'axios'
import dayjs from 'dayjs'
import Cookies from 'js-cookie'
import md5 from 'js-md5'
import { stringify } from 'qs'
import urlParse from 'url-parse'

import { signKey, timestampKey, tokenKey } from '@/constants/http'

import type { LiteralUnion, Recordable } from './index'

export interface Res<D> {
  data: D
  errorCode: string
  errorMsg: string
}

export interface Options {
  url: string
  method: LiteralUnion<Method, string>
  headers?: Recordable
  params?: Recordable
  data?: Recordable
  timeout?: number
  contentType?: LiteralUnion<
    | 'application/x-www-form-urlencoded'
    | 'application/json'
    | 'multipart/form-data',
    string
  >
  debounceWait?: number // 防抖等待时间
  takeLatest?: boolean // 是否开启takeLatest模式，多次重复请求，只取最后一次结果
}
// 参数数据建议一律使用data,至于params，请求方法会自己转化，用户自己传入也可以
// 这里将debounce的结果也处理成canceled,为了是处理的时候和takeLasted逻辑一致，省去一层判断

const fetchInstance = axios.create()

const canceledObj = {
  code: 'ERR_CANCELED',
  message: 'canceled',
  name: 'CanceledError',
}

type errArg = [Recordable, null]

const request = <R>(options: Options) => {
  // 这里返回值不用式的写，ts可以自动推导
  const {
    url,
    method,
    contentType = 'application/json; charset=utf-8',
    data = {},
    params = {},
    headers,
  } = options
  const abortController = new AbortController()
  const axiosConfig: AxiosRequestConfig = {
    url:
      !url.startsWith('http') && import.meta.env.MODE === 'development'
        ? '/api' + url
        : url,
    method,
    data,
    headers: { 'content-type': contentType },
    signal: abortController.signal,
    withCredentials: true,
  }
  // get请求，把所有数据都放到params上

  if (method.toLocaleLowerCase() === 'get') {
    axiosConfig.params = { ...data, ...params }
    delete axiosConfig.data
  }

  if (
    contentType.indexOf('application/x-www-form-urlencoded') != -1 &&
    method.toLocaleLowerCase() === 'post'
  ) {
    axiosConfig.data = stringify(data)
  }

  // headers的设置要覆盖contentType的设置
  if (headers) axiosConfig.headers = headers

  return {
    abort: () => abortController.abort(),
    fetchFn: () => fetchInstance.request<R>(axiosConfig),
  }
}

type fetchRes<R> = Promise<[null, AxiosResponse<R, any>] | errArg>
export class Fetch {
  // 这套fetch请求，返回值永远是[err,result]的结构，而且不抛错
  debounceTimerMap: {
    [key: string]: {
      timer: NodeJS.Timeout
      resolve: (reason: errArg) => void
    }
  }
  requestMap: { [key: string]: { abort: () => void } }
  constructor() {
    this.requestMap = {} // 把请求根据key或者只是是个对象放入池子中
    this.debounceTimerMap = {}
  }

  _fetch = <R>(config: Options): fetchRes<R> => {
    const { url, debounceWait } = config
    if (debounceWait) {
      // 进入等待执行逻辑
      return new Promise(resolve => {
        if (this.debounceTimerMap[url]) {
          this.debounceTimerMap[url].resolve([canceledObj, null]) // 这里把请求处理成cancel
          clearTimeout(this.debounceTimerMap[url].timer) // 取消的时候，要把那个promise也终结掉
        }
        this.debounceTimerMap[url] = {
          timer: setTimeout(() => {
            resolve(this.fetchData<R>(config))
            delete this.debounceTimerMap[url]
          }, debounceWait),
          resolve,
        }
      })
    } else {
      return this.fetchData<R>(config)
    }
  }
  fetchData = async <R>(config: Options): fetchRes<R> => {
    const { url, takeLatest, method, data = {} } = config

    if (takeLatest && this.requestMap[url]) {
      this.requestMap[url].abort()
    }

    // 处理参数

    const token = Cookies.get(tokenKey)
    const timestamp = dayjs().unix()

    const { pathname, query } = urlParse(url, true)
    const str = [
      method,
      pathname,
      ...Object.values(query),
      // ...Object.values(data),
      timestamp,
      token,
    ]
      .sort()
      .join(':')
    const sign = md5(str)
    config.headers = {
      ...(config.headers || {}),
      [tokenKey]: token,
      [timestampKey]: timestamp,
      [signKey]: sign,
    }
    if (!config.timeout) config.timeout = 2412341234
    // 处理参数
    const requestItem = request<R>(config)
    this.requestMap[url] = requestItem

    const { fetchFn } = requestItem

    try {
      const res = await fetchFn()
      return Promise.resolve([null, res])
    } catch (err: any) {
      if (
        err.response.status === 401 &&
        window.location.pathname !== '/login'
      ) {
        window.location.href = '/login'
      }
      return Promise.resolve([err, null])
    } finally {
      delete this.requestMap[url]
    }
  }
}

export default new Fetch()._fetch
