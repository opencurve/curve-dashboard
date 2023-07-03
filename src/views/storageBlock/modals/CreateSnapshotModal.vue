<template>
    <n-modal v-model:show="val" preset="dialog" title="打快照">
        <n-form :rules = "rules" :model="formData">
            <n-form-item path="volumeName" label="卷名称">
                <n-input :value="fileName" placeholder="请输入卷名称..." disabled></n-input>
            </n-form-item>
            <n-form-item path="user" label="用户名">
                <n-input v-model:value="rowInfo.owner" placeholder="请输入用户名..." disabled></n-input>
            </n-form-item>
            <n-form-item path="snapshotName" label="快照名称">
                <n-input v-model:value="formData.snapshotName" placeholder="请输入快照名称..."></n-input>
            </n-form-item>
        </n-form>
        <template #action>
            <div>
                <n-button @Click="confirmCreateSnapshot" type="primary">确定</n-button>
                <n-button @Click="cancel">取消</n-button> &nbsp;&nbsp;
            </div>
        </template>
    </n-modal>
</template>

<script lang="ts" setup>
import { useBlockStore } from '@/store/blockStorageManagement/block'
import { ref, reactive, watch } from 'vue'
import { useMessage, type FormRules, type FormItemRule } from 'naive-ui'
import router from '@/router'
import { rowDark } from 'naive-ui/es/legacy-grid/styles';

const blockStore = useBlockStore();
const {createSnapshot} = blockStore;
const message = useMessage();

let routePath = router.currentRoute.value.params.path; 
let currentPath = routePath === '' ? '/' : '/' + routePath.join('/') + '/';

const props = defineProps({
    rowInfo: Object
})

const fileName = ref("");


// const {fileName} = props.rowInfo

const formData = reactive({
  user: "",
  snapshotName: ""
})


const rules = {  
        user:
        {
            required: true,
            message: "请输入用户名",
        },
        snapshotName:
        {
            required: true,
            message: "请输入快照名称",
        }  
    
}

const confirmCreateSnapshot = () => {
  if(formData.user === "" || formData.snapshotName === "" ) {
    message.error("请正确填写信息")
  }
  else {
    const { user, snapshotName} = formData;
    const params = {volumeName: fileName.value, user, snapshotName};
    createSnapshot(params).then(res => { 
        if(res.status === 200) {
            message.success('打快照成功');
            cancel();
        } else {
            message.error('打快照失败');
        }
    })
  }
}

let val = ref(false)
//点击取消，关闭模态框
const cancel = () => {
    val.value = false;
    formData.volumeName = "";
    formData.user = "";
    formData.snapshotName = ""
}

//展示模态框，供外部调用
const showModal = () => {
    val.value = true
}

watch(()=> props.rowInfo, (newVal) => {
    fileName.value =  currentPath+newVal.fileName;
    if(newVal.owner) {
    formData.user = newVal.owner
    }
})

watch(() => router.currentRoute.value.params.path, (newVal) => { 
if(window.location.pathname.includes('volume-management')) {
 routePath = newVal; 
 currentPath = routePath === '' ? '/' : '/' + routePath.join('/') + '/';
}   
})

defineExpose({ showModal })
</script>

<style></style>

