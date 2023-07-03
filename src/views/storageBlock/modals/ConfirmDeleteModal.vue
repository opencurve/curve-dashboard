<template>
    <n-modal v-model:show="visible" preset="dialog" title="删除" content="确认吗?"
        positive-text="确认" negative-text="取消" @positive-click="submitCallback" @negative-click="cancelCallback">
        <div v-if="!rowInfo.inRecycleBin && rowInfo.fileName">你确定要删除'{{ rowInfo.fileName }}'吗？删除后它将被放入回收站</div>
        <div v-if="rowInfo.isSnapshot">你确定要删除'{{rowInfo.name }}'吗？此操作无法恢复</div>
        <div v-if="rowInfo.inRecycleBin">你确定要删除'{{  rowInfo.fileName }}'吗？此操作将彻底删除该卷</div>
    </n-modal>
</template>
  
<script lang="ts" setup>
import { ref } from 'vue'
// import { useMessage } from 'naive-ui'
const visible = ref(false);
const emit = defineEmits(['confirm-delete', 'confirm-delete-from-bin']);

const props = defineProps({
    rowInfo: Object
})

const cancelCallback = () => {
    visible.value = false;
};
const submitCallback = () => {
    // if(props.rowInfo.inRecycleBin) {
    //   emit('confirm-delete-from-bin', props.rowInfo);
    // }
    emit('confirm-delete', props.rowInfo);
}

const showModal = () => {
    visible.value = true;
}

defineExpose({ showModal })

</script>