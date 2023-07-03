<template>
  <div class="container">
    <n-card>
      <div class="header-bar"></div>
      <div class="data-form">
        <n-data-table
          :columns="columns"
          :pagination="pagination"
          :page-slot="5"
          :data="data"
          :bordered="false"
        />
      </div>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { NDataTable, NButton, NCard } from 'naive-ui'
import { usePoolStore } from '@/store/storagePoolManagement/storagePool'
import router from '@/router'

import { ref, h } from 'vue'
const poolStore = usePoolStore()
const { getStoragepool } = poolStore

const columns = ref([
  {
    title: '逻辑池名称',
    width: 'auto',
    key: 'name',
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
          onClick: () => router.push(`/storagepool-detail/${row.id}`),
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
    render(row: any) {
      return `${row.space.canRecycled}/${row.space.alloc}/${row.space.total}`
    },
  },
  {
    title: '创建时间',
    width: 'auto',
    key: 'createTime',
  },
])

const pagination = { pageSize: 5 }

const data = ref([])

onMounted(() => {
  getStoragepool().then(res => {
    data.value = res
  })
})
</script>

<style lang="scss" scoped>
.container {
  flex-grow: 1;
  background-color: rgb(245, 246, 250);

  .header-bar {
    display: flex;
    margin-bottom: 32px;

    .header-filters {
      display: flex;
      flex: 1;
      column-gap: 20px;

      span {
        margin-right: 10px;
      }
    }

    .filter {
      display: flex;
      flex-direction: row;
      align-items: center;

      & > .n-select {
        width: 125px;
      }
    }
  }
}
</style>
