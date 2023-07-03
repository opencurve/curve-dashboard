<template>
  <div class="container">
    <n-card>
      <div class="header-bar">
        <div class="header-search">
          <n-input placeholder="输入主机名称..." v-model:value="searchValue" @keyup.enter="searchDisk" clearable>
            <template #suffix>
              <n-icon :component="Search" />
            </template>
          </n-input>
        </div>
      </div>
      <div class="data-form">
        <n-data-table :columns="columns" :data="data" :bordered="false" />
        <n-space justify="end">
          <n-pagination v-model:page="page" :page-count="totalPage" :on-update-page="updataPage" :page-slot="5" />
        </n-space>
      </div>
    </n-card>
  </div>
</template>

<script lang="tsx" setup>
import { onMounted, watch, reactive } from 'vue'
import { Search } from '@vicons/ionicons5'
import { NDataTable, NInput, NIcon, NCard, NPagination, NSpace, useMessage } from 'naive-ui'
import { useDiskStore } from '@/store/clusterManagement/disk'

import { ref } from 'vue'
const diskStore = useDiskStore()
const { getDiskList } = diskStore
type A<T> = T extends false ? never : T

const page = ref(1);
const totalPage = ref(1);

const updataPage = () => {
  // delete params.hostName;
  params.page = page.value;
}

const data = ref([])

const searchValue = ref("");
const message = useMessage();
const params = reactive({ page: 1, size: 10 })

const searchDisk = () => {
  if (searchValue.value === "") {
    delete params.hostName;
    getDiskList({ page: 1, size: 10 }).then(res => {
      if (res.status !== 200) {
        data.value = [];
        totalPage.value = 1;
        page.value = 1;
      }
      data.value = res.data.data.info;
      page.value = 1;
      calPage(res.data.data.total)
    })
  }
  else {
    params.hostName = searchValue.value
    params.page = 1;
    page.value = 1;
    // params.page = 1
  }
}

watch(params, (value) => {
  getDiskList(value).then(res => {
    if (res.status !== 200) {
      data.value = [];
      page.value =1;
      totalPage.value = 1;
    }
    else if(res.data.data.length === 0) {
      data.value = [];
      page.value =1;
      totalPage.value = 1;
      message.error('未找到相应的主机名')
    }
    else {
      data.value = res.data.data.info;
      calPage(res.data.data.total)
    }
  })
})

const columns = ref([
  {
    title: '主机名',
    width: 'auto',
    key: 'hostName',
    
  },
  {
    title: '盘符',
    width: 'auto',
    key: 'device',
    
  },
  {
    title: '类型',
    width: 'auto',
    key: 'diskType',
    
  },
  {
    title: '型号',
    width: 'auto',
    key: 'model',
    
  },
  // {
  //   title: '写缓存',
  //   width: 'auto',
  //   key: 'writeCache',
  // },
  {
    title: '挂载点',
    key: 'mountPoint',
    width: 'auto',
    
    render(row) {
      if (row.mountPoint) {
        return <span>{row.mountPoint}</span>
      }
      else {
        return (
          <span>未挂载</span>
        )
      }
    }
  },
  {
    title: '使用量/容量(GiB)',
    width: 'auto',
    
    render(row) {
      return (
        <span>{row.spaceUsed}/{row.spaceTotal}</span>
      )

    }
  },
])

const calPage = (totalPageNumber: Number) => {
  if (totalPageNumber) {
    let countPage = totalPageNumber / 10;
    totalPage.value = Math.ceil(countPage);
  }
  else {
    totalPage.value = 1;
  }
}

onMounted(() => {
  const params = { size: 10, page: 1 }
  getDiskList(params).then(res => {
    data.value = res.data.data.info;
    calPage(res.data.data.total)
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
    flex-direction: row-reverse;

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

      &>.n-select {
        width: 125px;
      }
    }
  }
}
</style>
