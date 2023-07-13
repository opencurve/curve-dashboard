<template>
  <NLayout class="container">
    <NLayoutHeader class="header" bordered>
      <Header />
    </NLayoutHeader>
    <NLayout has-sider>
      <NLayoutSider
        collapse-mode="width"
        :collapsed-width="SiderEnum.COLLAPSED_WIDTH"
        :width="SiderEnum.WIDTH"
        show-trigger="bar"
        bordered
        :on-update:collapsed="updateCollapsed"
      >
        <!-- <Project :collapsed="state.collapsed" /> -->
        <Menu />
      </NLayoutSider>
      <NLayoutContent>
        <Main />
      </NLayoutContent>
    </NLayout>
  </NLayout>
</template>
<script setup lang="ts">
import { NLayout, NLayoutContent, NLayoutHeader, NLayoutSider } from 'naive-ui'
import { reactive } from 'vue'

import Header from './components/Header.vue'
import Main from './components/Main.vue'
import Menu from './components/Menu.vue'
import { SiderEnum } from './constants'

const state = reactive({ collapsed: false })
const updateCollapsed = (collapsed: boolean) => {
  state.collapsed = collapsed
}
</script>
<!-- <style scoped lang="postcss"></style> -->
