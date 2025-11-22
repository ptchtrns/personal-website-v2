<template>
  <div class="sidebar-layout">
    <Sidebar />

    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue';
import { RouterView } from 'vue-router';
</script>

<style scoped>
.sidebar-layout {
  display: flex;
  height: 100vh;
}

.content {
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
}
</style>