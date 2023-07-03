<template>
      <div class="login">
        <n-form ref="formRef" :rules="rules" :model="model">
          <n-form-item path="oldAccount" label="当前账号">
            <n-input
              @keydown.enter.prevent
              v-model:value="model.oldAccount"
              placeholder="请输入当前使用的邮箱"
              type="text"
              label="当前邮箱"
            />
          </n-form-item>
          <n-form-item path="newAccount" label="新账号">
            <n-input
              type="text"
              @keydown.enter.prevent
              placeholder="请输入新账号"
              v-model:value="model.newAccount"
            />
          </n-form-item>
          <n-form-item
            ref="reEnterPasswordFormItemRef"
            first
            path="reEnteredAccount"
            label="确认新账号"
          >
            <n-input
              type="password"
              placeholder="请再次输入新账号"
              v-model:value="model.reEnteredAccount"
              @keydown.enter.prevent
            />
          </n-form-item>
          <n-row :gutter="[0, 24]">
            <n-col :span="24">
              <div style="display: flex; justify-content: flex-end">
                <n-button round type="primary" @click="confirmChangeAccount">
                  确认更改
                </n-button>
              </div>
            </n-col>
          </n-row>
        </n-form>
      </div>
    <!-- </n-card> -->
  </template>
  
  <script setup lang="ts">
  import {
    NCard,
    NRow,
    NCol,
    NForm,
    NFormItem,
    NInput,
    NButton,
    useMessage,
    type FormItemRule,
  } from 'naive-ui'
  import type { FormRules } from 'naive-ui'
  import { useUserStore } from '@/store/user'
  import { ref } from 'vue'
  import md5 from 'js-md5'
  import router from '@/router'
  
  const userStore = useUserStore()
  const userName = userStore.state.name;
  
  const checkPasswordFormat = (rule: FormItemRule, value: string) => {
    let checkFormat = /.*[A-Z@#$%^&+=!*()_?].*/;
      let checkLength = /^.{6,64}$/;
    return checkFormat.test(value) && checkLength.test(value)
  }
  
  interface ModelType {
    oldAccount: string | null
    newAccount: string | null
    reEnteredAccount: string | null
  }
  const model = ref<ModelType>({
    oldAccount: "",
    newAccount: "",
    reEnteredAccount: "",
  })
  const message = useMessage()
  
  const validateAccountSame = (rule: FormItemRule, value: string): boolean => {
    return value === model.value.newAccount
  }
  
  const rules: FormRules = {
    oldAccount: [
      {
        required: true,
        message: '请输入当前账号',
        trigger: ['input', 'blur'],
      },
    ],
    newAccount: [
      {
        required: true,
        message: '请输入新账号',
        trigger: ['input', 'blur'],
      },
      // {
      //   validator: checkPasswordFormat,
      //   message: '密码由数字,大小写字母,特殊字符组成,长度6-64,至少包含数字,大小写字母,特殊字符中的两种',
      //   trigger: ['input', 'blur'],
      // },
    ],
    reEnteredAccount: [
      {
        required: true,
        message: '请再次输入密码',
        trigger: ['input', 'blur'],
      },
      {
        validator: validateAccountSame,
        message: '两次输入的密码不一致',
        trigger: ['blur'],
      },
    ],
  }
  
  const confirmChangeAccount = () => { 
    if (
      model.value.newAccount === null ||
      model.value.oldAccount === null ||
      model.value.reEnteredAccount === null
    ) {
      message.error('请填写必要的信息')
      return
    } else if (model.value.newAccount !== model.value.reEnteredAccount) {
      message.error('两次输入的账号不一致')
      return
    } 
    // else if(!checkPasswordFormatResult) {
    //   message.error('请按照格式要求输入正确的密码')
    //     return
    // }
    else {
      const params = {
        email: model.value.newAccount
      }
      userStore.changeAccount(params).then(res => {
        if (res?.data.errorCode === '0') {
          message.info('修改账号成功，请重新登录')
          userStore.handleLogout()
          router.push({ path: '/login' })
        } else {
          message.error('修改账号失败')
        }
      })
    }
  }
  </script>
  
  <style scoped lang="scss">
  .login-wrap {
    margin: 25px;
    .login {
      width: 450px;
      margin: 180px auto;
      border: 1px solid #efefef;
      padding: 20px;
      border-radius: 10px;
  
      .logo {
        flex: 1 1 auto;
        margin-top: 10px;
        margin-bottom: 15px;
        margin-left: 5px;
        color: rgb(52, 52, 200);
  
        h3 {
          text-align: center;
        }
      }
    }
  }
  </style>
  