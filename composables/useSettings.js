import { ref, onMounted } from 'vue'
import { useOrdersApi } from './data/axios'

const restaurantName = ref('')
const restaurantEmail = ref('')

export const useSettings = () => {
  const loadSettings = async () => {
    try {
      const ordersApi = useOrdersApi()
      const response = await ordersApi.getSettings()
      if (response?.data) {
        restaurantName.value = response.data.restaurantName
        restaurantEmail.value = response.data.email
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    }
  }

  onMounted(() => {
    loadSettings()
  })

  return {
    restaurantName,
    restaurantEmail,
    loadSettings
  }
} 