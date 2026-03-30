<template>
  <MainDisplay>
    <div class="flex flex-col gap-8">
      <section class="flex flex-col gap-3">
        <h1 class="text-4xl font-bold dark:text-stone-100">
          Media
        </h1>
        <p class="text-lg leading-relaxed text-stone-700 dark:text-stone-300">
          Welcome to the repository of my photos and music.
        </p>
      </section>
      <Tabs default-value="photos">
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
            <Card v-for="photo in data" :key="photo._id">
              <CardContent class="pt-6">
                <img :src="photo.image.original" class="w-full" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="audio">
          Audio
        </TabsContent>
      </Tabs>
    </div>
  </MainDisplay>
</template>

<script setup>
import MainDisplay from '@/components/layout/MainDisplay.vue';
import { useQuery } from '@tanstack/vue-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

const { data, isLoading, error } = useQuery({
  queryKey: ["photos"],
  queryFn: () => fetch('api/photos', { credentials: 'include' }).then(res => res.json()),
})
</script>
