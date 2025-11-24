<template>
  <MainDisplay>
    <div class="flex flex-col gap-8">

      <section class="flex flex-col gap-3">
        <h1 class="text-4xl font-bold">
          Nikolai Zakharov
        </h1>
        <p class="text-lg leading-relaxed text-stone-700">
          Software Development student with solid experience in different programming languages and frameworks, gained through practical work on various projects.
        </p>
      </section>

      <section class="flex flex-col gap-6">
        <h2 class="text-2xl font-bold border-b border-stone-300 pb-1">
          Work Experience
        </h2>

        <article class="flex flex-col gap-2">
          <h3 class="text-xl font-bold text-stone-900">UI Development Trainee - Internship</h3>
          
          <div class="flex justify-between items-center text-sm text-stone-700">
            <a href="https://www.peikko.com/" target="_blank" rel="noopener noreferrer" class="text-blue-700 hover:underline font-medium">Peikko Group</a>
            <span class="font-medium text-stone-500">October 2024 – May 2025</span>
          </div>
          
          <ul class="list-disc ml-6 text-stone-700 leading-relaxed">
            <li>Contributed to a software development project focusing on frontend, accurately implementing UI.</li>
            <li>Gained practical experience utilizing technologies, including Azure DevOps and Blazor for UI development.</li>
            <li>Implemented the Three.js component library for displaying 3D objects, improving visualization capabilities.</li>
          </ul>
        </article>
      </section>

      <section class="flex flex-col gap-6">
        <h2 class="text-2xl font-bold border-b border-stone-300 pb-1">
          Education
        </h2>
        
        <article class="flex flex-col gap-2">
          <h3 class="text-xl font-bold text-stone-900">Information and Communication Technology - Bachelor's degree</h3>   
          <span class="text-stone-700">
            Metropolia University of Applied Sciences, 2025-now
          </span>
        </article>

        <article class="flex flex-col gap-2">
          <h3 class="text-xl font-bold text-stone-900">Software Engineering - Vocational undergraduate degree</h3>   
          <span class="text-stone-700">
            Salpaus Further Education, 2023-2025
          </span>
        </article>
      </section>

      <section class="flex flex-col gap-6">
        <h2 class="text-2xl font-bold border-b border-stone-300 pb-1">
          Projects
        </h2>
        <div class="grid grid-cols-2 gap-8">
          <article>
            <a href="https://www.simpictures.com/" target="_blank" rel="noopener noreferrer" class="flex flex-col gap-3">
              <img src="/simpictures_screenshot.png" alt="SimPictures Screenshot" class="rounded-lg shadow-md w-full" />
              
              <h3 class="text-xl font-bold text-stone-900">SimPictures</h3>
              
               <p class="text-stone-700">
                Website for sharing flight simulator screenshots & a social media platform, &laquo;The perfect place for your screenshots&raquo;.
                User-friendly and neat UI, actively maintained website, tens of active users and moderators.
              </p> 
            </a>
          </article>
        </div>
      </section>

    </div>
  </MainDisplay>
</template>

<script setup>
import MainDisplay from '@/components/MainDisplay.vue';
</script>