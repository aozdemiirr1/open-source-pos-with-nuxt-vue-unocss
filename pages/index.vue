<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useOrdersApi } from '../composables/data/axios'

// Initialize with empty arrays and default values
const orders = ref([])
const tables = ref([])
const customers = ref(0)

// Fetch data
const fetchDashboardData = async () => {
  try {
    const ordersApi = useOrdersApi()
    const [ordersRes, tablesRes] = await Promise.all([
      ordersApi.getOrders(),
      ordersApi.getTables()
    ])

    orders.value = ordersRes.data || []
    tables.value = tablesRes.data || []

    // Count unique customers from orders
    const uniqueCustomers = new Set()
    orders.value.forEach(order => {
      if (order.customer && order.phone) {
        uniqueCustomers.add(`${order.customer}-${order.phone}`)
      }
    })
    customers.value = uniqueCustomers.size
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  }
}

// Auto-refresh data
onMounted(() => {
  fetchDashboardData()
  const interval = setInterval(fetchDashboardData, 5000)
  onUnmounted(() => clearInterval(interval))
})

// Computed properties with null checks
const getTodayOrders = computed(() => {
  const today = new Date().toDateString()
  return orders.value.filter(order =>
    new Date(order.date).toDateString() === today
  ) || []
})

const getActiveTables = computed(() => {
  return tables.value.filter(table => table.status === 'occupied') || []
})

const getTableOccupancyRate = computed(() => {
  if (!tables.value.length) return 0
  return Math.round((getActiveTables.value.length / tables.value.length) * 100)
})

const getDailyRevenue = computed(() => {
  return getTodayOrders.value.reduce((sum, order) => sum + (order.total || 0), 0)
})

const getAverageOrderAmount = computed(() => {
  const todayOrders = getTodayOrders.value
  if (!todayOrders.length) return 0
  return Math.round(getDailyRevenue.value / todayOrders.length)
})

const getTableOrders = computed(() => {
  return orders.value.filter(order => order.type === 'masa') || []
})

const recentOrders = computed(() => {
  return [...(orders.value || [])]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
})

const getTableCustomers = computed(() => {
  return orders.value.filter(order => order.type === 'masa') || []
})

const getOnlineCustomers = computed(() => {
  return orders.value.filter(order => order.type === 'online') || []
})

const getPickupCustomers = computed(() => {
  return orders.value.filter(order => order.type === 'gel-al') || []
})

const getNewCustomers = computed(() => {
  const lastWeek = new Date()
  lastWeek.setDate(lastWeek.getDate() - 7)
  return orders.value.filter(order =>
    new Date(order.date) > lastWeek
  ) || []
})

// Helper functions
const formatDate = (date) => {
  return new Date(date).toLocaleString('tr-TR')
}

const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    preparing: 'bg-blue-100 text-blue-800',
    ready: 'bg-orange-100 text-orange-800',
    completed: 'bg-green-100 text-green-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusLabel = (status) => {
  const labels = {
    pending: 'Bekliyor',
    preparing: 'Hazırlanıyor',
    ready: 'Hazır',
    completed: 'Tamamlandı'
  }
  return labels[status] || status
}
</script>

<template>
  <div class="space-y-6 mt-10 mx-10">
    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Orders -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Toplam Sipariş</p>
            <h3 class="text-2xl font-bold">{{ orders.length }}</h3>
          </div>
          <div class="bg-blue-100 w-12 h-12 flex items-center justify-center rounded-full">
            <Icon name="mdi:clipboard-text" class="text-2xl text-blue-600" />
          </div>
        </div>
        <p class="text-sm text-gray-500 mt-2">
          Bugün: {{ getTodayOrders.length }} sipariş
        </p>
      </div>

      <!-- Total Customers -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Toplam Müşteri</p>
            <h3 class="text-2xl font-bold">{{ customers }}</h3>
          </div>
          <div class="bg-green-100 w-12 h-12 flex items-center justify-center rounded-full">
            <Icon name="mdi:account-group" class="text-2xl text-green-600" />
          </div>
        </div>
        <p class="text-sm text-gray-500 mt-2">
          Yeni: {{ getNewCustomers.length }} müşteri
        </p>
      </div>

      <!-- Daily Revenue -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Günlük Ciro</p>
            <h3 class="text-2xl font-bold">₺{{ getDailyRevenue }}</h3>
          </div>
          <div class="bg-purple-100 w-12 h-12 flex items-center justify-center rounded-full">
            <Icon name="mdi:currency-try" class="text-2xl text-purple-600" />
          </div>
        </div>
        <p class="text-sm text-gray-500 mt-2">
          Ort. Sipariş: ₺{{ getAverageOrderAmount }}
        </p>
      </div>

      <!-- Active Tables -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Aktif Masalar</p>
            <h3 class="text-2xl font-bold">{{ getTableOrders.length }}/{{ tables.length }}</h3>
          </div>
          <div class="bg-orange-100 w-12 h-12 flex items-center justify-center rounded-full">
            <Icon name="mdi:table-furniture" class="text-2xl text-orange-600" />
          </div>
        </div>
        <p class="text-sm text-gray-500 mt-2">
          Doluluk: %{{ getTableOccupancyRate }}
        </p>
      </div>
    </div>

    <!-- Recent Orders and Customer Stats -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Orders -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b">
          <h2 class="text-lg font-medium">Son Siparişler</h2>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div v-for="order in recentOrders" :key="order.id"
              class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p class="font-medium">{{ order.customer }}</p>
                <p class="text-sm text-gray-500">{{ formatDate(order.date) }}</p>
              </div>
              <div class="text-right">
                <p class="font-medium">₺{{ order.total }}</p>
                <span class="text-xs px-2 py-1 rounded-full" :class="getStatusClass(order.status)">
                  {{ getStatusLabel(order.status) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Customer Stats -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b">
          <h2 class="text-lg font-medium">Müşteri İstatistikleri</h2>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="p-4 bg-gray-50 rounded-lg">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-gray-600">Masa Müşterileri</p>
                    <p class="text-xl font-bold">{{ getTableCustomers.length }}</p>
                  </div>
                  <div class="bg-blue-100 w-10 h-10 flex items-center justify-center rounded-full">
                    <Icon name="mdi:table-chair" class="text-xl text-blue-600" />
                  </div>
                </div>
              </div>
              <div class="p-4 bg-gray-50 rounded-lg">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-gray-600">Online Müşteriler</p>
                    <p class="text-xl font-bold">{{ getOnlineCustomers.length }}</p>
                  </div>
                  <div class="bg-green-100 w-10 h-10 flex items-center justify-center rounded-full">
                    <Icon name="mdi:web" class="text-xl text-green-600" />
                  </div>
                </div>
              </div>
              <div class="p-4 bg-gray-50 rounded-lg">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-gray-600">Gel-Al Müşteriler</p>
                    <p class="text-xl font-bold">{{ getPickupCustomers.length }}</p>
                  </div>
                  <div class="bg-purple-100 w-10 h-10 flex items-center justify-center rounded-full">
                    <Icon name="mdi:shopping" class="text-xl text-purple-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
