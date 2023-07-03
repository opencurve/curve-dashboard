<template>
    <n-modal v-model:show="val" preset="dialog" title="扩容">
        <n-form :rules="rules" :model="formData">
            <n-form-item label="卷名称">
                <n-input v-model:value="formData.volumeName" placeholder="请输入卷名称..." disabled></n-input>
            </n-form-item>
            <n-form-item path="length">
                <template #label>
                    <span>
                        扩容后卷长度（当前长度：{{ currentLengthInModal }}）
                    </span>
                </template>
                <n-input v-model:value="formData.length" placeholder="请输入扩容后的卷长度..."></n-input>
            </n-form-item>
        </n-form>
        <template #action>
            <div>
                <n-button @Click="confirmVolumeExtend" type="primary">确定</n-button>
                <n-button @Click="cancel">取消</n-button> &nbsp;&nbsp;
            </div>
        </template>
    </n-modal>
</template>

<script lang="ts" setup>
import { useBlockStore } from '@/store/blockStorageManagement/block'
import { ref, reactive } from 'vue'
import { useMessage, type FormRules, type FormItemRule, NSelect } from 'naive-ui'

const blockStore = useBlockStore();
const { expandVolume } = blockStore;
const message = useMessage();
const currentLengthInModal = ref(null);

const setVolumeToExtend = (name: string, currentLength: number) => {
    formData.volumeName = name;
    currentLengthInModal.value = currentLength
}


const formData = reactive({
    volumeName: "",
    length: null
})

const lengthValidator = () => {
    const checkIsNotNumber = isNaN(formData.length);
    if (formData.length < 10 || formData.length === 0 || formData.length > 20 * 1024) { return false }
    else if (formData.length <= currentLengthInModal.value) {
        return false
    }
    else if(checkIsNotNumber) {
        return false
    }
    else return true
}

const rules = {
    length: [
        {
            required: true,
        },
        {
            validator: lengthValidator,
            message: "请输入正确长度，长度需要在10-20*1024之间，并且大于当前容量",
            trigger: ["input", 'blur']
        }
    ]
}

const confirmVolumeExtend = () => {
    if (formData.volumeName === "" || formData.length === null || isNaN(formData.length)) {
        message.error("必要信息不能为空")
    }
    else if(!lengthValidator()) {
        message.error("请按照规则填写正确的信息")
    }
    else {
        const { volumeName, length } = formData;
        const params = { volumeName, length: +length };
        expandVolume(params).then(res => {
            if (res.status === 200) {
                message.success('扩容成功');
                cancel();
            } else {
                message.error('扩容失败');
            }
        })
    }
}

let val = ref(false)
//点击取消，关闭模态框
const cancel = () => {
    val.value = false;
    formData.volumeName = "";
    formData.length = null
}

//展示模态框，供外部调用
const showModal = () => {
    val.value = true
}

defineExpose({ showModal, setVolumeToExtend })
</script>

<style></style>

