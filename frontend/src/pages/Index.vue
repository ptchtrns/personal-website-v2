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
        <h2 class="text-2xl font-bold text-stone-900 dark:text-stone-100">
          Work Experience
        </h2>
        <Card>
          <CardHeader>
            <CardTitle>UI Development Trainee - Internship</CardTitle>
            <CardDescription>
              October 2024 – May 2025 ·
              <a href="https://www.peikko.com/" target="_blank" rel="noopener noreferrer" class="text-blue-700 dark:text-blue-400 hover:underline">
                Peikko Group <FontAwesomeIcon :icon="faArrowUpRightFromSquare" class="text-xs" />
              </a>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul class="list-disc ml-6 text-stone-700 dark:text-stone-300 leading-relaxed">
              <li>Built UI layout and components, accurately following company&apos;s design guidelines and ensuring accessibility.</li>
              <li>Used Blazor (C#) and Azure DevOps.</li>
              <li>Used Three.js library to display 3D objects.</li>
              <li>Worked in group and collaborated with students from LAB University of Applied Sciences.</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <section class="flex flex-col gap-6">
        <h2 class="text-2xl font-bold text-stone-900 dark:text-stone-100">
          Education
        </h2>
        <Card>
          <CardContent class="flex flex-row gap-6 items-center">
            <img src="/img/metropolia_logo.png" alt="Metropolia Logo" class="w-16 md:w-24 my-2" />
            <div class="flex flex-col gap-2">
              <h3 class="text-xl font-bold text-stone-900 dark:text-stone-100">Information and Communication Technology - Bachelor's degree (In Progress)</h3>
              <span class="text-stone-700 dark:text-stone-300">
                Metropolia University of Applied Sciences, 2025-2029 (Expected)
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent class="flex flex-row gap-6 items-center">
            <img src="/img/salpaus_logo.png" alt="Salpaus Logo" class="w-16 md:w-24 my-2" />
            <div class="flex flex-col gap-2">
              <h3 class="text-xl font-bold text-stone-900 dark:text-stone-100">Software Engineering - Vocational undergraduate degree</h3>
              <span class="text-stone-700 dark:text-stone-300">
                Salpaus Further Education, 2023-2025
              </span>
            </div>
          </CardContent>
        </Card>
      </section>

      <section class="flex flex-col gap-6">
        <h2 class="text-2xl font-bold text-stone-900 dark:text-stone-100">
          Projects
        </h2>
        <Card>
          <CardContent class="flex flex-row gap-6 items-start">
            <img src="/img/simpictures_logo.svg" alt="SimPictures Logo" class="w-16 lg:w-24 my-2" />
            <div class="flex flex-col gap-3">
              <h3 class="text-xl font-bold text-stone-900 dark:text-stone-100">SimPictures</h3>
              <ul class="list-disc ml-6 text-stone-700 dark:text-stone-300 leading-relaxed">
                <li>Social media platform for sharing flight simulator screenshots.</li>
                <li>Built with Next.js and PostgreSQL. ASP.NET, multiple AWS services (s3, CloudFront, App Runner, ECR, Rekognition), Vercel, Discord.Net and Appsmith are also utilized.</li>
                <li>Implemented account management, image upload and processing, custom UI design and components.</li>
                <li>To be open-sourced in 2026.</li>
              </ul>
              <a href="https://www.simpictures.com/" target="_blank" rel="noopener noreferrer" class="text-blue-700 dark:text-blue-400 hover:underline inline-block">
                Open the website <FontAwesomeIcon :icon="faArrowUpRightFromSquare" />
              </a>
            </div>
          </CardContent>
        </Card>
      </section>

    </div>
  </MainDisplay>
</template>

<script setup>
import MainDisplay from '@/components/layout/MainDisplay.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { Separator } from '@/components/ui/separator';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
</script>
