<template>
  <div class="container">
    <n-card>
      <n-data-table
        :columns="columns"
        :data="data"
        :bordered="false"
        :scroll-x="1000"
      />
      <n-space justify="end">
        <n-pagination />
      </n-space>
    </n-card>
    <EditModal
      ref="editModalRef"
      :row-info="alertRowInfo"
      @alert-config-updated="updateAlertList"
    />
  </div>
</template>

<script lang="tsx" setup>
import {
  buttonDark,
  NCard,
  NDataTable,
  NPagination,
  NSpace,
  useMessage,
} from 'naive-ui'
import { onMounted, reactive } from 'vue'
import { ref } from 'vue'

import { useAlertStore } from '@/store/alertPage/alertMessage'

import EditModal from './edit-modal.vue'
const alertStore = useAlertStore()
const { getAlertConfig } = alertStore

const page = ref(1)
const totalPage = ref(1)

const editModalRef = ref(null)

const data = ref([])
const alertRowInfo = ref(null)

const showEditModal = row => () => {
  alertRowInfo.value = row
  editModalRef.value.showModal()
}

const columns = ref([
  {
    title: '名称',
    width: 'auto',
    key: 'name',
  },
  {
    title: '级别',
    width: 'auto',
    key: 'level',
  },
  {
    title: '检测间隔(秒)',
    width: 'auto',
    key: 'interval',
  },
  {
    title: '触发次数',
    width: 'auto',
    key: 'times',
  },
  {
    title: '开关',
    width: 'auto',
    key: 'enable',

    render: row => {
      return <span>{row.enable ? '开启' : '关闭'}</span>
    },
  },
  {
    title: '规则',
    width: 'auto',
    key: 'rule',
  },
  {
    title: '描述',
    width: 'auto',
    key: 'desc',
  },
  {
    title: '接收人',
    width: 'auto',
    key: 'alertUsers',

    render: row => {
      return <span>{row.alertUsers.join('， ')}</span>
    },
  },
  {
    title: '操作',
    width: 'auto',
    key: 'action',

    render: row => {
      return (
        <n-button quaternary onClick={showEditModal(row)}>
          编辑
        </n-button>
      )
    },
  },
])

const updateAlertList = () => {
  getAlertConfig().then(res => {
    data.value = res.data.data
  })
}

onMounted(() => {
  updateAlertList()
})
</script>

<style lang="scss" scoped>
.container {
  flex-grow: 1;
  background-color: rgb(245, 246, 250);

  .header-bar {
    display: flex;
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
