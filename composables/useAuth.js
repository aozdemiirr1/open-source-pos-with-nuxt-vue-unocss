import { ref } from 'vue'

const isAuthenticated = ref(false)
const users = ref([
  {
    email: 'aozdemiirr05@gmail.com',
    password: '123456',
    role: 'Admin',
    lastLogin: new Date().toLocaleString('tr-TR'),
    status: 'active'
  },
  {
    email: 'sube@gmail.com',
    password: '123456',
    role: 'Şube',
    lastLogin: new Date().toLocaleString('tr-TR'),
    status: 'active'
  }
])

export const useAuth = () => {
  const checkAuth = () => {
    if (process.client) {
      isAuthenticated.value = localStorage.getItem('isAuthenticated') === 'true'
    }
    return isAuthenticated.value
  }

  const login = (email, password) => {
    const user = users.value.find(u => u.email === email && u.password === password)
    if (user) {
      if (process.client) {
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('currentUser', JSON.stringify(user))
      }
      user.lastLogin = new Date().toLocaleString('tr-TR')
      isAuthenticated.value = true
      return true
    }
    return false
  }

  const logout = () => {
    if (process.client) {
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('currentUser')
    }
    isAuthenticated.value = false
  }

  const addUser = (newUser) => {
    users.value.push({
      ...newUser,
      lastLogin: '-',
      status: 'active'
    })
  }

  const updateUserPassword = (email, newPassword) => {
    const user = users.value.find(u => u.email === email)
    if (user) {
      user.password = newPassword
      return true
    }
    return false
  }

  const getCurrentUser = () => {
    if (process.client) {
      return JSON.parse(localStorage.getItem('currentUser'))
    }
    return null
  }

  const getAllUsers = () => users.value

  return {
    isAuthenticated,
    users,
    checkAuth,
    login,
    logout,
    addUser,
    updateUserPassword,
    getCurrentUser,
    getAllUsers
  }
} 