<template>
  <main class="main">
    <div class="content">
      <router-view></router-view>
    </div>
  </main>
</template>

<style lang="scss">
.main {
  position: relative;
  background-color: #f4f7f9;
  padding: 24px;
  height: calc(100vh - var(--header-height));
  overflow: auto;
  box-sizing: border-box;

  .n-collapse
    .n-collapse-item
    .n-collapse-item__content-wrapper
    .n-collapse-item__content-inner {
    padding-top: 0px;
  }
  .content {
    height: 100%;
  }
  .n-collapse .n-collapse-item .n-collapse-item__header {
    --n-title-font-size: 16px;
  }
}
</style>
