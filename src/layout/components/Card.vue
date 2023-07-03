<template>
    <n-card title="集群" size="large">
      集群内容
    </n-card >
  </template>
<script lang="ts">
import  { defineComponent } from 'vue';
import {NCard} from "naive-ui"

 
   export default defineComponent({
    components: {
        NCard
    },
    setup() {
       return {

       }
    }
   })
 </script>
  <style scoped>
  .n-card {
    max-width: 600px;
  }
  </style>