<template>
  <div class="container">
    <div class="background-pic">
      <img class="bg" src="/src/assets/pics/login-img.png" alt="" />
    </div>
    <div class="view-account">
      <n-card size="medium">
        <div class="view-account-container">
          <div class="view-account-top">
            <div class="view-account-top-desc">Curve控制台</div>
          </div>
          <div class="view-account-form">
            <n-form
              ref="formRef"
              label-placement="left"
              size="large"
              :model="formData"
              :rules="rules"
              @keydown.enter="handleSubmit"
            >
              <!-- 用户名输入 -->
              <n-form-item path="userName">
                <n-input
                  v-model:value="formData.userName"
                  placeholder="请输入用户名"
                >
                  <template #prefix>
                    <n-icon size="18" color="#808695">
                      <PersonOutline />
                    </n-icon>
                  </template>
                </n-input>
              </n-form-item>
              <!-- 密码输入 -->
              <n-form-item path="password">
                <n-input
                  v-model:value="formData.password"
                  type="password"
                  placeholder="请输入密码"
                  show-password-on="click"
                >
                  <template #prefix>
                    <n-icon size="18" color="#808695">
                      <LockClosedOutline />
                    </n-icon>
                  </template>
                </n-input>
              </n-form-item>
              <!-- 登录 -->
              <n-button
                color="#3366ff"
                size="large"
                block
                class="subBtn"
                @click="handleSubmit"
              >
                登录
              </n-button>
            </n-form>
            <div class="forgetPwd">
              <span @click="showResetPasswordModal">忘记密码</span>
            </div>
          </div>
        </div>
      </n-card>
      <ResetPasswordModal ref="resetPasswordModalRef" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { LockClosedOutline, PersonOutline } from '@vicons/ionicons5'
import md5 from 'js-md5'
import {
  type FormRules,
  NButton,
  NCard,
  NForm,
  NFormItem,
  NIcon,
  useMessage,
} from 'naive-ui'
import { reactive, ref, toRaw } from 'vue'
import { useRouter } from 'vue-router'

import ResetPasswordModal from '@/layout/components/ResetPasswordModal.vue'
import { useUserStore } from '@/store/user'

interface FormState {
  userName: string
  password: string
}

const formRef = ref()
const message = useMessage()
const resetPasswordModalRef = ref(null)
//登录接口
const userStore = useUserStore()
const { loginUser, handleLoginSuccess } = userStore
const router = useRouter()
//登录的传参
const formData = reactive({
  userName: '',
  password: '',
})
//输入验证规则
const rules: FormRules = {
  userName: { required: true, message: '请输入用户名', trigger: 'blur' },
  password: { required: true, message: '请输入密码', trigger: 'blur' },
}
//用户忘记密码：通过邮件重置密码
const showResetPasswordModal = () => {
  resetPasswordModalRef.value.showModal()
}
const handleSubmit = e => {
  if (formData.userName.trim() === '' || formData.password.trim() === '') {
    message.error('请输入用户登录信息')
    return
  } else {
    //去除密码中所有的空格
    let pswd = formData.password.replace(/\s+/g, '')
    pswd = md5(formData.password)
    //去除用户名中首尾的空格
    const userName = formData.userName.trim()
    const params: FormState = {
      userName,
      password: pswd,
    }
    message.loading('登陆中...')
    loginUser(params).then(res => {
      message.destroyAll()
      //如果后端验证登录成功
      if (res.status === 200) {
        handleLoginSuccess(res)
        message.success('登录成功！')
      }
      //如果不成功
      else if (res.errorCode !== '') {
        message.error('登录信息不正确，登录失败')
      }
    })
  }
}
</script>

<style scoped lang="scss">
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-image: url('@/assets/pics/login-background.png');
  display: flex;
  align-items: center;
  .n-card {
    background: linear-gradient(
      -45deg,
      #ffffff 0%,
      rgba(255, 255, 255, 0) 100%
    );
    border: 3px white solid;
    border-radius: 4px;
  }
}

.view-account-top-desc {
  font-family: Arial, sans-serif;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 20px;
  margin-left: 5px;
}

.background-pic {
  flex: 1;
  height: 100%;
  // background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  @media screen and (max-width: 1920px) {
    img {
      width: 41.6667vw;
      height: auto;
    }
  }
  @media screen and (min-width: 1920px) {
    img {
      width: 800px;
      height: auto;
    }
  }
}

.view-account {
  width: 386px;
  margin-right: 120px;
}
.subBtn {
  margin-top: 10px;
}
.forgetPwd {
  display: flex;
  justify-content: flex-end;
  padding-bottom: 15px;
  margin-top: 10px;
  color: #3366ff;
  span {
    cursor: pointer;
  }
}

.n-input:deep(input.n-input__input-el:autofill),
.n-input:deep(input.n-input__input-el:-webkit-autofill) {
  transition: background-color 9999s ease-in-out 9999999s !important;
}
</style>
