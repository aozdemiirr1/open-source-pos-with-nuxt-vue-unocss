import { ref } from 'vue'
import { useAuth } from './useAuth'

const branchSettings = ref({
  branchName: '',
  address: '',
  phone: '',
  email: '',
  businessHours: {
    monday: { open: '09:00', close: '22:00', isOpen: true },
    tuesday: { open: '09:00', close: '22:00', isOpen: true },
    wednesday: { open: '09:00', close: '22:00', isOpen: true },
    thursday: { open: '09:00', close: '22:00', isOpen: true },
    friday: { open: '09:00', close: '22:00', isOpen: true },
    saturday: { open: '09:00', close: '22:00', isOpen: true },
    sunday: { open: '09:00', close: '22:00', isOpen: true }
  }
})

export const useSettings = () => {
  const { getCurrentUser } = useAuth()

  const loadBranchSettings = () => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      const savedSettings = localStorage.getItem(`branchSettings_${currentUser.email}`)
      if (savedSettings) {
        branchSettings.value = JSON.parse(savedSettings)
      } else {
        // Set default values from current user
        branchSettings.value = {
          branchName: currentUser.branchName || '',
          email: currentUser.email || '',
          phone: '',
          address: '',
          businessHours: {
            monday: { open: '09:00', close: '22:00', isOpen: true },
            tuesday: { open: '09:00', close: '22:00', isOpen: true },
            wednesday: { open: '09:00', close: '22:00', isOpen: true },
            thursday: { open: '09:00', close: '22:00', isOpen: true },
            friday: { open: '09:00', close: '22:00', isOpen: true },
            saturday: { open: '09:00', close: '22:00', isOpen: true },
            sunday: { open: '09:00', close: '22:00', isOpen: true }
          }
        }
      }
    }
  }

  const saveBranchSettings = (settings) => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      localStorage.setItem(`branchSettings_${currentUser.email}`, JSON.stringify(settings))
      branchSettings.value = settings
      
      // Update user data in auth
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const updatedUsers = users.map(user => {
        if (user.email === currentUser.email) {
          return {
            ...user,
            branchName: settings.branchName,
            email: settings.email
          }
        }
        return user
      })
      localStorage.setItem('users', JSON.stringify(updatedUsers))
    }
  }

  return {
    branchSettings,
    loadBranchSettings,
    saveBranchSettings
  }
} 