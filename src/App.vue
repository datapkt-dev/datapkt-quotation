<script setup>

</script>

<template>
  <div class="fullPage">
    <div class="page-content">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" :key="$route.path" v-if="$route.meta.keepAlive"/>
        </keep-alive>
        <component :is="Component" :key="$route.path" v-if="!$route.meta.keepAlive"/>
      </router-view>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .fullPage {
    position: relative;
    margin: 0 auto;
    width: 100%;
    background: #ffffff;
    display: flex;
    justify-content: space-between;
    .page-content {
      width: 100%;
      overflow: auto;
      background: #F6F6F6;
    }
  }
</style>

