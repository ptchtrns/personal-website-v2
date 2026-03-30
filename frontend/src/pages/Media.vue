<template>
  <MainDisplay>
    <h1>Media</h1>
    <Tabs default-value="account">
      <TabsList>
        <TabsTrigger value="photos">
          Photos
        </TabsTrigger>
        <TabsTrigger value="audio">
          Audio
        </TabsTrigger>
      </TabsList>
      <TabsContent value="photos">
        <div v-if="isLoading" class="text-stone-900 dark:text-stone-100">Loading...</div>
        <div v-else-if="error" class="text-red-600">{{ error }}</div>
        <div v-else-if="!data || data.length === 0" class="text-stone-900 dark:text-stone-100">No photos found</div>
        <div v-else class="grid grid-cols-1 gap-4">
          <div v-for="photo in data" :key="photo._id" class="text-stone-900 dark:text-stone-100">
            {{ photo._id }}
            <img :src="photo.image.original" />
          </div>
        </div>
      </TabsContent>
      <TabsContent value="audio">
        Audio
      </TabsContent>
    </Tabs>
  </MainDisplay>
</template>

<script setup>
import MainDisplay from '@/components/layout/MainDisplay.vue';
import { useQuery } from '@tanstack/vue-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const { data, isLoading, error } = useQuery({
  queryKey: ["photos"],
  queryFn: () => fetch('api/photos', { credentials: 'include' }).then(res => res.json()),
})
</script>