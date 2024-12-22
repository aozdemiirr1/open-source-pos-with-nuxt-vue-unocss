<script setup>
import { ref, onMounted, watch } from 'vue'
import { useSettings } from '../composables/useSettings'
import { useAuth } from '../composables/useAuth'

const { isAdmin } = useAuth()
const { branchSettings, loadBranchSettings, saveBranchSettings } = useSettings()

const settings = ref({
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

onMounted(() => {
  loadBranchSettings()
  settings.value = { ...branchSettings.value }
})

// Watch for changes in branchSettings
watch(branchSettings, (newValue) => {
  settings.value = { ...newValue }
}, { deep: true })

const getDayName = (day) => {
  const days = {
    monday: 'Pazartesi',
    tuesday: 'Salı',
    wednesday: 'Çarşamba',
    thursday: 'Perşembe',
    friday: 'Cuma',
    saturday: 'Cumartesi',
    sunday: 'Pazar'
  }
  return days[day]
}

const showMessage = ref(false)
const messageText = ref('')

const saveSettings = () => {
  saveBranchSettings(settings.value)
  messageText.value = 'Ayarlar başarıyla kaydedildi'
  showMessage.value = true
  setTimeout(() => {
    showMessage.value = false
  }, 3000)
}

const getStatusText = (isOpen) => {
  return isOpen ? 'Açık' : 'Kapalı'
}
</script>

<template>
  <div class="p-6">
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">{{ isAdmin() ? 'Sistem Ayarları' : 'Şube Ayarları' }}</h1>
      <button @click="saveSettings"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
        <Icon name="mdi:content-save" />
        <span>Kaydet</span>
      </button>
    </div>

    <div v-if="!isAdmin()" class="bg-white rounded-lg shadow">
      <div class="p-6 space-y-6">
        <!-- Branch Info -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium text-gray-900">Şube Bilgileri</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Şube Adı</label>
              <input v-model="settings.branchName" type="text" 
                class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Telefon</label>
              <input v-model="settings.phone" type="text" 
                class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">E-posta</label>
              <input v-model="settings.email" type="email" 
                class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Adres</label>
              <textarea v-model="settings.address" rows="2" 
                class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"></textarea>
            </div>
          </div>
        </div>

        <!-- Business Hours -->
        <div class="space-y-4 pt-6 border-t">
          <h3 class="text-lg font-medium text-gray-900">Çalışma Saatleri</h3>
          <div class="grid grid-cols-1 gap-4">
            <div v-for="(hours, day) in settings.businessHours" :key="day" 
              class="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
              <span class="w-24 text-sm font-medium">{{ getDayName(day) }}</span>
              <input type="time" v-model="hours.open" 
                :disabled="!hours.isOpen"
                class="rounded-lg border border-gray-300 px-3 py-2"
                :class="{ 'opacity-50': !hours.isOpen }">
              <span>-</span>
              <input type="time" v-model="hours.close" 
                :disabled="!hours.isOpen"
                class="rounded-lg border border-gray-300 px-3 py-2"
                :class="{ 'opacity-50': !hours.isOpen }">
              
              <label class="relative inline-flex items-center cursor-pointer ml-4">
                <input type="checkbox" v-model="hours.isOpen" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-200 rounded-full peer 
                  peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 
                  dark:peer-focus:ring-blue-800 dark:bg-gray-700 
                  peer-checked:after:translate-x-full peer-checked:after:border-white 
                  after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                  after:bg-white after:border-gray-300 after:border after:rounded-full 
                  after:h-5 after:w-5 after:transition-all dark:border-gray-600 
                  peer-checked:bg-blue-600"></div>
                <span class="ml-3 text-sm font-medium text-gray-700 min-w-[50px]">
                  {{ getStatusText(hours.isOpen) }}
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Message -->
    <div v-if="showMessage" 
      class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
      {{ messageText }}
    </div>
  </div>
</template>
