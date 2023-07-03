<template>
    <n-data-table :bordered="false" :single-line="false" single-column :columns="columns" :data="data"
        :pagination="pagination" />
</template>

<script lang="ts" setup>
import { h, ref, reactive } from 'vue'
import { NButton, useMessage } from 'naive-ui'
import { useUserStore } from '@/store/user'

const columns = ref([
    {
        title: '消息内容',
        key: 'message',
        
    },
    {
        title: '发送时间',
        key: 'time',
        
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
                    onClick: () => deleteMessage(row),
                },
                { default: () => '删除' },
            )
        },
    },
])

const data = ref([
    { id: 1, message: 'message1', time: '2023/02/14' },
    { id: 2, message: 'message2', time: '2023/02/15' },
    { id: 3, message: 'message3', time: '2023/02/16' }
])

const userStore = useUserStore()
const { adminGetUser, adminDeleteUser } = userStore

// adminGetUser().then(res => {
//     data.value = res
// })

const deleteMessage = row => {

}
// const deleteUser = row => {
//     const params = { userName: row.userName }
//     adminDeleteUser(params).then(res => {
//         if (res?.data.errorCode === '0') {
//             message.success('删除用户成功')
//         } else {
//             message.error('删除用户出错')
//         }
//     })
// }

const message = useMessage()

const pagination = reactive({ pageSize: 10 })

</script>