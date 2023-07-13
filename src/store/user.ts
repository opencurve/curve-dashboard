import Cookies from 'js-cookie'
import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { RouteMeta } from 'vue-router'

import {
  adminAddUserApi,
  adminChangeUserPermissionApi,
  adminDeleteUserApi,
  adminEditUserApi,
  adminGetUserApi,
  changeAccountApi,
  changePasswordApi,
  getUserInfoApi,
  loginApi,
  logoutApi,
  resetPasswordApi,
} from '@/api/user'
import { tokenKey } from '@/constants/http'
import router from '@/router'

// state类型
export const useUserStore = defineStore('user', () => {
  const initData = {
    loggedIn: false,
    name: '',
    permission: 4,
    email: '',
    token: '',
  }
  const state = reactive(initData)

  const flag = reactive({
    userAddedFlag: false,
    userDeletedFlag: false,
  })

  const hasPermission = (permissions: RouteMeta['permissions']) => {
    return permissions?.includes(state.permission)
  }

  //用户登录
  const loginUser = async (data: any) => {
    const [err, res] = await loginApi(data)
    if (err) {
      console.log('请求报错啦', err)
      return err
    } else if (res.status === 200) {
      state.loggedIn = true
      // 把token存入cookie
      Cookies.set(tokenKey, res.data.data.token)
      return res
    } else if (res.status !== 200) {
      return res
    }
  }

  //用户登出
  const handleLogout = async () => {
    const [err, res] = await logoutApi()
    if (err) {
      console.log('请求报错啦', err)
      return err
    } else if (res.status === 200) {
      state.loggedIn = false
      state.name = ''
      state.permission = 4
      state.email = ''
      router.push({ path: '/login' })
      return res
    } else if (res.status !== 200) {
      return res
    }
  }

  //获取用户个人信息
  const getUserInfo = async () => {
    const [err, res] = await getUserInfoApi()
    if (err) {
      console.log('请求出错', err)
      return err
    } else if (res.status === 200) {
      state.email = res.data.data.email
      state.name = res.data.data.userName
      state.permission = res.data.data.permission
      state.loggedIn = true
      return res
    }
  }

  //登录成功操作
  const handleLoginSuccess = result => {
    state.loggedIn = true
    state.name = result.data.data.userName
    state.email = result.data.data.email
    state.permission = result.data.data.permission
    state.token = result.data.data.token
    // sessionStorage.setItem('user', JSON.stringify(toRaw(state)))
    router.push({ path: '/' })
  }

  //普通用户忘记密码
  const resetPassword = async (data: any) => {
    const [err, res] = await resetPasswordApi(data)
    if (err) {
      console.log('请求报错啦', err)
      return err
    } else if (res.status === 200) {
      return res
    }
  }
  //普通用户修改密码
  const changePassword = async (data: any) => {
    const [err, res] = await changePasswordApi(data)
    if (err) {
      console.log('请求报错啦', err)
    } else if (res.status === 200) {
      return res
    }
  }
  //普通用户修改账号
  const changeAccount = async (data: any) => {
    const [err, res] = await changeAccountApi(data)
    if (err) {
      console.log('请求报错啦', err)
    } else if (res.status === 200) {
      return res
    }
  }
  //管理员删除用户
  const adminDeleteUser = async (data: any) => {
    const [err, res] = await adminDeleteUserApi(data)
    if (err) {
      console.log('请求报错啦', err)
    } else if (res.status === 200) {
      return res
    }
  }
  //管理员添加用户
  const adminAddUser = async (data: any) => {
    const [err, res] = await adminAddUserApi(data)
    if (err) {
      console.log('请求报错啦', err)
      return err.response.data.errorCode
    } else if (res.status === 200) {
      return res
    }
  }
  //管理员修改用户权限
  const adminChangeUserPermission = async (data: {
    userName: String
    permission: number
  }) => {
    const [err, res] = await adminChangeUserPermissionApi(data)
    if (err) {
      console.log('请求报错啦', err)
      return err.response.data.errorCode
    } else if (res.status === 200) {
      return res
    }
  }
  //管理员编辑用户
  const adminEditUser = async (data: any) => {
    const [err, res] = await adminEditUserApi(data)
    if (err) {
      console.log('请求报错啦', err)
    } else if (res.status === 200) {
      return res.data.data
    }
  }
  //管理员获取用户信息
  const adminGetUser = async (data: Object) => {
    const [err, res] = await adminGetUserApi(data)
    if (err) {
      console.log('请求报错啦', err)
    } else if (res.status === 200) {
      return res.data.data
    }
  }

  // //外部操作登录状态的变更
  // const handleLoginStatusChange = (status: boolean) => {
  //   state.loggedIn = status
  // }
  //外部操作登录状态的变更，用户登出

  //外部操作

  return {
    state,
    hasPermission,
    handleLogout,
    resetPassword,
    loginUser,
    changePassword,
    changeAccount,
    adminDeleteUser,
    adminAddUser,
    adminEditUser,
    adminGetUser,
    handleLoginSuccess,
    getUserInfo,
    adminChangeUserPermission,
    flag,
  }
})
