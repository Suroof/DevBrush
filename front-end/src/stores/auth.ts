import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { httpClient } from '../utils/http'

interface User {
  id: number
  username: string
  email: string
  roles: string[]
}

interface LoginCredentials {
  username: string
  password: string
}

interface RegisterData {
  username: string
  email: string
  password: string
  code:string
}

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.roles.includes('ADMIN') ?? false)

  async function login(credentials: LoginCredentials) {
    loading.value = true
    error.value = null
    
    try {
      const data = await httpClient.post('/user/login', credentials)
      token.value = data.token
      user.value = data.user
      
      // 保存令牌到本地存储
      localStorage.setItem('token', data.token)
      
      ElMessage.success('登录成功')
      router.push('/')
    } catch (err: any) {
      error.value = err.message || '登录过程中发生错误'
      ElMessage.error(error.value)
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    router.push('/login')
    ElMessage.success('已退出登录')
  }

  async function fetchUserInfo() {
    if (!token.value) return
    
    loading.value = true
    
    try {
      const userData = await httpClient.get('/user/info')
      user.value = userData
    } catch (err: any) {
      error.value = err.message
      // 如果获取用户信息失败，可能是令牌过期，清除登录状态
      token.value = null
      user.value = null
      localStorage.removeItem('token')
    } finally {
      loading.value = false
    }
  }

  // 注册新用户
  async function register(registerData: RegisterData) {
    loading.value = true
    error.value = null
    
    try {
      await httpClient.post('/user/register', registerData)
      ElMessage.success('注册成功，请登录')
      return true
    } catch (err: any) {
      error.value = err.message || '注册过程中发生错误'
      ElMessage.error(error.value)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 初始化时如果有令牌，尝试获取用户信息
  if (token.value) {
    fetchUserInfo()
  }

  return {
    token,
    user,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    register,
    fetchUserInfo
  }
})