<script setup lang="ts">
import { useTitle } from '@vueuse/core'

useTitle('About - DevDeck')
</script>

<template>
  <main class="page-container">
    <div class="card">
      <h1 class="text-3xl font-bold mb-6">About DevDeck</h1>
      
      <div class="prose prose-lg max-w-none">
        <p class="mb-4">
          DevDeck is a modern web application built with Vue 3, TypeScript, and the latest frontend technologies.
          It demonstrates best practices in code organization, performance optimization, and user experience.
        </p>

        <h2 class="text-2xl font-semibold mt-8 mb-4">Tech Stack</h2>
        <ul class="list-disc pl-6 space-y-2">
          <li>Vue 3 with Composition API</li>
          <li>TypeScript for type safety</li>
          <li>Tailwind CSS for styling</li>
          <li>Element Plus for UI components</li>
          <li>VueUse for composition utilities</li>
          <li>Vite for fast development</li>
        </ul>
      </div>
    </div>
  </main>
</template>