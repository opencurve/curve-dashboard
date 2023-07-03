<template>
  <div class="container">
    <div class="menu">
      <n-collapse v-for="(item, index) in data " :default-expanded-names="data[0].name">
        <n-collapse-item :title="item.name" :name="item.name">
          <n-collapse v-for="zone in item.zones" :default-expanded-names="index === 0 ? item.zones[0].name : null">
            <n-collapse-item :title="zone.name" :name="zone.name">
              <n-collapse v-for="server in zone.servers">
                <!-- <n-button size="tiny" round text-color="#165a72" quaternary @click="e => { handleCheckDetail(server) }">{{
                  server.hostname }}
                </n-button> -->
                <span :class="{ linkBtn: true, activeBtn: serverDetail.hostname === server.hostname }"
                  @click="e => { handleCheckDetail(server) }">{{ server.hostname }}</span>
              </n-collapse>
            </n-collapse-item>
          </n-collapse>
        </n-collapse-item>
      </n-collapse>
    </div>
    <div class="detail-display-panel">
      <div class="detail-container">
        <div class="header">节点详情</div>
        <div class="detailInfoContainer">
          <div class="detailItem" v-for="(item, key) in serverDetail">
            <div v-if="key !== 'chunkservers'">{{ infoMap[key] }}</div>
            <div v-if="key !== 'chunkservers'">{{ item }}</div>
          </div>
        </div>
        <n-divider />
        <div class="header">chunkserver</div>
        <div class="graph">
          <n-space vertical :size="12">
            <n-data-table :bordered="false" :single-line="false" :columns="columns" :data="tableData" />
          </n-space>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="tsx" setup>
import { useTopoStore } from '@/store/clusterManagement/topo'
import { ref, onMounted } from "vue"
import { NCollapse, NCollapseItem, NButton, NCard, NDataTable, NDivider, NSpace, type DrawerPlacement } from "naive-ui"

const topoStore = useTopoStore()
const { getTopoList } = topoStore;
const serverDetail = ref(null);
const tableData = ref([]);


//根据点击的服务器名称显示详情
const handleCheckDetail = (targetServer) => {
  let orderedData = {
    id: targetServer['id'],
    hostname: targetServer['hostname'],
    internalIp: targetServer['internalIp'],
    // internalPort: targetServer['internalPort'],
    externalIp: targetServer['externalIp'],
    chunkservers: targetServer['chunkservers']
    // externalPort: targetServer['externalPort'],
  }
  serverDetail.value = orderedData;

  tableData.value = serverDetail.value.chunkservers;
}

//server细节的信息对应表
const infoMap: { [key: string]: string } = {
  id: "ID",
  internalPort: "管理端口",
  internalIp: "管理 ip",
  externalIp: "业务 ip",
  hostname: "节点名称",
  externalPort: "业务端口",
}
//定义各级数据
let data: Array<Object> = ref([]);

getTopoList().then(res => {
  data.value = res.data.data;
  handleCheckDetail(res.data.data[0].zones[0].servers[0]);
})

const columns = ref([
  {
    title: 'ID',
    width: 'auto',
    key: 'id',
   
  },
  // {
  //   title: 'IP',
  //   width: 'auto',
  //   key: 'hostIp'
  // },
  {
    title: '业务IP',
    width: 'auto',
    key: 'externalIp',
   
  },
  {
    title: '监听端口',
    width: 'auto',
    key: 'port',
   
  },
  // {
  //   title: '读写状态',
  //   width: 'auto',
  //   key: 'status'
  // },
  // {
  //   title: '磁盘状态',
  //   width: 'auto',
  //   key: 'diskStatus'
  // },
  {
    title: '在线状态',
    width: 'auto',
    key: 'onlineStatus',
   
  },
  // {
  //   title: '挂载点',
  //   width: 'auto',
  //   key: 'mountPoint'
  // },
  // {
  //   title: '磁盘容量（单位GiB）',
  //   width: 'auto',
  //   key: 'diskCapacity'
  // },
  // {
  //   title: '磁盘使用量（单位Gib）',
  //   width: 'auto',
  //   key: 'diskUsed'
  // },
  {
    title: '使用量/容量(GiB)',
    width: 'auto',
   
    render(row) {
      return (
        <span>{row.diskUsed}/{row.diskCapacity}</span>
      )
    }
  },
])
</script>

<style scoped lang="scss">
.container {
  display: flex;
}

.menu {
  // border: solid 1px;
  // width: 35%;
  width: 180px;
  padding: 24px;
  background-color: white;
  margin-right: 16px;
  border-radius: 2px;
}

.linkBtn {
  display: inline-block;
  padding-left: 22px;
  cursor: pointer;

  &:hover {
    color: #3366ff;
    text-decoration: underline;
  }
  &.activeBtn{
    color: #3366ff;
  }
}

.n-collapse-item--active {
  margin-bottom: 8px;
}

// --n-title-font-size
// .n-collapse-item__content-inner {
//   background-color: red;
// }

.detail-display-panel {
  flex: 1;
  border-radius: 2px;

  // border: solid 1px;
  /* 设置右侧元素的Flex值为1，使其占据剩余空间 */
}

.detail-container {
  padding: 24px;
  background-color: white;
}

.header {
  font-weight: 700;
  font-size: 16px;
  color: rgba(0, 0, 0, .85);
  margin-bottom: 20px;
}

.detailInfoContainer {
  display: grid;
  grid-template-columns: repeat(3, auto 1fr);
  row-gap: 20px;

  &>span {
    display: inline-block;
  }

  &>span:nth-child(even) {
    // background-color: red;
    padding-left: 16px;
    padding-right: 38px;
  }

  &>span:nth-child(odd) {
    text-align: right;
  }
}

.detailInfoContainer {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding-left: 16px;
  // grid-gap: 16px;
  column-gap: 16px;
  row-gap: 16px;

  .detailItem>div {
    color: rgb(29, 39, 59);
  }

  .detailItem>div:first-child {
    margin-bottom: 4px;
    font-weight: 500;
    color: #616876;
  }
}
</style>