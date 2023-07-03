<template>
  <div class="container">
    <n-card>
      <div class="header-bar">
       <div class="header-select">
        <n-select style="width: 70" v-model:value="alertNameValue" placeholder="请选择告警名称" :options="alertNameOptions" />
          <n-select style="width: 70" v-model:value="alertLevelValue" placeholder="请选择告警等级" :options="alertTypeOptions" />
       </div>
       <div class="header-blank">
       </div>
        <div class="header-search">
          <n-input placeholder="搜索消息..." v-model:value="searchValue" @keyup.enter="searchMsg" clearable>
            <template #suffix>
              <n-icon :component="Search" />
            </template>
          </n-input>
        </div>
      </div>
      <div class="data-form">
        <n-data-table :columns="columns" :data="data" :bordered="false" />
        <n-space justify="end">
          <n-pagination  :page-count="totalPage" :onUpdatePage="updatePage" :page-slot="5"/>
        </n-space>
      </div>
    </n-card>
  </div>
</template>

<script lang="tsx" setup>
import { onMounted, reactive } from 'vue'
import { Search } from '@vicons/ionicons5'
import { NDataTable, NInput, NIcon, NCard, NPagination, NSpace, useMessage, NSelect } from 'naive-ui'
import { useAlertStore } from '@/store/alertPage/alertMessage';
import eventBus from '@/store/eventBus'
import { ref, watch } from 'vue'

const alertStore = useAlertStore()
const { getAlertMessage, getAlertReadIdUpdate } = alertStore;

const totalPage = ref(1);

const updatePage = (page) => { 
  params.page = page;
  updatePageList();
}

const data = ref([]);

const alertNameValue = ref('');
const alertLevelValue = ref('');

const searchValue = ref("");
const message = useMessage();
const params = reactive({start:0, end: 0, page: 1, size: 10, name:"", level:"", content:""});

const searchMsg = () => {
  params.content = searchValue.value;
  updatePageList()
}

const columns = ref([
{
    title: '时间',
    width: 'auto',
    key: 'time',
   
  },
  {
    title: '名称',
    width: 'auto',
    key: 'name',
   
  },
  {
    title: '等级',
    width: 'auto',
    key: 'level',
   
  },
  {
    title: '告警间隔(秒)',
    width: 'auto',
    key: 'duration',
   
  },
  {
    title: '告警内容',
    width: 'auto',
    key: 'summary',
   
  },
])

const alertNameOptions = ref([
{
  label:'所有名称',
  value:''
},
{label: "cluster",
value: 'cluster'
},
{label: "space",
value: 'space'
},
{label: "etcd",
value: 'etcd'
},
{label: "mds",
value: 'mds'
},
{label: "chunkserver",
value: 'chunkserver'
},
{label: "snapshotcloneserver",
value: 'snapshotcloneserver'
},
])

const alertTypeOptions = ref([
{
  label:'所有等级',
  value:''
},
  {label:'critical', value:'critical'},
  {label:'warning', value:'warning'}
])

const updatePageList = () => {
  getAlertMessage(params).then(res => {
    data.value = res.data.data.info || []; 
    totalPage.value = Math.ceil(res.data.data.total/10);
    if(data.value.length !== 0) { 
    getAlertReadIdUpdate({id: data.value[0].id}).then(res => {
      if(res.status === 200) {
        eventBus.message = "alertReadUpdated"
      }
      if(res.status !== 200) {
        message.error('传回已读信息失败')
      }
    })
  }
  })
}

onMounted(() => { 
  updatePageList();
})

watch(alertNameValue, (newVal) => {
  params.name = newVal;
  updatePageList()
})
watch(alertLevelValue, (newVal) => {
  params.level = newVal;
  updatePageList()
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
   flex:2
  }
  .header-select :first-child {
    margin-right: 16px;
  }
  .header-blank {
    // flex-direction: row-reverse;

    display: flex;
    flex: 3
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

      &>.n-select {
        width: 125px;
      }
    }
  }
}
</style>

