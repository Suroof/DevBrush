import { ElMessage } from 'element-plus'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

interface RequestOptions extends RequestInit {
  skipAuth?: boolean
}

/**
 * 封装的HTTP请求函数，自动处理认证令牌和错误
 */
export async function http<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  const headers = new Headers(options.headers || {})
  
  // 设置默认的Content-Type
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  
  // 添加认证令牌（除非明确跳过）
  if (!options.skipAuth) {
    const token = localStorage.getItem('token')
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
  }
  
  const config = {
    ...options,
    headers
  }
  
  try {
    const response = await fetch(url, config)
    
    // 处理未授权错误（401）
    if (response.status === 401) {
      localStorage.removeItem('token')
      ElMessage.error('会话已过期，请重新登录')
      window.location.href = '/login'
      throw new Error('未授权')
    }
    
    // 处理其他HTTP错误
    if (!response.ok) {
      let errorMessage = '请求失败'
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorMessage
      } catch (e) {
        // 如果无法解析JSON，使用默认错误消息
      }
      
      ElMessage.error(errorMessage)
      throw new Error(errorMessage)
    }
    
    // 检查响应内容类型
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return await response.json()
    } else {
      return await response.text() as unknown as T
    }
  } catch (error: any) {
    // 网络错误或其他未处理的错误
    const message = error.message || '网络请求失败'
    if (!message.includes('未授权')) { // 避免重复显示错误消息
      ElMessage.error(message)
    }
    throw error
  }
}

// 便捷的HTTP方法
export const httpClient = {
  get: <T>(endpoint: string, options?: RequestOptions) => 
    http<T>(endpoint, { ...options, method: 'GET' }),
  
  post: <T>(endpoint: string, data?: any, options?: RequestOptions) => 
    http<T>(endpoint, { 
      ...options, 
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    }),
  
  put: <T>(endpoint: string, data?: any, options?: RequestOptions) => 
    http<T>(endpoint, { 
      ...options, 
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    }),
  
  delete: <T>(endpoint: string, options?: RequestOptions) => 
    http<T>(endpoint, { ...options, method: 'DELETE' }),
}