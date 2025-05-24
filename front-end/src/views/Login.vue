<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTitle } from '@vueuse/core'
import { ElForm, ElFormItem, ElInput, ElButton, ElAlert } from 'element-plus'
import { Lock, User } from '@element-plus/icons-vue'
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
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          登录到您的账户
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          或
          <router-link to="/" class="font-medium text-blue-600 hover:text-blue-500">
            返回首页
          </router-link>
        </p>
      </div>
      
      <ElAlert
        v-if="authStore.error"
        type="error"
        :title="authStore.error"
        show-icon
        class="mb-4"
      />
      
      <ElForm
        ref="formRef"
        :model="loginForm"
        :rules="rules"
        class="mt-8 space-y-6 bg-white p-8 rounded-lg shadow"
      >
        <ElFormItem prop="username">
          <ElInput
            v-model="loginForm.username"
            :prefix-icon="User"
            placeholder="用户名"
            autocomplete="username"
          />
        </ElFormItem>
        
        <ElFormItem prop="password">
          <ElInput
            v-model="loginForm.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="密码"
            autocomplete="current-password"
            show-password
          />
        </ElFormItem>
        
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            >
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              记住我
            </label>
          </div>
          
          <div class="text-sm">
            <a href="#" class="font-medium text-blue-600 hover:text-blue-500">
              忘记密码？
            </a>
          </div>
        </div>
        
        <div>
          <ElButton
            type="primary"
            class="w-full"
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