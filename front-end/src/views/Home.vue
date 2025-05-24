<script setup lang="ts">
import { ref } from 'vue'
import { useTitle } from '@vueuse/core'
import { ElButton } from 'element-plus'

useTitle('Home - DevDeck')

const count = ref(0)
const increment = () => count.value++
</script>

<template>
  <main class="page-container">
    <div class="card">
      <h1 class="text-3xl font-bold mb-6">Welcome to DevDeck</h1>
      
      <div class="flex items-center gap-4 mb-8">
        <ElButton type="primary" @click="increment">
          Count is: {{ count }}
        </ElButton>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 3" :key="i" class="p-4 border rounded-lg hover:shadow-lg transition-shadow">
          <h2 class="text-xl font-semibold mb-2">Feature {{ i }}</h2>
          <p class="text-gray-600">This is a sample feature description that showcases the capabilities of our application.</p>
        </div>
      </div>
    </div>
  </main>
</template>