<template>
  <div class="flex mx-auto 2xl:max-w-[1600px]">
    <Sidebar />
    <div class="ml-90 xl:ml-112 mr-12">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue';
import { RouterView } from 'vue-router';
</script>
