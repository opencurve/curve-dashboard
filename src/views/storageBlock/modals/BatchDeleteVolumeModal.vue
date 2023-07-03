<template>
    <n-modal v-model:show="visible" preset="dialog" title="删除" content="确认吗?"
        positive-text="确认" negative-text="取消" @positive-click="submitCallback" @negative-click="cancelCallback">
        <div>
            {{currentLocation.includes('RecycleBin') ? '确定要彻底删除这些卷么？' : '你确定要删除这些卷吗？删除后它将被放入回收站'}}
        </div>
    </n-modal>
</template>
  
<script lang="ts" setup>
import { ref, watch } from 'vue';
import router from "@/router"

let currentLocation = window.location.pathname;
// import { useMessage } from 'naive-ui'
const visible = ref(false);
const emit = defineEmits(['confirm-batch-delete']);

const cancelCallback = () => {
    visible.value = false;
};
const submitCallback = () => {
    emit('confirm-batch-delete');
}

const showModal = () => {
    visible.value = true;
}

watch(() => router.currentRoute.value.path, () => { 
    currentLocation = window.location.pathname
})

defineExpose({ showModal })

</script>