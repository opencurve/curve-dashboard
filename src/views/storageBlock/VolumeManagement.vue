<template>
  <div class="container">
    <n-card>
      <div class="header-bar">
        <div v-if="!handleStatus" class="batch-button">
          <n-button color="#2080f0" size="small" @click="batchHandle"
            >批量操作</n-button
          >
        </div>
        <div v-else class="button-group">
          <n-button-group v-if="handleStatus" size="small">
            <n-button
              type="error"
              size="small"
              @click="showBatchDeleteVolumeModal"
            >
              批量删除
            </n-button>
            <n-button type="default" size="small" @click="cancelBatch">
              取消
            </n-button>
          </n-button-group>
        </div>
        <div
          v-if="!router.currentRoute.value.params?.path.includes('RecycleBin')"
          class="trash-bin"
        >
          <n-button strong color="#255DBE" size="small" @click="goToTrashBin">
            <template #icon>
              <n-icon size="17">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 448 512"
                >
                  <path
                    d="M268 416h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12zM432 80h-82.41l-34-56.7A48 48 0 0 0 274.41 0H173.59a48 48 0 0 0-41.16 23.3L98.41 80H16A16 16 0 0 0 0 96v16a16 16 0 0 0 16 16h16v336a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128h16a16 16 0 0 0 16-16V96a16 16 0 0 0-16-16zM171.84 50.91A6 6 0 0 1 177 48h94a6 6 0 0 1 5.15 2.91L293.61 80H154.39zM368 464H80V128h288zm-212-48h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12z"
                    fill="currentColor"
                  ></path>
                </svg>
              </n-icon>
            </template>
            回收站
          </n-button>
        </div>
        <div class="right-group">
          <div class="search-bar">
            <n-input
              v-model:value="pathToSearch"
              placeholder="请输入卷名..."
              size="small"
              clearable
              @keyup.enter="searchByPath"
            >
              <template #suffix>
                <n-icon :component="Search" />
              </template>
            </n-input>
          </div>
          <div class="create-volume-namespace">
            <n-button
              v-if="
                !router.currentRoute.value.params?.path.includes('RecycleBin')
              "
              size="small"
              @click="showCreateVolumeNamespace"
              >+卷命名空间</n-button
            >
          </div>
          <div
            v-if="
              !router.currentRoute.value.params?.path.includes('RecycleBin')
            "
            class="create-volume"
          >
            <n-button
              color="#21d69d"
              size="small"
              @click="showCreateVolume({ volumeType: 1 })"
              >+创建卷</n-button
            >
          </div>
        </div>
      </div>
      <div class="breadcrumb">
        <n-breadcrumb>
          <n-breadcrumb-item
            v-for="(itm, index) in pathArr"
            :key="index"
            :clickable="index === pathArr.length - 1 ? true : false"
            @click="crumbClick(itm, index)"
          >
            {{ itm }}
          </n-breadcrumb-item>
        </n-breadcrumb>
      </div>
      <div class="data-form">
        <n-data-table
          :columns="columns"
          :data="volumeListData"
          :checked-row-keys="checkedRowKeys"
          :bordered="false"
          :row-key="rowKey"
          @update:checked-row-keys="handleCheck"
          @update:sorter="handleSorterChange"
        />
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
  <CreateVolumeModal
    ref="createVolumeModalRef"
    @createVolume="onCreateVolumeNamespaceOrVolume"
  />
  <CreateVolumeNamespaceModal
    ref="createVolumeNamespaceModalRef"
    @createNamespace="onCreateVolumeNamespaceOrVolume"
  />
  <VolumeThrottleModal ref="volumeThrottleModalRef" />
  <VolumeExtedModal ref="volumeExtedModalRef" />
  <CreateSnapshotModal ref="createSnapshotModalRef" :row-info="rowInfo" />
  <ConfirmDeleteModal
    ref="confirmDeleteModalRef"
    :row-info="rowInfo"
    @confirm-delete="deleteRow"
  />
  <!-- <LazyCloneVolumeModal ref="lazyCloneVolumeModalRef" :rowInfo="rowInfo" /> -->
  <BatchDeleteVolumeModal
    ref="batchDeleteVolumeModalRef"
    @confirm-batch-delete="batchDeleteVolume"
  />
</template>

<script lang="tsx" setup>
import { Search } from '@vicons/ionicons5'
import type {
  DataTableColumn,
  DataTableColumns,
  DataTableSortState,
} from 'naive-ui'
import {
  NBreadcrumb,
  NBreadcrumbItem,
  NButton,
  NCard,
  NDataTable,
  NIcon,
  NInput,
  NModal,
  NPagination,
  NSpace,
  useMessage,
} from 'naive-ui'
import { h, reactive, ref, toRefs, watch } from 'vue'
// import router from "@/router"
import { useRouter } from 'vue-router'

import type { getVolumeApiDataItem } from '@/api/block'
import { useBlockStore } from '@/store/blockStorageManagement/block'

import BatchDeleteVolumeModal from './modals/BatchDeleteVolumeModal.vue'
import ConfirmDeleteModal from './modals/ConfirmDeleteModal.vue'
import CreateSnapshotModal from './modals/CreateSnapshotModal.vue'
import CreateVolumeModal from './modals/VolumeCreateModal.vue'
import VolumeExtedModal from './modals/VolumeExtendModal.vue'
import CreateVolumeNamespaceModal from './modals/VolumeNamespaceModal.vue'
import VolumeThrottleModal from './modals/VolumeThrottleModal.vue'
const router = useRouter()
const blockStore = useBlockStore()
const {
  getVolumeList,
  getVolumeDetail,
  deleteVolume,
  recoverVolume,
  lazyCloneVolume,
  createSnapshot,
  state,
} = blockStore
let { volumeList } = toRefs(blockStore.state)
let routePath = ref(router.currentRoute.value.params.path)
console.log('routePath----------------------', router.currentRoute.value)
let currentPath = ref(
  !routePath.value ? '/' : '/' + routePath.value.join('/') + '/',
)
console.log('currentPath', currentPath)

const page = ref(1)
const volumeListData = ref([])
const totalPage = ref(1)
const params = reactive({ page: 1, size: 10, path: '' })
const pathArr = ref([])
const message = useMessage()
const pageLoading = ref(false)
const rowInfo = ref(null)

const checkedFileNames = ref({})

const checkedRowKeys = ref([])

const rowKey = row => {
  return row.fileName + ':' + row.fileType
}

const handleCheck = rowKeys => {
  if (rowKeys.length === 0) {
    checkedRowKeys.value = []
  } else {
    rowKeys.forEach(item => {
      checkedRowKeys.value = rowKeys
      const nameTypePair = item.split(':')
      const nameFullPath = currentPath.value + nameTypePair[0]
      const fileType = nameTypePair[1]
      checkedFileNames.value[nameFullPath] = fileType
    })
  }
}

const cancelBatch = () => {
  checkedRowKeys.value = []
  columns.shift()
  handleStatus.value = false
}

const getPathArr = () => {
  let arr = params.path.split('/')
  if (arr.length === 1) {
    arr = ['home']
  } else {
    arr.shift()
    arr.unshift('home')
    pathArr.value = [...arr]
  }
}
const lengthColumn: DataTableColumn<getVolumeApiDataItem> = reactive({
  title: '已分配/卷长度(GiB)',
  key: 'volume-length',
  width: 'auto',
  sorter: true,
  render(row) {
    return h('span', `${row.alloc}/${row.length}`)
  },
})

const createVolumeModalRef = ref(null)
const createVolumeNamespaceModalRef = ref(null)
const volumeThrottleModalRef = ref(null)
const volumeExtedModalRef = ref(null)
const confirmDeleteModalRef = ref(null)
const createSnapshotModalRef = ref(null)
const batchDeleteVolumeModalRef = ref(null)

//表单的操作
const showCreateVolume = (data: object) => {
  createVolumeModalRef.value.setVisibleAndDisabled(true, false)
  createVolumeModalRef.value.setFormData(data)
  createVolumeModalRef.value.showModal()
}
const showCreateVolumeNamespace = () => {
  createVolumeNamespaceModalRef.value.showModal()
}
const showVolumeThrottleModal = (row: object) => () => {
  const volumeToThrottle = currentPath.value + row.fileName
  volumeThrottleModalRef.value.setVolumeToThrottle(volumeToThrottle)
  volumeThrottleModalRef.value.showModal()
}
const showVolumeExtedModal = row => () => {
  const volumeToExtend = currentPath.value + row.fileName
  volumeExtedModalRef.value.setVolumeToExtend(volumeToExtend, row.length)
  volumeExtedModalRef.value.showModal()
}

const showDeleteModal = (row: object, inRecycleBin: boolean) => () => {
  if (inRecycleBin) {
    row.inRecycleBin = true
  } else {
    row.inRecycleBin = false
  }
  rowInfo.value = row
  confirmDeleteModalRef.value.showModal()
}

const showCreateSnapshot = (row: Object) => () => {
  rowInfo.value = row
  createSnapshotModalRef.value.showModal()
}
//展示lazy克隆的modal
const onLazyCloneVolume = row => () => {
  const params = {
    volumeName: currentPath.value + row.fileName,
    user: row.owner,
  }
  lazyCloneVolume(params).then(res => {
    if (res.status === 200) {
      message.success('安装数据成功！')
      updateList()
    } else {
      message.error('安装数据失败')
    }
  })
}

const updateList = () => {
  getVolumeList(params).then(res => {
    volumeListData.value = volumeList.value
    totalPage.value = Math.ceil(res.data.data.total / 10)
  })
}

//删除卷
const deleteRow = (row: object) => {
  const fileName = currentPath.value + row.fileName
  const fileType = row.fileType
  deleteVolume({
    volumeNames: { [fileName]: fileType },
    force: row.inRecycleBin,
  }).then(res => {
    if (res.status === 200) {
      if (window.location.pathname === '/recycleBin') {
        message.success('彻底删除卷成功')
      } else {
        message.success('删除卷成功')
      }
      getVolumeList(params).then(res => {
        volumeListData.value = volumeList.value
        totalPage.value = Math.ceil(res.data.data.total / 10)
      })
    } else {
      message.error('删除卷失败')
    }
    // getVolumeList({ page: 1, size: 10, path: '/', sortKey: 'id', sortDirection: 1 }).then(res => {
    //   volumeListData.value = volumeList.value;
    //   totalPage.value = Math.ceil(res.data.data.total / 10)
    //   page.value = 1;
    // })
  })
}
//批量删除卷
const batchDeleteVolume = () => {
  deleteVolume({
    volumeNames: checkedFileNames.value,
    force: window.location.pathname.includes('RecycleBin') ? true : false,
  }).then(res => {
    if (res.status === 200) {
      if (window.location.pathname === '/recycleBin') {
        message.success('彻底删除卷成功')
      } else {
        message.success('删除卷成功')
      }
      getVolumeList(params).then(res => {
        volumeListData.value = volumeList.value
        totalPage.value = Math.ceil(res.data.data.total / 10)
        checkedFileNames.value = {}
        checkedRowKeys.value = []
      })
    } else {
      message.error('删除卷失败')
    }
  })
}
const showBatchDeleteVolumeModal = () => {
  batchDeleteVolumeModalRef.value.showModal()
}

//恢复卷
const recoverVolumeFromBin = (row: object) => () => {
  const recoverParams = { [row.originalFullPathName]: row.id }
  recoverVolume({ volumeIds: recoverParams }).then(res => {
    if (res.status === 200) {
      message.success('恢复成功')
      getVolumeList(params).then(res => {
        volumeListData.value = volumeList.value
        totalPage.value = Math.ceil(res.data.data.total / 10)
        page.value = 1
      })
    } else {
      message.error('恢复失败')
    }
  })
}

const onCreateVolumeNamespaceOrVolume = () => {
  getVolumeList(params).then(res => {
    volumeListData.value = volumeList.value
    totalPage.value = Math.ceil(res.data.data.total / 10)
    page.value = 1
  })
}

const cloneVolume = row => () => {
  createVolumeModalRef.value.setVisibleAndDisabled(false, true)
  const routePath = ref(router.currentRoute.value.params.path)
  const currentPath = ref(
    !routePath.value ? '/' : '/' + routePath.value.join('/') + '/',
  )
  const src = currentPath.value + row.fileName
  const data = {
    volumeType: 2,
    src: src,
  }
  createVolumeModalRef.value.setFormData(data)
  createVolumeModalRef.value.showModal()
}

const statusMap = {
  kFileCreated: '正常',
  kFileDeleting: '删除中',
  kFileCloning: '克隆中',
  kFileCloneMetaInstalled: '克隆数据待安装',
  kFileCloned: '克隆完成',
  kFileBeingCloned: '克隆中',
}

//头部按钮的操作栏
const selectedRowKeys = []
const handleStatus = ref(false)

const batchHandle = () => {
  handleStatus.value = !handleStatus.value
  if (handleStatus.value) {
    columns.unshift({ type: 'selection' })
  } else {
    handleStatus.value = false
    columns.shift()
  }
}

//面包屑导航的处理
const crumbClick = (itm: string, index: number) => {
  if (index === pathArr.value.length - 1) {
    return
  } else {
    if (itm === 'home') {
      router.push('/volume-management/')
      getVolumeList({
        page: 1,
        size: 10,
        path: '/',
        sortKey: 'id',
        sortDirection: -1,
      }).then(res => {
        // totalPage.value = Math.ceil(res.data.data.total / 10);
        volumeListData.value = volumeList.value
        totalPage.value = Math.ceil(res.data.data.total / 10)
        page.value = 1
      })
    } else {
      let pathToHandle = pathArr.value
      let pathToGo = pathToHandle.slice(1, index + 1)
      router.push({
        name: 'VolumeManagement',
        params: {
          path: pathToGo,
        },
      })
    }
  }
}

//处理路径搜索
const pathToSearch = ref('')
const searchByPath = () => {
  //清空面包屑位置
  // pathArr.value = ['home'];
  // getPathArr();
  console.log(111, pathToSearch.value)
  let searchParams = {
    volumeName: pathToSearch.value,
    // start: 1689127990,
    // end: 1689131590,
    // interval: 15,
  }
  if (pathToSearch.value === '') {
    let _pathArr = router.currentRoute.value.params.path
    _pathArr = '/' + (_pathArr.length === 0 ? '' : _pathArr.join('/'))
    getVolumeList({
      page: 1,
      size: 10,
      path: _pathArr,
      sortKey: 'id',
      sortDirection: -1,
    }).then(res => {
      totalPage.value = Math.ceil(res.data.data.total / 10)
      page.value = 1
      volumeListData.value = volumeList.value
    })
  } else {
    getVolumeDetail(searchParams).then(res => {
      let searchResult = []
      if (res.data.data !== null) {
        searchResult.push(res.data.data.info)
        for (let i = 0; i < searchResult.length; i++) {
          searchResult[i].key = 'volume_' + i
        }
        volumeListData.value = searchResult
        totalPage.value = Math.ceil(searchResult.length)
      }
      //未匹配到相应的结果
      else {
        volumeListData.value = searchResult
        totalPage.value = 1
        // page.value = 1;
        message.error('未匹配到相应结果')
      }
    })
  }
}

const cTimeColumn: DataTableColumn<getVolumeApiDataItem> = reactive({
  title: '创建时间',
  key: 'ctime',
  width: 'auto',
  sorter: true,
  render: row => <span>{row.ctime}</span>,
})

const operateColumn: DataTableColumn<getVolumeApiDataItem> = reactive({
  title: '操作',
  key: 'action',
  width: 'auto',
  render: row => {
    if (router.currentRoute.value.params.path.includes('RecycleBin')) {
      return (
        <div>
          <n-button
            size='tiny'
            disabled={[
              'kFileDeleting',
              'kFileCloneMetaInstalled',
              'kFileCloning',
            ].includes(row.fileStatus)}
            type='normal'
            onClick={recoverVolumeFromBin(row)}
          >
            恢复
          </n-button>
          <n-button
            size='tiny'
            type='error'
            onClick={showDeleteModal(row, true)}
          >
            彻底删除
          </n-button>
        </div>
      )
    } else if (row.fileStatus === 'kFileDeleting') {
      return (
        <div>
          <n-button size='tiny' disabled type='normal'>
            不可操作
          </n-button>
        </div>
      )
    } else
      return (
        <div>
          <n-button
            size='tiny'
            type='normal'
            disabled={row.fileType === 'INODE_DIRECTORY'}
            onClick={showVolumeThrottleModal(row)}
          >
            设置限流
          </n-button>
          <n-button
            size='tiny'
            disabled={row.fileType === 'INODE_DIRECTORY'}
            type='normal'
            onClick={showVolumeExtedModal(row)}
          >
            扩容
          </n-button>
          <n-button
            size='tiny'
            disabled={row.fileType === 'INODE_DIRECTORY'}
            onClick={cloneVolume(row)}
            type='normal'
          >
            克隆
          </n-button>
          <n-button
            disabled={
              row.fileStatus !== 'kFileCloneMetaInstalled' ||
              row.fileType === 'INODE_DIRECTORY'
            }
            size='tiny'
            onClick={onLazyCloneVolume(row)}
            type='normal'
          >
            安装数据
          </n-button>
          <n-button
            size='tiny'
            disabled={
              row.fileType === 'INODE_DIRECTORY' ||
              !['kFileCreated', 'kFileCloned'].includes(row.fileStatus)
            }
            type='normal'
            onClick={showCreateSnapshot(row)}
          >
            打快照
          </n-button>
          <n-button
            size='tiny'
            disabled={row.mountPoints.length !== 0}
            type='error'
            onClick={showDeleteModal(row, false)}
          >
            删除
          </n-button>
        </div>
      )
  },
})

const updataPage = () => {
  params.page = page.value
}

const goToTrashBin = () => {
  router.push('/volume-management/RecycleBin')
  page.value = 1
}

const handleItemClick = (row: getVolumeApiDataItem) => () => {
  if (pageLoading.value) return
  const name =
    row.fileType === 'INODE_DIRECTORY' ? 'VolumeManagement' : 'VolumeDetail'
  const path = router.currentRoute.value.params.path || []
  router.push({
    name,
    params: {
      path: [...path, row.fileName],
    },
  })
}
const handleSorterChange = (sorter: DataTableSortState) => {
  cTimeColumn.sortOrder = false
  lengthColumn.sortOrder = false
  const column = sorter.columnKey === 'ctime' ? cTimeColumn : lengthColumn
  column.sortOrder = sorter.order //cTimeColumn.sortOrder==='ascend'?'descend':'ascend'
  params.page = 1
  params.sortKey = sorter.order ? sorter.columnKey : 'id'
  params.sortDirection = sorter.order === 'descend' ? -1 : 1
}

const columns: DataTableColumns<getVolumeApiDataItem> = reactive([
  {
    title: '名称',
    key: 'name',
    width: 'auto',
    render(row) {
      if (row.fileType === 'INODE_DIRECTORY') {
        return (
          <NButton
            size='small'
            type='info'
            style={{ padding: '0 4px' }}
            quaternary
            onClick={handleItemClick(row)}
          >
            <span>
              {row.fileName.length < 15
                ? row.fileName
                : row.fileName.substring(0, 15) + '...'}
            </span>
            <span>
              <n-icon size='18' color='#2080f0'>
                <svg viewBox='0 0 16 16'>
                  <g fill='none'>
                    <path
                      d='M7.207 4h-.032l-1.113-.89A.5.5 0 0 0 5.75 3H4a2 2 0 0 0-2 2v.5h3.557L7.207 4z'
                      fill='currentColor'
                    ></path>
                    <path
                      d='M8.693 4L6.086 6.37a.5.5 0 0 1-.336.13H2V11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H8.693z'
                      fill='currentColor'
                    ></path>
                  </g>
                </svg>
              </n-icon>
            </span>
          </NButton>
        )
      }
      return (
        <NButton
          size='small'
          type='info'
          style={{ padding: '0 4px' }}
          quaternary
          onClick={handleItemClick(row)}
        >
          <span>
            {row.fileName.length < 15
              ? row.fileName
              : row.fileName.substring(0, 15) + '...'}
          </span>
        </NButton>
      )
    },
  },
  {
    title: '所属者',
    key: 'copysetNum',
    width: 'auto',

    render(row) {
      return h('span', row.owner)
    },
  },
  lengthColumn,
  {
    title: '挂载状态',
    key: 'mountPoints',
    width: 'auto',

    render(row) {
      if (row.fileType === 'INODE_DIRECTORY') {
        return <span>/</span>
      }
      if (row.mountPoints.length > 0) {
        return <span>已挂载</span>
      } else if (row.mountPoints.length === 0) {
        return <span>未挂载</span>
      }
    },
  },
  {
    title: '状态',
    key: 'fileStatus',
    width: 'auto',

    render(row) {
      return <span>{statusMap[row.fileStatus]}</span>
    },
  },
  cTimeColumn,
  operateColumn,
])

watch(params, value => {
  value.sortKey = value.sortKey || 'id'
  value.path = value.path || '/'
  value.sortDirection = value.sortDirection || -1
  pageLoading.value = true
  getVolumeList(value).then(res => {
    pageLoading.value = false
    if (res.name && res.name === 'AxiosError') {
      message.error('请输入正确的路径')
    } else {
      volumeListData.value = volumeList.value
      totalPage.value = Math.ceil(res.data.data.total / 10)
    }
  })
})

watch(page, newVal => {
  params.page = newVal
  getVolumeList(params).then(res => {
    if (res.name && res.name === 'AxiosError') {
      message.error('请输入正确的路径')
    } else {
      totalPage.value = Math.ceil(res.data.data.total / 10)
    }
  })
})

watch(
  router.currentRoute,
  value => {
    if (window.location.pathname.includes('volume-management')) {
      routePath.value = router.currentRoute.value.params.path
      currentPath.value = !routePath.value
        ? '/'
        : '/' + routePath.value.join('/') + '/'
      checkedFileNames.value = {}
      checkedRowKeys.value = []
    }
    //  routePath.value = router.currentRoute.value.params.path;
    //  currentPath.value = routePath.value === '' ? '/' : '/' + routePath.value.join('/') + '/';
    console.log('value', value)
    if (value.name !== 'VolumeManagement') return
    const path = (value.params.path as string[]) || []
    params.path = '/' + path.join('/')
    params.page = 1
    getPathArr()
  },
  { immediate: true },
)
</script>

<style lang="scss" scoped>
.container {
  flex-grow: 1;
  background-color: rgb(245, 246, 250);

  .header-bar {
    display: flex;
    justify-content: space-between;
    margin-bottom: 32px;

    .breadcrumb {
      margin-right: auto;
    }

    .search-input {
      margin-left: auto;
    }

    .batch-button {
      align-self: start;
    }

    .button-group {
      display: flex;
      align-self: start;
      justify-content: space-between;
    }

    .search-bar {
      margin-right: 10px;
      align-self: end;
    }

    .right-group {
      display: flex;
      flex-direction: row;
      justify-content: space-around;

      .create-volume-namespace {
        margin-right: 5px;
      }
    }

    // .filter {
    //   display: flex;
    //   flex-direction: row;
    //   align-items: center;

    //   &>.n-select {
    //     width: 125px;
    //   }
    // }
  }
}
</style>
