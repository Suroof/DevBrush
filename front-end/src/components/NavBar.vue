<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElButton, ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus'
import { User, Moon, Sunny, ArrowDown } from '@element-plus/icons-vue'
import { useAppStore } from '../stores/app'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const authStore = useAuthStore()

const currentRoute = computed(() => route.name)
const isLoggedIn = computed(() => authStore.isAuthenticated)
const username = computed(() => authStore.user?.username || '用户')

const navigation = [
  { name: 'home', path: '/', label: '首页' },
  { name: 'about', path: '/about', label: '关于' },
]

function handleLogout() {
  authStore.logout()
}

function goToLogin() {
  router.push('/login')
}
</script>

<template>
  <nav class="bg-white shadow-sm">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center">
          <router-link to="/" class="text-xl font-bold text-gray-800">DevDeck</router-link>
          
          <div class="hidden md:flex ml-10 space-x-4">
            <router-link
              v-for="item in navigation"
              :key="item.path"
              :to="item.path"
              class="px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="currentRoute === item.name ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'"
            >
              {{ item.label }}
            </router-link>
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <!-- 暗黑模式切换 -->
          <ElButton
            :icon="appStore.isDark ? Sunny : Moon"
            circle
            @click="appStore.toggleDarkMode"
          />
          
          <!-- 登录状态 -->
          <template v-if="isLoggedIn">
            <ElDropdown trigger="click">
              <div class="flex items-center cursor-pointer text-gray-700 hover:text-blue-600">
                <ElButton :icon="User" circle />
                <span class="ml-1 hidden sm:inline">{{ username }}</span>
                <el-icon class="ml-1"><ArrowDown /></el-icon>
              </div>
              
              <template #dropdown>
                <ElDropdownMenu>
                  <ElDropdownItem @click="router.push('/')">
                    个人中心
                  </ElDropdownItem>
                  <ElDropdownItem divided @click="handleLogout">
                    退出登录
                  </ElDropdownItem>
                </ElDropdownMenu>
              </template>
            </ElDropdown>
          </template>
          
          <template v-else>
            <div class="flex space-x-2">
              <ElButton @click="router.push('/register')">注册</ElButton>
              <ElButton type="primary" @click="goToLogin">登录</ElButton>
            </div>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>