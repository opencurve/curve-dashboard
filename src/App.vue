<template>
  <div class="container">
    <n-config-provider :locale="zhCN" :theme-overrides="themeOverrides">
      <n-message-provider>
        <router-view></router-view>
      </n-message-provider>
    </n-config-provider>
  </div>
</template>
<script setup lang="ts">
import { NConfigProvider, NMessageProvider, zhCN } from 'naive-ui'

import { useUserStore } from '@/store/user'

const userStore = useUserStore()

userStore.getUserInfo()
const themeColor = 'rgba(22, 125, 255, 0.8)'
const themeOverrides = {
  common: {
    primaryColor: '#3366ff',
  },
  Layout: {
    siderColorInverted: '#072245',
    siderBorderColorInverted: '#072245',
  },
  Tabs: {
    tabTextColorActiveLine: themeColor,
    tabTextColorHoverLine: themeColor,
    barColor: themeColor,
    tabTextColorActiveCard: themeColor,
  },
  Input: {
    caretColor: themeColor,
    loadingColor: themeColor,
    borderHover: '1px solid rgba(22, 125, 255, 0.8)',
    borderFocus: '1px solid rgba(22, 125, 255, 0.8)',
    boxShadowFocus: '0 0 0 2px rgba(22, 125, 255, 0.2)',
  },
  Select: {
    peers: {
      InternalSelection: {
        caretColor: themeColor,
        loadingColor: themeColor,
        borderHover: '1px solid rgba(22, 125, 255, 0.8)',
        borderFocus: '1px solid rgba(22, 125, 255, 0.8)',
        borderActive: '1px solid rgba(22, 125, 255, 0.8)',
        boxShadowHover: '0 0 0 2px rgba(22, 125, 255, 0.2)',
        boxShadowActive: '0 0 0 2px rgba(22, 125, 255, 0.2)',
        boxShadowFocus: '0 0 0 2px rgba(22, 125, 255, 0.2)',
      },
      InternalSelectMenu: {
        optionTextColorActive: themeColor,
        optionCheckColor: themeColor,
        optionTextColorPressed: themeColor,
      },
    },
  },
  Radio: {
    dotColorActive: themeColor,
    buttonBorderColorActive: themeColor,
    buttonTextColorActive: themeColor,
    buttonTextColorHover: themeColor,
    boxShadowActive: 'inset 0 0 0 1px rgba(22, 125, 255, 0.2)',
    boxShadowFocus: 'inset 0 0 0 1px rgba(22, 125, 255, 0.2)',
    boxShadowHover: 'inset 0 0 0 1px rgba(22, 125, 255, 0.2)',
  },
  Switch: {
    loadingColor: themeColor,
    railColorActive: themeColor,
    boxShadowFocus: '0 0 0 2px rgba(22, 125, 255, 0.2)',
  },
  Checkbox: {
    colorChecked: themeColor,
    borderChecked: '1px solid rgba(22, 125, 255, 0.8)',
    borderFocus: '1px solid rgba(22, 125, 255, 0.8)',
    boxShadowFocus: '0 0 0 2px rgba(22, 125, 255, 0.2)',
  },
  Button: {
    border: '1px solid rgba(22, 125, 255, 0.8)',
    colorPrimary: themeColor,
    textColorHover: '#000',
    textColorPressed: themeColor,
    textColorFocus: themeColor,
    textColorTextHover: themeColor,
    textColorTextFocus: themeColor,
    textColorGhostHover: themeColor,
    hoverColor: themeColor,
    rippleColor: themeColor,
    borderHover: '1px solid rgba(22, 125, 255, 0.8)',
    borderPressed: '1px solid rgba(22, 125, 255, 0.8)',
    borderFocus: '1px solid rgba(22, 125, 255, 0.8)',
  },
  Spin: {
    color: themeColor,
    textColor: '#333639',
  },
  Typography: {
    aTextColor: themeColor,
  },
  Log: {
    loadingColor: themeColor,
  },
  Tree: {
    nodeColorActive: 'rgba(22, 125, 255, 0.2)',
  },
  Pagination: {
    itemTextColorHover: themeColor,
    itemTextColorPressed: themeColor,
    itemTextColorActive: themeColor,
    itemBorderActive: '1px solid rgba(22, 125, 255, 0.8)',
  },
  Slider: {
    fillColor: themeColor,
    fillColorHover: themeColor,
  },
  DataTable: {
    thFontWeight: 550,
    thTextColor: '#495060FF',
  },
  PageHeader: {
    backColorHover: themeColor,
  },
}
</script>

<style scoped>
.container {
  height: 100vh;
  overflow: auto;
}
</style>
