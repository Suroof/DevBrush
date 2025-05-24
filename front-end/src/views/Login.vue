<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTitle } from '@vueuse/core'
import { ElForm, ElFormItem, ElInput, ElButton, ElAlert } from 'element-plus'
import { Lock, User, Monitor } from '@element-plus/icons-vue'
import { useAuthStore } from '../stores/auth'

useTitle('登录 - DevDeck')

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

// 表单数据
const loginForm = reactive({
  username: '',
  password: ''
})

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度应为3-20个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度应为6-20个字符', trigger: 'blur' }
  ]
}

const formRef = ref<InstanceType<typeof ElForm> | null>(null)
const isSubmitting = ref(false)

// 登录处理函数
async function handleLogin() {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    
    isSubmitting.value = true
    
    try {
      await authStore.login(loginForm)
      
      // 登录成功后，如果有重定向参数，则跳转到该页面
      const redirectPath = route.query.redirect as string
      if (redirectPath) {
        router.push(redirectPath)
      }
    } finally {
      isSubmitting.value = false
    }
  })
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8 transition-all duration-300 relative overflow-hidden">
    <!-- 装饰元素 -->
    <div class="absolute top-10 left-10 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
    <div class="absolute top-0 right-0 w-32 h-32 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
    <div class="absolute -bottom-8 left-20 w-32 h-32 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
    
    <div class="max-w-md w-full space-y-8 relative z-10">
      <div class="text-center">
        <div class="flex justify-center mb-4">
          <div class="p-3 bg-white rounded-full shadow-md inline-flex items-center justify-center">
            <Monitor class="h-10 w-10 text-indigo-600" />
          </div>
        </div>
        <h2 class="mt-2 text-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
          DevDeck
        </h2>
        <h3 class="mt-1 text-center text-xl font-bold text-gray-700">
          登录到您的账户
        </h3>
        <p class="mt-2 text-center text-sm text-gray-600">
          或
          <router-link to="/register" class="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
            创建新账户
          </router-link>
          |
          <router-link to="/" class="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
            返回首页
          </router-link>
        </p>
      </div>
      
      <ElAlert
        v-if="authStore.error"
        type="error"
        :title="authStore.error"
        show-icon
        class="mb-4 rounded-md"
      />
      
      <ElForm
        ref="formRef"
        :model="loginForm"
        :rules="rules"
        class="mt-8 space-y-6 bg-white p-8 rounded-xl shadow-lg backdrop-blur-sm bg-opacity-80 border border-gray-100 transition-all duration-300 hover:shadow-xl"
      >
        <ElFormItem prop="username" class="mb-6">
          <ElInput
            v-model="loginForm.username"
            :prefix-icon="User"
            placeholder="用户名"
            autocomplete="username"
            class="rounded-lg"
          />
        </ElFormItem>
        
        <ElFormItem prop="password" class="mb-6">
          <ElInput
            v-model="loginForm.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="密码"
            autocomplete="current-password"
            show-password
            class="rounded-lg"
          />
        </ElFormItem>
        
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            >
            <label for="remember-me" class="ml-2 block text-sm text-gray-700">
              记住我
            </label>
          </div>
          
          <div class="text-sm">
            <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
              忘记密码？
            </a>
          </div>
        </div>
        
        <div>
          <ElButton
            type="primary"
            class="w-full py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
            :loading="isSubmitting"
            @click="handleLogin"
          >
            登录
          </ElButton>
        </div>
      </ElForm>
    </div>
  </div>
</template>

<style scoped>
.animate-blob {
  animation: blob-bounce 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

@keyframes blob-bounce {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}
</style>