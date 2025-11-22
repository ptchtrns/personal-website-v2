<template>
  <MainDisplay>
    <div>
      <h1 class="text-3xl font-bold">
        Nikolai Zakharov
      </h1>
      <p>
        Software Development student with solid experience in different programming languages and frameworks,
        gained through practical work on various projects.
      </p>
    </div>
    <div>
      <h2 class="text-2xl font-bold">
        Work experience
      </h2>
      <div>
        <div class="flex flex-col gap-1">
          <a href="https://www.peikko.com/" target="_blank" rel="noopener noreferrer" class="text-blue-800 text-lg underline">Peikko Group</a>
          <h3 class="text-lg font-semibold">UI Development Trainee - Internship</h3>
          <span class="text-stone-700">October 2024 - May 2025</span>
          <span>
            Contributed to a software development project focusing on UI implementation,
            ensuring accurate integration of UI development parts into designer tool code.
            Gained practical experience utilizing key technologies, including Microsoft Razor
            for UI development and the Three.js component library for 3D component integration.
          </span>
        </div>
      </div>
    </div>
    <div>
      <h2 class="text-2xl font-bold">
        Projects
      </h2>
      <div class="grid grid-cols-2">
        <a href="https://www.simpictures.com/" target="_blank" rel="noopener noreferrer" class="flex flex-col gap-2">
          <img src="/simpictures_screenshot.png" alt="SimPictures Screenshot" class="rounded-lg" />
          <h3 class="text-xl font-bold">SimPictures</h3>
          <p>
            Website for sharing flight simulator screenshots & a social media platform - The perfect place for your screenshots 📸.
            User-friendly and neat UI, actively maintained website, tens of active users and moderators.
          </p>
        </a>
      </div>
    </div>
  </MainDisplay>
</template>

<script setup>
import MainDisplay from '@/components/MainDisplay.vue';
</script>