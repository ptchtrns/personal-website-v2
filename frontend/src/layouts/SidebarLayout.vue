<template>
  <div class="flex mx-auto 2xl:max-w-[1600px]">
    <Sidebar />
    <div class="ml-6 md:ml-86 xl:ml-106 mr-6 md:mr-24">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue';
import { RouterView } from 'vue-router';
</script>
