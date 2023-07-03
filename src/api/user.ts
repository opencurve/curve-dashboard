import _fetch from '@/utils/_fetch'
import type { Res } from '@/utils/_fetch'

//用户登录api
  export const loginApi = (data: {userName: String, passWord: String}) => {
    return _fetch<Res<{ result: any }>>({
        method:'POST',
        url:`/curvebs?method=user.login`,
        data
    })
  }
//获取个人信息
export const getUserInfoApi = () => {
  return _fetch<Res<{ result: Object }>>({
    method:'GET',
    url:`/curvebs?method=user.get`,
})
}
//用户登出  
export const logoutApi = () => {
    return _fetch<Res<{ result: any }>>({
      method:'POST',
      url:`/curvebs?method=user.logout`,
  })
  }
//用户忘记密码api
  export const resetPasswordApi = (data: {userName: String}) => {
    return _fetch<Res<{ result: any }>>({
        method:'POST',
        url:`/curvebs?method=user.reset.password`,
        data
    })
  }

  //普通用户修改密码api
  export const changePasswordApi = (data: {userName: String, passWord: String}) => {
    return _fetch<Res<{ result: any }>>({
        method:'POST',
        url:`/curvebs?method=user.update.password`,
        data
    })
  }

  //用户修改账号api
  export const changeAccountApi = (data: {email: String}) => {
    return _fetch<Res<{ result: any }>>({
        method:'POST',
        url:`/curvebs?method=user.update.email`,
        data
    })
  }

  //管理员删除用户api
  export const adminDeleteUserApi = (data: {userName: String}) => {
    return _fetch<Res<{ result: any }>>({
        method:'POST',
        url:`/curvebs?method=user.delete`,
        data
    })
  }

    //管理员更改用户权限api
    export const adminChangeUserPermissionApi = (data: {userName: String, permission: number}) => {
      return _fetch<Res<{ result: any }>>({
          method:'POST',
          url:`/curvebs?method=user.update.permission`,
          data
      })
    }

  //管理员添加用户api
  export const adminAddUserApi = (data: {userName: String, passWord: String,  email: String, permission: Number}) => {
    return _fetch<Res<{ result: any }>>({
        method:'POST',
        url:`/curvebs?method=user.create`,
        data
    })
  }

  //管理员修改用户信息
  export const adminEditUserApi = (data: {userName: String, email: String, permission: Number}) => {
    return _fetch<Res<{ result: any }>>({
        method:'POST',
        url:`/curvebs?method=user.update.info`,
        data
    })
  }

  //管理员获取用户列表
  export const adminGetUserApi = (data: {page: Number, size: Number}) => {
    return _fetch<Res<{ result: any }>>({
        method:'POST',
        url:`/curvebs?method=user.list`,
        data
    })
  }

