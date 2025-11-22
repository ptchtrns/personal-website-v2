<template>
  <div class="flex">
    <div>
      <Sidebar />
    </div>
    <div class="grow flex justify-center">
      <div class="lg:w-[600px] xl:w-[750px] 2xl:w-[900px]">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue';
import { RouterView } from 'vue-router';
</script>
