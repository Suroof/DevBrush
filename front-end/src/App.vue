<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <NavBar />
    <Suspense>
      <RouterView />
      <template #fallback>
        <div class="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
        </div>
      </template>
    </Suspense>
  </div>
</template>
