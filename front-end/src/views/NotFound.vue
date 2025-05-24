<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useTitle } from '@vueuse/core'
import { ElButton } from 'element-plus'

useTitle('404 - Page Not Found')

const router = useRouter()
const goHome = () => router.push('/')
</script>

<template>
  <main class="page-container flex items-center justify-center min-h-[calc(100vh-4rem)]">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p class="text-xl text-gray-600 mb-8">Oops! Page not found</p>
      <ElButton type="primary" @click="goHome">Go Home</ElButton>
    </div>
  </main>
</template>