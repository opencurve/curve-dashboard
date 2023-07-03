import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useClusterSelectorStore = defineStore('clusterSelector', () => {
  const currentCluster = ref('')

  const pickCluster = (cluster: string) => {
    currentCluster.value = cluster
  }
  return {
    currentCluster,
    pickCluster,
  }
})
