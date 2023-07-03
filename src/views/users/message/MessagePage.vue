<template>
    <div class="container">
      <n-space justify="space-between">
        <div class="title">消息列表</div>
        <div class="button_container">
          <n-button size="large" type="primary"> 一键已读 </n-button>
        </div>
      </n-space>
      <div class="table_container"><MessageList /></div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { adminGetUserApi } from '@/api/user'
  import { ref } from 'vue'
  import MessageList from '@/layout/components/MessageList.vue'
  import { useUserStore } from '@/store/user'
  
  </script>
  
  <style lang="postcss" scoped></style>
  