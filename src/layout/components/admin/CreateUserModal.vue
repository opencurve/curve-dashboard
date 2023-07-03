<template>
  <n-modal v-model:show="val" preset="dialog" title="创建新用户">
    <n-form ref="formRef" :model="model" :rules="rules">
      <n-form-item path="userName" label="用户名">
        <n-input v-model:value="model.userName" placeholder="请输入用户名"></n-input>
      </n-form-item>
      <n-form-item path="userEmail" label="用户邮箱">
        <n-input v-model:value="model.userEmail" placeholder="请输入用户的邮箱"></n-input>
      </n-form-item>
      <n-form-item path="initialPassword" label="初始密码">
        <n-input v-model:value="model.initialPassword" type="password" placeholder="请输入用户的初始密码"></n-input>
      </n-form-item>
      <n-form-item path="permission" label="用户类型">
        <n-select v-model:value="model.permission" :options="userType" placeholder="请选择用户类型" />
      </n-form-item>
    </n-form>
    <template #action>
      <div>
        <n-button @Click="cancel">取消</n-button> &nbsp;&nbsp;
        <n-button @Click="createUser" type="primary">创建</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/user'
import { ref, toRef } from 'vue'
import { useMessage, type FormRules, type FormItemRule, NSelect } from 'naive-ui'
import router from '@/router'
import md5 from 'js-md5'
import { adminGetUserApi } from '@/api/user'
//定义需要使用的参数
const userStore = useUserStore()
const { adminAddUser } = userStore
const message = useMessage()
let val = ref(false)
const userAddedFlag = toRef(userStore.flag, 'userAddedFlag')

//用户类型选项
const userType = [
  {
    label: "只读",
    value: 4
  },
  {
    label: "读写",
    value: 6
  }
]

//输入的内容，用于之后传参
interface ModelType {
  userName: string | null
  userEmail: string | null
  initialPassword: string | null
  permission: number
}
const model = ref<ModelType>({
  userName: null,
  userEmail: null,
  initialPassword: null,
  permission: 4
})

//校验规则函数
const checkEmailFormat = (rule: FormItemRule, value: string): boolean => {
  let check = /^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/
    ;
  return check.test(value)
}
//判断用户名长度，组成元素是否符合要求
const checkUserNameFormat = (rule: FormItemRule, value: string) => {
  let check = /^[a-zA-Z0-9]{5,64}$/;

  return check.test(value)
}
//判断密码长度，组成元素是否符合要求
const checkPasswordFormat = (rule: FormItemRule, value: string) => {
  let checkFormat = /.*[A-Z@#$%^&+=!*()_?].*/;
  let checkLength = /^.{6,64}$/;
  return checkFormat.test(value) && checkLength.test(value)
}
//表单校验规则
const rules: FormRules = {
  userName: [
    {
      required: true,
      message: '请输入用户名',
      trigger: ['input', 'blur'],
    },
    {
      validator: checkUserNameFormat,
      message: '用户名应为字母或大小写数字，长度为5-64位',
      trigger: ['input', 'blur'],
    },
  ],
  userEmail: [
    {
      required: true,
      message: '请输入用户邮箱',
      trigger: ['input', 'blur'],
    },
    {
      validator: checkEmailFormat,
      message: '请输入正确邮箱格式',
      trigger: ['input', 'blur'],
    },
  ],
  initialPassword: [
    {
      required: true,
      message: '请输入用户初始密码',
      trigger: ['input', 'blur'],
    },
    {
      validator: checkPasswordFormat,
      message: '密码由数字,大小写字母,特殊字符组成,长度6-64,至少包含数字,大小写字母,特殊字符中的两种',
      trigger: ['input', 'blur'],
    },
  ],
  permission: [
    {
      required: true,
    }
  ]
}

const clearInfo = () => {
  model.value.userName = null
  model.value.userEmail = null
  model.value.initialPassword = null
}

const emit = defineEmits(['create-user-successful'])


//调用创建用户的接口
const createUser = () => {
  //验证用户的注册信息格式是否正确
  if (model.value.userName === null || model.value.userEmail === null || model.value.initialPassword === null) {
    message.error('请填写必要信息')
    return
  } else {
    let checkEmailFormat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/;
    let checkUserNameFormat = /^[a-zA-Z0-9]{5,64}$/;
    let checkPasswordFormat = /.*[A-Z@#$%^&+=!*()_?].*/;
    let checkPasswordLength = /^.{6,64}$/;

    const checkEmailFormatResult = checkEmailFormat.test(model.value.userEmail);
    const checkUserNameFormatResult = checkUserNameFormat.test(model.value.userName);
    const checkPasswordFormatResult = checkPasswordFormat.test(model.value.initialPassword) && checkPasswordLength.test(model.value.initialPassword);

    if (!checkEmailFormatResult) {
      message.error('请填写正确的邮箱格式')
      return
    }
    if (!checkUserNameFormatResult) {
      message.error('请按照格式要求输入正确的用户名')
      return
    }
    if (!checkPasswordFormatResult) {
      message.error('请按照格式要求输入正确的密码')
      return
    }
  }

  const params = {
    userName: model.value.userName,
    passWord: md5(model.value.initialPassword),
    email: model.value.userEmail,
    permission: model.value.permission || 4,
  }
  adminAddUser(params).then(res => {
    if (res === "503004") { message.error('该用户已经存在！') }
    if (res.data.errorCode && res.data.errorCode === '0') {
      val.value = false
      message.success('添加用户成功');
      emit('create-user-successful');
      // router.push({ path: '/admin/manage-user' })
      clearInfo()
      // userAddedFlag.value = true
    }
    else {
      message.error('添加用户出错')
    }
  })
}

//点击取消，关闭模态框
const cancel = () => {
  val.value = false;
  clearInfo()
}

//展示模态框，供外部调用
const showModal = () => {
  val.value = true
}


//将展示模态框的函数暴露，供外部调用
defineExpose({ showModal })
</script>
