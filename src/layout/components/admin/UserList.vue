<template>
  <n-data-table :bordered="false" :single-line="false" single-column :columns="columns" :data="data"/>
  <n-space justify="end">
   <n-pagination v-model:page="page" :page-count="totalPage" :on-update:page="onUpdatePage" :page-slot="5"/>
  </n-space>
  <n-modal v-model:show="showVal" preset="dialog" title="确定将用户移除？">
    <template #header>
      <div>确定要删除该用户吗？</div>
    </template>
    <template #action>
      <div>
        <n-button @Click="cancel">取消</n-button> &nbsp;&nbsp;
        <n-button @Click="handleDeleteUser" type="error">删除</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script lang="tsx" setup>
import { h, ref, toRef, reactive, watch } from 'vue'
import { NButton, NDataTable, NModal, NPagination, useMessage, NSpace } from 'naive-ui'
import { useUserStore } from '@/store/user'
import { exposedDialogEnvProps } from 'naive-ui/es/dialog/src/DialogEnvironment';

const editPermissionStatus = ref([]);

const page = ref(1);
const totalPage = ref(1);

const params = {page: 1, size: 10};

const onUpdatePage = (val) => {
  page.value = val;
  params.page = val;
  updateUserList(); 
}

const columns = ref([
  {
    title: '用户名',
    key: 'userName',

  },
  {
    title: '邮箱',
    key: 'email',

  },
  {
    title: '用户角色',
    key: 'permission',
    width: 360,
    render(row, index) {
      let name = "";
      const permission = ref(row.permission);
      if (row.permission === 4) {
        name = "只读用户"
      }
      else if (row.permission === 6) {
        name = "读写用户"
      }
      else if (row.permission === 7) {
        name = "管理员"
      }

      const options = [
        {
          label: "只读用户",
          value: 4
        },
        {
          label: "读写用户",
          value: 6
        },
      ]

      const onSelectPermission = (val: number) => { 
          permission.value = val;
      }
     
      const handleClick = (val: string) => () => {
        if(val === "edit")
       {  
        editPermissionStatus.value[index].edit = true}
       else if(val === 'cancel') {
        editPermissionStatus.value[index].edit = false
       }
       else if(val === 'ok') {
        const params = {userName: row.userName, permission: permission.value}
        adminChangeUserPermission(params).then(res => {
          if(res.status === 200) {
            message.success('修改用户权限成功');
            editPermissionStatus.value[index].edit = false;
            updateUserList();
          }
        })
       }
      }
      const permissionSelect = ref(null);

      return (
        <div>
          {!editPermissionStatus.value[index].edit ?
            (
              <n-space justify="space-between">
                <div style={{marginTop:'6px'}}>{name}</div>
                <n-button quaternary type="info" onClick={handleClick('edit')}>修改</n-button>
              </n-space>
            )
            :
            (
              <n-space justify="space-between">
                <n-select style={{ width: '150px' }} ref={permissionSelect} size="small" value={permission.value} modelValue={permission.value} options={options} onUpdateValue={onSelectPermission}></n-select>
                <n-button-group>
                  <n-button quaternary type="success" onClick={handleClick('ok')}>确认</n-button>
                  <n-button quaternary type="info" onClick={handleClick('cancel')}>取消</n-button>
                </n-button-group>
              </n-space>
            )
          }
        </div>
      )
    },
  },
  {
    title: '操作',
    key: 'actions',

    render(row: Object) {
      return h(
        NButton,
        {
          size: 'small',
          color: 'red',
          onClick: () => showDeleteUserModal(row),
        },
        { default: () => '删除' },
      )
    },
  },
])
const data = ref([])
const message = useMessage()
const userStore = useUserStore()
const { adminGetUser, adminDeleteUser, adminChangeUserPermission } = userStore
const showVal = ref(false);

const updateUserList = () => { 
  adminGetUser(params).then(res => {
    data.value = res.info; 
    totalPage.value = Math.ceil(res.total/10);
})
}


// const userAddedFlag = toRef(userStore.flag, 'userAddedFlag')
// const userDeletedFlag = toRef(userStore.flag, 'userDeletedFlag')
updateUserList();

let rowData = null

const showDeleteUserModal = row => {
  showVal.value = true;
  rowData = row;
}

const handleDeleteUser = () => {
  const params = { userName: rowData.userName }
  adminDeleteUser(params).then(res => {
    if (res?.data.errorCode === '0') {
      message.success('删除用户成功')
      updateUserList(); 
      showVal.value = false;
    } else {
      message.error('删除用户出错')
    }
  })
}

const cancel = () => {
  showVal.value = false
}

watch(data, () => {
  data.value.forEach(item => {
    editPermissionStatus.value.push(
      {
        name:item.userName,
        edit: false
      }
    )
  })
})

const onCreateUser = () => { 
        updateUserList(); 
      }

defineExpose({ onCreateUser })
</script>
