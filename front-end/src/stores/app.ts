import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const isDark = ref(false)
  const isMenuOpen = ref(false)

  function toggleDarkMode() {
    isDark.value = !isDark.value
    document.documentElement.classList.toggle('dark')
  }

  function toggleMenu() {
    isMenuOpen.value = !isMenuOpen.value
  }

  return {
    isDark,
    isMenuOpen,
    toggleDarkMode,
    toggleMenu,
  }
})