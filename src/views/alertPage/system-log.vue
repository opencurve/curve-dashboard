<template>
  <div class="container">
    <n-card>
      <div class="header-bar">
        <n-space justify="start">
          <NDatePicker
            type="datetimerange"
            clearable
            @update:value="onDateChange"
          />
          <n-input
            v-model:value="logSearchContent"
            placeholder="请输入日志内容..."
            clearable
            @keyup.enter="searchLog"
          >
            <template #suffix>
              <n-icon :component="Search" />
            </template>
          </n-input>
        </n-space>
      </div>
      <n-data-table
        :columns="columns"
        :data="data"
        :bordered="false"
        :scroll-x="1000"
      />
      <n-space justify="end">
        <n-pagination
          ref="pagination"
          v-model:page="page"
          :page-count="totalPage"
          :on-update:page="onUpdatePage"
          :page-slot="5"
        />
      </n-space>
    </n-card>
  </div>
</template>

<script lang="tsx" setup>
import { Search } from '@vicons/ionicons5'
import dayjs from 'dayjs'
import {
  NCard,
  NDataTable,
  NDatePicker,
  NInput,
  NPagination,
  NSpace,
  NTooltip,
} from 'naive-ui'
import { onMounted, reactive } from 'vue'
import { ref } from 'vue'

import { useAlertStore } from '@/store/alertPage/alertMessage'
const alertStore = useAlertStore()
const { getSystemLog } = alertStore

const page = ref(1)
const totalPage = ref(1)
const pagination = ref(null)

const data = ref([])

const params = reactive({
  start: 0,
  end: 0,
  page: 1,
  size: 10,
  filter: '',
})

const logSearchContent = ref('')

const columns = ref([
  {
    title: '时间',
    width: 'auto',
    key: 'time',
  },
  {
    title: '访问者IP',
    width: 'auto',
    key: 'ip',
  },
  {
    title: '访问者',
    width: 'auto',
    key: 'user',
    ellipsis: {
      tooltip: true
    },
  },
  {
    title: '模块',
    width: 'auto',
    key: 'module',
  },
  {
    title: '操作',
    width: 'auto',
    key: 'method',
    ellipsis: {
      tooltip: true
    },
    // render: (row) => {
    //   return (
    //     <span>{row.enable? '开启' : '关闭'}</span>
    //   )
    // }
  },
  {
    title: '结果',
    width: 'auto',
    key: 'errorMsg',
    ellipsis: {
      tooltip: true
    },
  },
  {
    title: '内容',
    width: 'auto',
    key: 'content',
    ellipsis: {
      tooltip: true
    },
  },
])

const updateSystemLog = () => {
  getSystemLog(params).then(res => {
    data.value = res.data.data.info || []
    totalPage.value = Math.ceil(res.data.data.total / 10)
  })
}

const onUpdatePage = (currentPage: number) => {
  page.value = currentPage
  params.page = currentPage
  updateSystemLog()
}

const searchLog = () => {
  params.filter = logSearchContent.value
  params.page = 1
  page.value = 1
  updateSystemLog()
}
const onDateChange = (range: [number, number] | null) => {
  const [start, end] = range || [0, 0]
  params.start = start
  params.end = end
  updateSystemLog()
}

onMounted(() => {
  updateSystemLog()
})
</script>

<style lang="scss" scoped>
.container {
  flex-grow: 1;
  background-color: rgb(245, 246, 250);

  .header-bar {
    margin-bottom: 32px;
    // flex-direction: row-reverse;

    .header-select {
      // flex-direction: row-reverse;
      display: flex;
      justify-content: space-between;
      flex: 2;
    }
    .header-select :first-child {
      margin-right: 16px;
    }
    .header-blank {
      // flex-direction: row-reverse;

      display: flex;
      flex: 3;
    }

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
