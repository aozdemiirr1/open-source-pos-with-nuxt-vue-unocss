import { ref } from 'vue'

const isAuthenticated = ref(false)

export const useAuth = () => {
  const checkAuth = () => {
    if (process.client) {
      isAuthenticated.value = localStorage.getItem('isAuthenticated') === 'true'
    }
    return isAuthenticated.value
  }

  const login = (email, password) => {
    if (email === 'aozdemiirr05@gmail.com' && password === '123456') {
      if (process.client) {
        localStorage.setItem('isAuthenticated', 'true')
      }
      isAuthenticated.value = true
      return true
    }
    return false
  }

  const logout = () => {
    if (process.client) {
      localStorage.removeItem('isAuthenticated')
    }
    isAuthenticated.value = false
  }

  return {
    isAuthenticated,
    checkAuth,
    login,
    logout
  }
} 