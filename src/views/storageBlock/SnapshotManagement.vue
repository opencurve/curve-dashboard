<template>
  <n-card>
    <div class="content-container">
      <div class="left">
        <div class="left-buttons">
          <n-button size="small" @click="batchHandle"
            v-if="!batchHandleStatus">批量操作</n-button>
          <n-button-group size="small" v-if="batchHandleStatus">
            <n-button type="error" @click="batchDeleteSnapshot">
              批量删除
            </n-button>
            <n-button type="default" @click="cancelBatchHandle">
              取消
            </n-button>
          </n-button-group>
        </div>
        <n-select class="left-select" size="small" :options="statusOptions" placeholder="请选择状态..."
          @update-value="handleChangeStatus" />
      </div>
      <div class="middle"></div>
      <div class="right">
        <n-select v-model:value="searchKey" clearable size="small" class="right-select" :options="options" placeholder="请选择关键词 ..." />
        <n-input v-model:value="searchContent" size="small" clearable @keyup.enter="searchSnapshot" placeholder="请输入...">
          <template #suffix>
            <n-icon :component="Search" />
          </template>
        </n-input>
      </div>
    </div>
    <div class="data-form">
      <n-data-table :columns="columns" :data="data" :bordered="false" :row-key="rowKey"  @update:checked-row-keys="handleCheck"/>
      <n-space justify="end">
        <n-pagination v-model:page="page" :page-count="totalPage" :on-update-page="updataPage" :page-slot="5"/>
      </n-space>
    </div>
  </n-card>
  <ConfirmDeleteModal ref="confirmDeleteModalRef" :rowInfo="rowInfo" @confirm-delete="deleteRow" />

  <n-modal v-model:show="visible" preset="dialog" title="删除" content="确认吗?"
        positive-text="确认" negative-text="取消" @positive-click="" @negative-click="() => {visible = false}">
        <div>你确定要删除这些快照吗？</div>
    </n-modal>
</template>
  
<script lang="tsx" setup>
import { Search } from '@vicons/ionicons5'
import { NDataTable, NSpace, NPagination, NSelect, NInput, NIcon, NCard, NButton, useMessage, NButtonGroup } from 'naive-ui'
import { useBlockStore } from "@/store/blockStorageManagement/block"
import router from "@/router"
import ConfirmDeleteModal from './modals/ConfirmDeleteModal.vue'
import { ref, h, watch, reactive, onMounted } from 'vue'

const page = ref(1);
const totalPage = ref(1);
const confirmDeleteModalRef = ref(null);
const rowInfo = ref(null)
const message = useMessage()
const batchHandleStatus = ref(false)
const checkedUuids = ref([])
const visible = ref(false)



const rowKey = (row) => row.uuid

const handleCheck = (rowKeys) => { 
  checkedUuids.value = rowKeys;
}

const batchDeleteSnapshot = () => {
  const params = {uuids: checkedUuids.value}

  deleteSnapshot(params).then(res => {
    if (res.status === 200) {
      message.success('删除快照成功')
      batchHandleStatus.value = false;
      snapshotManagement(
      { page: 1, size: 10 }
    ).then(res => {
      data.value = res.data.data.info;
      totalPage.value = Math.ceil(res.data.data.total / 10);
    })
    }
    else {
      message.error('删除快照失败')
    }
    initialData()
  }) 
}

const params = reactive({ page: 1, size: 10 })

const updataPage = () => {
  params.page = page.value;
}

//筛选状态
const handleChangeStatus = (val) => {
  if (val === "all") {
    snapshotManagement(
      { page: 1, size: 10 }
    ).then(res => {
      data.value = res.data.data.info;
      totalPage.value = Math.ceil(res.data.data.total / 10);
    })
  }
  else {
    params.status = val;
    params.page = 1;
    page.value = 1
  }
}

const statusOptions = [
  { label: '所有', value: "all" },
  { label: '已完成', value: 'done' },
  { label: '进行中', value: 'inProcess' },
  { label: '删除中', value: 'deleting' },
  { label: '失败删除中', value: 'errorDeleting' },
  { label: '取消中', value: 'canceling' },
  { label: '失败', value: 'error' }
]

const statusMap = {
  done: '已完成',
  inProcess: '处理中',
  deleting: '删除中',
  errorDeleting: '失败删除中',
  canceling: '取消中',
  error: '失败'
}

const options = [
  {
    label: '快照uuid',
    value: 'uuid'
  },
  {
    label: '快照租户',
    value: 'user'
  },
  {
    label: '快照文件名',
    value: 'fileName'
  },
]

const searchKey = ref(null);
const searchContent = ref("");
const columns = ref([
  {
    title: 'UUID',
    key: 'uuid',
    width: 180,
    resizable: true,
  },
  {
    title: '名称',
    key: 'name',
  },
  {
    title: '租户',
    key: 'user',
  },
  {
    title: '卷名称',
    key: 'file',
    render(row) {
      const route = { path: row.file }
      return (
        <routerLink to={route} >{row.file}</routerLink>
      )
    }
  },
  {
    title: '版本号',
    key: 'seqNum',
  },
  {
    title: '创建时间',
    key: 'time',
  },
  {
    title: '长度(GiB)',
    key: 'length',
  },
  {
    title: '状态',
    width: 90,
    render(row) {
      if (row.status === 'inProcess') {
        return (
          <span>{row.Progress}</span>
        )
      }
      else {
        return (
          <span>{statusMap[row.status]}</span>
        )
      }

    }
  },
  {
    title: '操作',
    width: 180,
    render(row) {
      return (
        <div>
          <n-button size="tiny" type="normal" disabled={row.status !== "inProcess"} onClick={onCancelSnapshot(row)}>取消快照</n-button>
          <n-button size="tiny" type="error" disabled={row.status !== 'done'} onClick={showDeleteModal(row)}>删除</n-button>
        </div>
      )
    }
  }
])

const data = ref([]);
let searchParams = {};

const batchHandle = () => {
  batchHandleStatus.value = true;
  columns.value.unshift({
    type: 'selection'
  })
}

const cancelBatchHandle = () => {
  handleCheck([])
  columns.value.shift();
  batchHandleStatus.value = false;
}

const searchSnapshot = () => {
  if (searchContent.value === "") {
    initialData()
  }
  else {
    if (searchKey.value === "uuid") {
      searchParams = {
        size: 10,
        page: 1,
        uuid: searchContent.value
      }
    } else if (searchKey.value === "user") {
      searchParams = {
        size: 10,
        page: 1,
        user: searchContent.value
      }
    } else {
      searchParams = {
        size: 10,
        page: 1,
        fileName: searchContent.value
      }
    }

    snapshotManagement(
      searchParams
    ).then(res => {
      data.value = res.data.data.info
    })
  }
}

const blockStore = useBlockStore();
const { snapshotManagement, deleteSnapshot, cancelSnapshot } = blockStore;

const initialData = () => {
  const params = {
    size: 10,
    page: 1
  }
  snapshotManagement(
    params
  ).then(res => {
    data.value = res.data.data.info;
    totalPage.value = Math.ceil(res.data.data.total / 10);
  })
}

const updatePage = () => {
  snapshotManagement(
    params
  ).then(res => {
    data.value = res.data.data.info;
    totalPage.value = Math.ceil(res.data.data.total / 10);
  })
}

const onCancelSnapshot = (row) => () => {
  const snapshots = [{
    uuid: row.uuid,
    user: row.user,
    volumeName: row.file
  }]
  cancelSnapshot({ snapshots }).then(res => {
    if (res.status === 200) {
      message.success('取消快照成功');
      updatePage();
    } else {
      message.info('快照已打完，无法取消');
      updatePage();

    }
  })
}

const showDeleteModal = (row: object) => () => {
  // rowInfo.value = row;
  rowInfo.value = { ...row, isSnapshot: true };
  // rowInfo.value.isSnapshot = true;
  confirmDeleteModalRef.value.showModal();
}

const deleteRow = (row: object) => {
  const uuids = [row.uuid];
  const params = { uuids }

  deleteSnapshot(params).then(res => {
    if (res.status === 200) {
      message.success('删除快照成功')
    }
    else {
      message.error('删除快照失败')
    }
    initialData()
  }) 
}

onMounted(
  () => {
    initialData();
  }
)

watch(params, (value) => {
  snapshotManagement(value).then(res => {
    data.value = res.data.data.info;
    totalPage.value = Math.ceil(res.data.data.total / params.size)
  })
})
</script>
  
<style lang="scss" scoped>
.content-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 75px;
  margin-top: -10px;

  .left {
    display: flex;
    flex: 1;
    justify-content: space-between;
    flex-direction: row;

    .left-buttons {
      margin-right: 15px;
    }
  }

  .middle {
    flex: 2;
  }

  .right {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .right>*:first-child {
    margin-right: 7px;
  }

}

// .left {
//   margin-right: 10px;

//   .left-select {
//     text-align: left;
//   }
// }

// .right {
//   display: flex;
//   align-items: center;
//   justify-content: flex-end;

// .right-select {
//     margin-right: 10px;
//   }
// }

// .header-filters,
// .header-search {
//   display: flex;
//   flex: 1;
//   column-gap: 20px;

//   span {
//     margin-right: 10px;
//   }
// }

// .header-search {
//   display: flex;
//   align-content: space-around;
// }

// .filter {
//   display: flex;
//   flex-direction: row;
//   align-items: center;

//   &>.n-select {
//     width: 125px;
//   }
// }
</style>
  