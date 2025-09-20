<script setup lang="ts">
import TopNav from "@/pages/Home/components/TopNav.vue";
</script>

<template>
  <div class="min-h-screen w-full bg-gray-50">
    <TopNav />
    <main class="w-full">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
/* 移除可能冲突的样式 */
</style>
