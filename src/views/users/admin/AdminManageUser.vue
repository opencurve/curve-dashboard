<template>
  <n-card>
  <div class="container">
    <n-space justify="space-between">
      <div class="title">用户管理</div>
      <div class="button_container">
        <n-button size="large" color="#3366ff" @click="showCreateUserModal">
          +添加成员
        </n-button>
      </div>
    </n-space>
    <div class="table_container">
      <UserList ref="userListRef" />
    </div>
    <CreateUserModal ref="createUserModalRef" @create-user-successful = "onUserListUpdate"/>
  </div>
</n-card>
</template>

<script lang="ts" setup>
import { ref, toRef } from 'vue'
import {useMessage, NCard, NSpace, NButton,} from "naive-ui"
import UserList from '@/layout/components/admin/UserList.vue'
import { useUserStore } from '@/store/user'
import CreateUserModal from '@/layout/components/admin/CreateUserModal.vue'

//定义需要使用的参数，这里采用给模态框赋予ref值后进行操作。避免无法关闭的问题
const userStore = useUserStore();
const userListRef = ref(null);
const {adminDeleteUser} = userStore;
const message = useMessage();
const createUserModalRef = ref(null)
const confirmDeleteUserModalRef = ref(null)
const userDeletedFlag = toRef(userStore.flag, 'userDeletedFlag')
const showCreateUserModal = () => {
  createUserModalRef.value.showModal()
}

const onUserListUpdate = () => { 
userListRef.value.onCreateUser();  
}

</script>

<style lang="postcss" scoped></style>
