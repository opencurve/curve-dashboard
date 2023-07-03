<script setup lang="ts">
import { zhCN } from 'naive-ui'
const themeColor = 'rgba(22, 125, 255, 0.8)'
const themeOverrides = {
  Layout: {
    siderColorInverted: '#072245',
    siderBorderColorInverted: '#072245',
  },
  Menu: {
    itemTextColor: '#0d0d0d',
    itemTextColorHover: '#0d0d0d',
    itemTextColorActive: '#0d0d0d',
    itemTextColorActiveHover: '#0d0d0d',
    itemColorActive: '#0d0d0d',
    itemColorHover: '#ffffff26',
    itemColorActiveHover: '#ffffff26',
    itemColorActiveCollapsedInverted: '#ffffff26',
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
    textColorHover: themeColor,
    textColorPressed: themeColor,
    textColorFocus: themeColor,
    textColorTextHover: themeColor,
    textColorTextPressed: themeColor,
    textColorTextFocus: themeColor,
    textColorGhostHover: themeColor,
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
<template>
  <n-config-provider :theme-overrides="themeOverrides" :locale="zhCN">
    <slot></slot>
  </n-config-provider>
</template>
