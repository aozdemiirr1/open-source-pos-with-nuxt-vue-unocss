<script setup>
import { ref, onMounted } from 'vue'
import { useOrdersApi } from '../composables/data/axios'

const defaultSettings = {
  restaurantName: '',
  address: '',
  phone: '',
  email: '',
  taxRate: 0,
  currency: 'TRY',
  language: 'tr',
  orderPrefix: '#',
  tableCount: 12,
  defaultMenuCategory: '1',
  showOutOfStockItems: false,
  allowSpecialRequests: true,
  autoConfirmOrders: false,
  orderNumberPrefix: 'SIP',
  minimumOrderAmount: 0,
  deliveryFee: 0,
  freeDeliveryThreshold: 0,
  acceptedPaymentMethods: {
    cash: true,
    creditCard: true,
    onlinePayment: false
  },
  printerEnabled: false,
  printerName: '',
  autoPrintReceipts: true,
  receiptFooterText: '',
  notifyNewOrders: true,
  notifyLowStock: true,
  notificationSound: true,
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

const settings = ref({ ...defaultSettings })

const loading = ref(false)
const saved = ref(false)

onMounted(async () => {
  await loadSettings()
})

const loadSettings = async () => {
  try {
    loading.value = true
    const ordersApi = useOrdersApi()
    const response = await ordersApi.getSettings()
    if (response?.data) {
      settings.value = { ...defaultSettings, ...response.data }
    }
  } catch (error) {
    console.error('Error loading settings:', error)
  } finally {
    loading.value = false
  }
}

const saveSettings = async () => {
  try {
    loading.value = true
    const ordersApi = useOrdersApi()
    await ordersApi.updateSettings(settings.value)
    saved.value = true
    setTimeout(() => {
      saved.value = false
    }, 2000)
  } catch (error) {
    console.error('Error saving settings:', error)
    alert('Ayarlar kaydedilirken bir hata oluştu')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <!-- Header -->
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Ayarlar</h1>
        <p class="text-gray-600">Sistem ayarlarını yönetin</p>
      </div>
      <button @click="saveSettings" :disabled="loading"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50">
        {{ loading ? 'Ayarlar Kaydediliyor...' : 'Ayarları Kaydet' }}
      </button>
    </div>

    <div class="bg-white rounded-lg shadow">
      <div class="p-6 space-y-6">
        <!-- Restaurant Info -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium text-gray-900">Restoran Bilgileri</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Restoran Adı</label>
              <input v-model="settings.restaurantName" type="text" 
                class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Telefon</label>
              <input v-model="settings.phone" type="text" 
                class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">E-posta</label>
              <input v-model="settings.email" type="email" 
                class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Adres</label>
              <textarea v-model="settings.address" rows="2" 
                class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"></textarea>
            </div>
          </div>
        </div>

        <!-- Menu Settings -->
        <div class="space-y-4 pt-6 border-t">
          <h3 class="text-lg font-medium text-gray-900">Menü Ayarları</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Varsayılan Kategori</label>
              <select v-model="settings.defaultMenuCategory" 
                class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option value="1">Döner Menüler</option>
                <option value="2">Döner Çeşitleri</option>
                <option value="3">Burgerler</option>
                <option value="4">Tatlılar</option>
                <option value="5">İçecekler</option>
              </select>
            </div>
            <div class="flex items-center">
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="settings.showOutOfStockItems" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span class="ml-3 text-sm font-medium text-gray-700">Stokta Olmayan Ürünleri Göster</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Order Settings -->
        <div class="space-y-4 pt-6 border-t">
          <h3 class="text-lg font-medium text-gray-900">Sipariş Ayarları</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Minimum Sipariş Tutarı</label>
              <input v-model.number="settings.minimumOrderAmount" type="number" min="0" 
                class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Teslimat Ücreti</label>
              <input v-model.number="settings.deliveryFee" type="number" min="0" 
                class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Ücretsiz Teslimat Limiti</label>
              <input v-model.number="settings.freeDeliveryThreshold" type="number" min="0" 
                class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            </div>
          </div>
        </div>

        <!-- Payment Settings -->
        <div class="space-y-4 pt-6 border-t">
          <h3 class="text-lg font-medium text-gray-900">Ödeme Ayarları</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="settings.acceptedPaymentMethods.cash" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span class="ml-3 text-sm font-medium text-gray-700">Nakit Ödeme</span>
              </label>
            </div>
            <div class="flex items-center justify-between">
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="settings.acceptedPaymentMethods.creditCard" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span class="ml-3 text-sm font-medium text-gray-700">Kredi Kartı</span>
              </label>
            </div>
            <div class="flex items-center justify-between">
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="settings.acceptedPaymentMethods.onlinePayment" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span class="ml-3 text-sm font-medium text-gray-700">Online Ödeme</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Business Hours -->
        <div class="space-y-4 pt-6 border-t">
          <h3 class="text-lg font-medium text-gray-900">Çalışma Saatleri</h3>
          <div class="space-y-3">
            <div v-for="(hours, day) in settings.businessHours" :key="day" class="grid grid-cols-3 gap-4 items-center">
              <div class="flex items-center">
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="hours.isOpen" class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  <span class="ml-3 text-sm font-medium text-gray-700 capitalize">{{ day }}</span>
                </label>
              </div>
              <input type="time" v-model="hours.open" :disabled="!hours.isOpen"
                class="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <input type="time" v-model="hours.close" :disabled="!hours.isOpen"
                class="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Success Message -->
    <div v-if="saved" 
      class="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg">
      Ayarlar başarıyla kaydedildi!
    </div>
  </div>
</template>
