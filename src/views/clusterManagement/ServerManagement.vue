<template>
  <div class="container">
    <n-card>
      <div class="header-bar"></div>
      <div class="data-form">
        <n-data-table :columns="columns" :data="data" :bordered="false" />
        <n-space justify="end">
          <n-pagination
            v-model:page="page"
            :page-count="totalPage"
            :on-update-page="updataPage"
            :page-slot="5"
          />
        </n-space>
      </div>
    </n-card>
  </div>
</template>

<script lang="tsx" setup>
import { Search } from '@vicons/ionicons5'
import { NButton, NCard, NDataTable, NPagination, NSpace } from 'naive-ui'
import { h, onMounted, reactive, watch } from 'vue'
import { ref } from 'vue'

import router from '@/router'
import { useServerStore } from '@/store/clusterManagement/server'
const serverStore = useServerStore()
const { getServerList } = serverStore

const page = ref(1)
const totalPage = ref(1)
const params = reactive({ page: 1, size: 10 })

const columns = ref([
  {
    title: '主机名',
    key: 'hostName',
    width: 'auto',

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
          onClick: () => {
            // let hostNameArr = row.hostName.split('.');
            // let hostName = hostNameArr[0] + hostNameArr[1];
            router.push({ name: 'ServerDetail', query: { q: row.hostName } })
          },
        },
        { default: () => row.hostName },
      )
    },
  },
  {
    title: 'IP地址',
    width: 'auto',
    key: 'ip',
  },
  {
    title: 'cpu核数',
    width: 'auto',

    render(row) {
      return <span>{row.cpuCores.totalNum}</span>
    },
  },
  {
    title: '内存(单位GiB)',
    width: 'auto',
    key: 'memory',
  },
  {
    title: '硬盘数量',
    width: 'auto',
    key: 'diskNum',
  },
  {
    title: '内核发行号',
    width: 'auto',
    key: 'kernelRelease',
  },
])

const data = ref([])

const updataPage = () => {
  params.page = page.value
}

onMounted(() => {
  const params = { size: 10, page: 1 }
  getServerList(params).then(res => {
    data.value = res.data.data.info
    let countPage = res.data.data.total / 10
    let isInteger = Number.isInteger(countPage)
    totalPage.value = isInteger ? countPage : parseInt(countPage) + 1
  })
})

watch(params, value => {
  getServerList(value).then(res => {
    data.value = res.data.data.info
    totalPage.value = res.data.data.total
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
