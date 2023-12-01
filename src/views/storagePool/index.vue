<template>
  <div class="container">
    <n-card style="padding-top: 32px; padding-bottom: 32px">
      <n-data-table :columns="columns" :data="state.data" :bordered="false" />
    </n-card>
  </div>
</template>

<script lang="ts" setup>
import type { DataTableColumns } from 'naive-ui'
import { NButton, NCard, NDataTable } from 'naive-ui'
import { h, reactive } from 'vue'

import { getStoragePoolApi } from '@/api/storagePool'
import type { StoragePoolInfo } from '@/model/storagePool'
import router from '@/router'

const state = reactive({
  data: [] as StoragePoolInfo[],
})
const columns: DataTableColumns<StoragePoolInfo> = [
  {
    title: '逻辑池名称',
    width: 'auto',
    key: 'name',
    ellipsis: {
      tooltip: true
    },
    render(row) {
      return h(
        NButton,
        {
          size: 'small',
          type: 'info',
          style: {
            padding: '0 4px',
          },
          quaternary: true,
          onClick: () =>
            router.push({ name: 'StoragePoolDetail', params: { id: row.id } }),
        },
        { default: () => row.name },
      )
    },
  },
  {
    title: '分配状态',
    width: 'auto',
    key: 'allocateStatus',
  },
  {
    title: '存储池节点数量',
    width: 'auto',
    key: 'serverNum',
  },
  {
    title: 'chunkserver数量',
    width: 'auto',
    key: 'chunkServerNum',
  },
  {
    title: 'copyset数量',
    width: 'auto',
    key: 'copysetNum',
  },
  {
    title: '容量(可回收/已分配/总量)GiB',
    width: 'auto',
    key: 'space',
    render(row) {
      return `${row.space.canRecycled}/${row.space.alloc}/${row.space.total}`
    },
  },
  {
    title: '创建时间',
    width: 'auto',
    key: 'createTime',
  },
]

const getStoragepool = async () => {
  const [err, res] = await getStoragePoolApi()
  if (err) return console.log('请求报错啦', err)
  state.data = res.data.data
}

getStoragepool()
</script>

<style lang="scss" scoped>
.container {
  flex-grow: 1;
  background-color: rgb(245, 246, 250);
}
</style>
