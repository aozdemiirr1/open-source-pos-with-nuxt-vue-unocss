<script setup lang="ts">
import { ref } from 'vue'

const statsData = [
  {
    title: "Günlük Satış",
    value: "₺2,854",
    icon: "mdi:cash-register",
    trend: 12.5
  },
  {
    title: "Toplam Sipariş",
    value: "145",
    icon: "mdi:shopping-cart", 
    trend: 8.2
  },
  {
    title: "Ortalama Sipariş",
    value: "₺48.90",
    icon: "mdi:chart-line",
    trend: -2.4
  },
  {
    title: "Toplam Müşteri",
    value: "64",
    icon: "mdi:account-group",
    trend: 15.8
  }
]

const recentSales = [
  {
    id: 1,
    product: "Cappuccino",
    time: "2 dakika önce",
    amount: "₺4.50",
    icon: "mdi:coffee"
  },
  {
    id: 2,
    product: "Tavuk Sandviç",
    time: "15 dakika önce", 
    amount: "₺8.99",
    icon: "mdi:food"
  },
  {
    id: 3,
    product: "Yeşil Çay",
    time: "25 dakika önce",
    amount: "₺3.50",
    icon: "mdi:tea"
  },
  {
    id: 4,
    product: "Sezar Salata",
    time: "45 dakika önce",
    amount: "₺10.99",
    icon: "mdi:food-fork-drink"
  }
]

const topProducts = [
  {
    id: 1,
    name: "Espresso",
    sales: "486 satış",
    color: "bg-blue-500"
  },
  {
    id: 2,
    name: "Latte",
    sales: "389 satış",
    color: "bg-green-500"
  },
  {
    id: 3,
    name: "Kruvasan",
    sales: "356 satış",
    color: "bg-yellow-500"
  },
  {
    id: 4,
    name: "Soğuk Kahve",
    sales: "285 satış",
    color: "bg-purple-500"
  }
]

const isModalOpen = ref(false)
const recentOrders = ref([
  {
    id: '1001',
    date: '2024-01-20 14:30',
    customer: 'John Doe',
    total: 150.00,
    status: 'Tamamlandı',
    items: ['Tavuk Döner Menü', 'Ayran']
  },
  {
    id: '1002',
    date: '2024-01-20 14:15',
    customer: 'Jane Smith',
    total: 85.00,
    status: 'Hazırlanıyor',
    items: ['Yarım Ekmek Döner', 'Kola']
  },
  {
    id: '1003',
    date: '2024-01-20 14:00',
    customer: 'Mike Johnson',
    total: 200.00,
    status: 'Tamamlandı',
    items: ['Et Döner Menü', 'Su', 'Baklava']
  }
])

const showOrderHistory = () => {
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const getStatusClass = (status: string) => {
  return {
    'Tamamlandı': 'text-green-600',
    'Hazırlanıyor': 'text-yellow-600',
    'İptal Edildi': 'text-red-600'
  }[status] || 'text-gray-600'
}
</script>

<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <!-- Header Section -->
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Panel Genel Bakış</h1>
        <p class="text-gray-600">POS sistemine hoş geldiniz</p>
      </div>
      <button @click="showOrderHistory"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2">
        <Icon name="mdi:history" />
        Son Siparişleri Göster
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div v-for="stat in statsData" :key="stat.title" class="bg-white p-4 rounded-lg shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm">{{ stat.title }}</p>
            <p class="text-2xl font-bold">{{ stat.value }}</p>
          </div>
          <Icon :name="stat.icon" class="text-3xl text-gray-600" />
        </div>
        <p class="text-sm mt-2" :class="stat.trend > 0 ? 'text-green-500' : 'text-red-500'">
          {{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}% geçen aydan
        </p>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Sales -->
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <h2 class="text-lg font-semibold mb-4">Son Satışlar</h2>
        <div class="space-y-4">
          <div v-for="sale in recentSales" :key="sale.id"
            class="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
            <div class="flex items-center gap-3">
              <Icon :name="sale.icon" class="text-2xl text-gray-600" />
              <div>
                <p class="font-medium">{{ sale.product }}</p>
                <p class="text-sm text-gray-600">{{ sale.time }}</p>
              </div>
            </div>
            <p class="font-semibold">{{ sale.amount }}</p>
          </div>
        </div>
      </div>

      <!-- Top Products -->
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <h2 class="text-lg font-semibold mb-4">En Çok Satan Ürünler</h2>
        <div class="space-y-4">
          <div v-for="product in topProducts" :key="product.id" class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-2 h-8 rounded" :class="product.color"></div>
              <p>{{ product.name }}</p>
            </div>
            <p class="font-medium">{{ product.sales }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Order History Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg w-[800px] p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">Son Sipariş Geçmişi</h3>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
            <Icon name="mdi:close" class="text-xl" />
          </button>
        </div>

        <div class="space-y-4">
          <div v-for="order in recentOrders" :key="order.id" class="p-4 border rounded-lg">
            <div class="flex justify-between items-start">
              <div>
                <p class="font-medium">Sipariş #{{ order.id }}</p>
                <p class="text-sm text-gray-600">{{ order.date }}</p>
                <p class="text-sm text-gray-600">{{ order.customer }}</p>
              </div>
              <div class="text-right">
                <p class="font-semibold">₺{{ order.total }}</p>
                <p class="text-sm" :class="getStatusClass(order.status)">
                  {{ order.status }}
                </p>
              </div>
            </div>
            <div class="mt-2">
              <p class="text-sm text-gray-600">Ürünler: {{ order.items.join(', ') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
