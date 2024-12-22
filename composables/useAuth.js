import { ref } from 'vue'

const isAuthenticated = ref(false)
const users = ref([
  {
    email: 'aozdemiirr05@gmail.com',
    password: '123456',
    role: 'Admin',
    name: 'Abdullah Özdemir',
    lastLogin: new Date().toLocaleString('tr-TR'),
    status: 'active'
  },
  {
    email: 'kadikoy@gmail.com',
    password: '123456',
    role: 'Şube',
    name: 'Kadıköy Şubesi',
    branchName: 'Kadıköy Şubesi',
    lastLogin: new Date().toLocaleString('tr-TR'),
    status: 'active'
  },
  {
    email: 'umraniye@gmail.com',
    password: '123456',
    role: 'Şube',
    name: 'Ümraniye Şubesi',
    branchName: 'Ümraniye Şubesi',
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

  const deleteUser = (email) => {
    const index = users.value.findIndex(u => u.email === email)
    if (index !== -1) {
      users.value.splice(index, 1)
      return true
    }
    return false
  }

  const isAdmin = () => {
    const currentUser = getCurrentUser()
    return currentUser?.role === 'Admin'
  }

  const getBranchName = () => {
    const currentUser = getCurrentUser()
    return currentUser?.branchName || ''
  }

  const getUserDisplayName = () => {
    const currentUser = getCurrentUser()
    if (currentUser?.role === 'Admin') {
      return currentUser.name
    }
    return currentUser?.branchName || ''
  }

  return {
    isAuthenticated,
    users,
    checkAuth,
    login,
    logout,
    addUser,
    deleteUser,
    updateUserPassword,
    getCurrentUser,
    getAllUsers,
    isAdmin,
    getBranchName,
    getUserDisplayName
  }
} 