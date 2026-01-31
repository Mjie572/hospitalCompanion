<template>

  <RouterView />
</template>

<script setup>
import { RouterView } from 'vue-router';


</script>



<style scoped lang="less">
/* 全局样式（可放在 App.vue 或单独的全局样式文件中） */
html,
body,
#app {
  height: 100%;
  margin: 0;
  /* 清除默认边距 */
}
</style>
