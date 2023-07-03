<template>
    <n-modal v-model:show="val" preset="dialog" title="卷设置">
        <n-form :rules ="rules" :model="formData">
            <n-form-item label="卷名称" path="volumeName" >
                <n-input v-model:value="formData.volumeName" disabled placeholder="请输入卷名称..."></n-input>
            </n-form-item>
            <n-form-item label="限流类型" path="throttleType">
                <n-select v-model:value="formData.throttleType" :options="throttleType" placeholder="请输入用户名..."></n-select>
            </n-form-item>
            <n-form-item label="限流值">
                <n-input v-model:value="formData.limit" placeholder="请输入限流值..."></n-input>
            </n-form-item>
            <n-form-item label="激增值">
                <n-input v-model:value="formData.burst" placeholder="请输入激增值..."></n-input>
            </n-form-item>
            <n-form-item label="激增持续时间">
                <n-input v-model:value="formData.burstLength" placeholder="请输入激增持续时间..."></n-input>
            </n-form-item>
        </n-form>
        <template #action>
            <div>
                <n-button @Click="setVolumeThrottle" type="primary">确定</n-button>&nbsp;&nbsp;
                <n-button @Click="cancel">取消</n-button>
            </div>
        </template>
    </n-modal>
</template>

<script lang="ts" setup>
import { useBlockStore } from '@/store/blockStorageManagement/block'
import { ref, reactive } from 'vue';
import { useMessage, type FormRules, type FormItemRule, NSelect } from 'naive-ui'
import router from '@/router'
// import { adminGetUserApi } from '@/api/user'

const formData = reactive({
    volumeName: null,
    throttleType: "IOPS_TOTAL",
    limit: null,
    burst: null,
    burstLength: null
})

const setVolumeToThrottle= (name: string) => {
    formData.volumeName = name;
};

const userStore = useBlockStore();
const { throttleVolume } = userStore;
const message = useMessage();

const throttleType = ref([
    {
        value: "IOPS_TOTAL",
        label: "全部IOPS"
    },
    {
        value: "IOPS_READ",
        label: "读IOPS"
    },
    {
        value: "IOPS_WRITE",
        label: "写IOPS"
    },
    {
        value: "BPS_TOTAL",
        label: "全部BPS"
    },
    {
        value: "BPS_READ",
        label: "读BPS"
    },
    {
        value: "BPS_WRITE",
        label: "写BPS"
    },
])

const rules: FormRules = {
  volumeName: [
    {
      required: true,
      message: '请输入卷名',
      trigger: ['input', 'blur'],
    }
],
    throttleType: [
    {
      required: true,
      trigger: ['input', 'blur'],
    }],
}

const voluemOptions = ref([
    { label: "普通卷", value: 1 },
    { label: "克隆卷", value: 2 }
])

const formDataCheck = () => {
   if(formData.volumeName === "") {
     message.error('请输入卷名称')
     return false
   }
  else {
    return true
  }
}

const setVolumeThrottle = () => {
    const { volumeName, throttleType, limit, burst, burstLength } = formData;
    const params = {
        volumeName, throttleType, limit: +limit, burst: +burst, burstLength: +burstLength
    }

    throttleVolume(params).then(res => {
       if(!formDataCheck) {
        return
       }
       else if (res.status === 200) {
            message.success('设置卷限流成功！');
            cancel();
        } else {
            message.error('请输入正确的卷名称')
        }
    })
}

let val = ref(false)
//点击取消，关闭模态框
const cancel = () => {
    val.value = false;
    formData.volumeName = null;
    formData.throttleType =  "IOPS_TOTAL";
    formData.limit = null;
    formData.burst = null;
    formData.burstLength = null;
}

//展示模态框，供外部调用
const showModal = () => {
    val.value = true
}

defineExpose({ showModal, setVolumeToThrottle })
</script>

<style></style>

