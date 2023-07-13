<template>
  <div>
    <Header class="header" />
    <div class="container">
      <Main class="main" />
      <Nav v-if="notUserCheck()" class="nav" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { notUserCheck } from '../utils/functions'
import Header from './components/Header.vue'
import Main from './components/Main.vue'
import Nav from './components/Nav.vue'
</script>
<style scoped lang="postcss">
.header {
  height: var(--header-height);
  border-bottom: 1px solid rgb(229, 229, 229);
  box-shadow: 0 6px 16px rgb(0 0 0 / 5%);
}

.container {
  display: flex;
  flex-direction: row;
  min-height: calc(100vh - var(--header-height));
}

.main {
  flex: 1 1 auto;
}

.nav {
  flex-shrink: 0;
  order: -1;
}
</style>
