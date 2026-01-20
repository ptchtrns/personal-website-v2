<template>
  <MainDisplay>
    <div class="flex flex-col gap-8">

      <section class="flex flex-col gap-3">
        <h1 class="text-4xl font-bold dark:text-stone-100">
          Nikolai Zakharov
        </h1>
        <p class="text-lg leading-relaxed text-stone-700 dark:text-stone-300">
          &#x1F1EB;&#x1F1EE; Espoo, Finland
        </p>
        <p class="text-lg leading-relaxed text-stone-700 dark:text-stone-300">
          Software Development student with solid experience in different programming languages and frameworks, gained through practical work on various projects.
        </p>
      </section>

      <section class="flex flex-col gap-6">
        <h2 class="text-2xl font-bold border-b border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 pb-1">
          Work Experience
        </h2>

        <article class="flex flex-col gap-2">
          <h3 class="text-xl font-bold text-stone-900 dark:text-stone-100">UI Development Trainee - Internship</h3>
          <span class="text-sm text-stone-700 dark:text-stone-400 font-medium">October 2024 – May 2025</span>
          <span>
            <a href="https://www.peikko.com/" target="_blank" rel="noopener noreferrer" class="text-sm text-blue-700 dark:text-blue-400 hover:underline font-medium inline-block">
              Peikko Group <FontAwesomeIcon :icon="faArrowUpRightFromSquare" />
            </a>
          </span>
          
          <ul class="list-disc ml-6 text-stone-700 dark:text-stone-300 leading-relaxed">
            <li>Built UI layout and components, accurately following company&apos;s design guidelines and ensuring accessibility.</li>
            <li>Used Blazor (C#) and Azure DevOps.</li>
            <li>Used Three.js library to display 3D objects.</li>
            <li>Worked in group and collaborated with students from LAB University of Applied Sciences.</li>
          </ul>
        </article>
      </section>

      <section class="flex flex-col gap-6">
        <h2 class="text-2xl font-bold border-b border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 pb-1">
          Education
        </h2>
        
        <article class="flex flex-row gap-6 items-center">
          <img src="/img/metropolia_logo.png" alt="Metropolia Logo" class="w-16 md:w-24 my-2" />
          <div class="flex flex-col gap-2">
            <h3 class="text-xl font-bold text-stone-900 dark:text-stone-100">Information and Communication Technology - Bachelor's degree (In Progress)</h3>   
            <span class="text-stone-700 dark:text-stone-300">
              Metropolia University of Applied Sciences, 2025-2029 (Expected)
            </span>
          </div>
        </article>

        <article class="flex flex-row gap-6 items-center">
          <img src="/img/salpaus_logo.png" alt="Salpaus Logo" class="w-16 md:w-24 my-2" />
          <div class="flex flex-col gap-2">
            <h3 class="text-xl font-bold text-stone-900 dark:text-stone-100">Software Engineering - Vocational undergraduate degree</h3>   
            <span class="text-stone-700 dark:text-stone-300">
              Salpaus Further Education, 2023-2025
            </span>
          </div>
        </article>
      </section>

      <section class="flex flex-col gap-6">
        <h2 class="text-2xl font-bold border-b border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 pb-1">
          Projects
        </h2>
        <div class="flex flex-col gap-6">
          <article class="flex flex-row gap-6 items-start">
            <img src="/img/simpictures_logo.svg" alt="SimPictures Logo" class="w-16 lg:w-24 my-2" />
            <div class="flex flex-col gap-3">
              <h3 class="text-xl font-bold text-stone-900 dark:text-stone-100">SimPictures</h3>
              
              <ul class="list-disc ml-6 text-stone-700 dark:text-stone-300 leading-relaxed">
                <li>Social media platform for sharing flight simulator screenshots.</li>
                <li>Built with Next.js and PostgreSQL. ASP.NET, multiple AWS services (s3, CloudFront, App Runner, ECR, Rekognition), Vercel, Discord.Net and Appsmith are also utilized.</li>
                <li>Implemented account management, image upload and processing, custom UI design and components.</li>
                <li>To be open-sourced in 2026.</li>
              </ul>
              <span>
                <a href="https://www.simpictures.com/" target="_blank" rel="noopener noreferrer" class="text-blue-700 dark:text-blue-400 hover:underline inline-block">
                  Open the website <FontAwesomeIcon :icon="faArrowUpRightFromSquare" />
                </a>
              </span>
            </div>
          </article>
        </div>
      </section>

    </div>
  </MainDisplay>
</template>

<script setup>
import MainDisplay from '@/components/layout/MainDisplay.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
</script>