import type { Router } from 'vue-router'
import { useAuthStore } from '../stores/auth'

/**
 * 设置路由守卫
 * @param router Vue Router实例
 */
export function setupRouterGuards(router: Router) {
  router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    const requiresAuth = to.meta.requiresAuth === true
    
    // 更新页面标题
    document.title = to.meta.title ? `${to.meta.title} - DevDeck` : 'DevDeck'
    
    // 处理需要认证的路由
    if (requiresAuth && !authStore.isAuthenticated) {
      // 保存用户尝试访问的URL，以便登录后重定向
      next({ name: 'login', query: { redirect: to.fullPath } })
      return
    }
    
    // 处理仅限管理员的路由
    if (to.meta.requiresAdmin && !authStore.isAdmin) {
      next({ name: 'not-found' })
      return
    }
    
    // 已登录用户访问登录页面时重定向到首页
    if (to.name === 'login' && authStore.isAuthenticated) {
      next({ name: 'home' })
      return
    }
    
    next()
  })
}