<script setup lang="ts">
import TopNav from "@/pages/Home/components/TopNav.vue";
</script>

<template>
  <div class="min-h-screen w-full bg-gray-50">
    <TopNav />
    <main class="w-full pt-16">
      <router-view />
    </main>
  </div>
</template>

<style scoped></style>
