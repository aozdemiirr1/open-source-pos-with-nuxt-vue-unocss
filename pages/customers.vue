<script setup>
import { ref, computed, onMounted } from 'vue'
import { useOrdersApi } from '../composables/data/axios'

const customerTypes = [
  { id: 'all', label: 'Tümü', icon: 'mdi:clipboard-list' },
  { id: 'masa', label: 'Masa', icon: 'mdi:table-chair' },
  { id: 'gel-al', label: 'Gel-Al', icon: 'mdi:shopping' },
  { id: 'online', label: 'Online', icon: 'mdi:truck-delivery' }
]

const customerStatuses = [
  { id: 'all', label: 'Tüm Durumlar', icon: 'mdi:filter-variant' },
  { id: 'active', label: 'Aktif', icon: 'mdi:check-circle' },
  { id: 'inactive', label: 'Pasif', icon: 'mdi:close-circle' }
]

const activeCustomerType = ref('all')
const activeStatus = ref('all')
const selectedCustomer = ref(null)
const searchQuery = ref('')
const orders = ref([])

// Fetch orders from API
onMounted(async () => {
  try {
    const ordersApi = useOrdersApi()
    const response = await ordersApi.getOrders()
    orders.value = response.data
  } catch (error) {
    console.error('Error fetching orders:', error)
  }
})

const customers = computed(() => {
  // Group orders by customer and create customer objects
  const customerMap = new Map()
  
  orders.value.forEach(order => {
    if (!customerMap.has(order.customer)) {
      customerMap.set(order.customer, {
        name: order.customer,
        type: order.type,
        city: order.city,
        phone: order.phone,
        district: order.district,
        neighborhood: order.neighborhood,
        street: order.street,
        status: 'active',
        orders: []
      })
    }
    customerMap.get(order.customer).orders.push(order)
  })

  return Array.from(customerMap.values())
})

const filteredCustomers = computed(() => {
  let filtered = customers.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(customer =>
      customer.name.toLowerCase().includes(query) ||
      customer.city?.toLowerCase().includes(query) ||
      customer.district?.toLowerCase().includes(query)
    )
  }

  if (activeCustomerType.value !== 'all') {
    filtered = filtered.filter(customer => customer.type === activeCustomerType.value)
  }

  if (activeStatus.value !== 'all') {
    filtered = filtered.filter(customer => customer.status === activeStatus.value)
  }

  return filtered
})

const showCustomerDetails = (customer) => {
  selectedCustomer.value = customer
}

const getCustomerTypeLabel = (type) => {
  const customerType = customerTypes.find(t => t.id === type)
  return customerType ? customerType.label : type
}

const getCustomerTypeClass = (type) => {
  switch (type) {
    case 'masa':
      return 'bg-blue-100 text-blue-800'
    case 'gel-al':
      return 'bg-green-100 text-green-800'
    case 'online':
      return 'bg-purple-100 text-purple-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusClass = (status) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'inactive':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('tr-TR')
}
</script>

<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <!-- Header -->
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Müşteriler</h1>
        <p class="text-gray-600">Müşteri listesi ve detayları</p>
      </div>
      <button class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2">
        <Icon name="mdi:account-plus" />
        Yeni Müşteri
      </button>
    </div>

    <!-- Filters -->
    <div class="flex gap-4 mb-6">
      <div class="relative flex-1">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon name="mdi:magnify" class="h-5 w-5 text-gray-400" />
        </div>
        <input v-model="searchQuery" type="text" placeholder="Müşteri ara..."
          class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg" />
      </div>

      <div class="relative">
        <select v-model="activeCustomerType"
          class="w-48 pl-10 pr-4 py-2 border border-gray-300 rounded-lg appearance-none">
          <option v-for="type in customerTypes" :key="type.id" :value="type.id">
            {{ type.label }}
          </option>
        </select>
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon :name="customerTypes.find(t => t.id === activeCustomerType)?.icon" class="text-gray-400" />
        </div>
      </div>

      <div class="relative">
        <select v-model="activeStatus" class="w-48 pl-10 pr-4 py-2 border border-gray-300 rounded-lg appearance-none">
          <option v-for="status in customerStatuses" :key="status.id" :value="status.id">
            {{ status.label }}
          </option>
        </select>
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon :name="customerStatuses.find(s => s.id === activeStatus)?.icon" class="text-gray-400" />
        </div>
      </div>
    </div>

    <!-- Customers Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Müşteri</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefon</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tip</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İl</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İlçe</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mahalle</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cadde/Sokak</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Son Sipariş</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="customer in filteredCustomers" :key="customer.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ customer.name }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ customer.phone }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 py-1 text-xs rounded" :class="getCustomerTypeClass(customer.type)">
                {{ getCustomerTypeLabel(customer.type) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ customer.city }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ customer.district }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ customer.neighborhood }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ customer.street }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 py-1 text-xs rounded" :class="getStatusClass(customer.status)">
                {{ customer.status === 'active' ? 'Aktif' : 'Pasif' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ customer.orders.length > 0 ? formatDate(customer.orders[customer.orders.length - 1].date) : '-' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex gap-2">
                <button @click="showCustomerDetails(customer)"
                  class="w-8 h-8 text-blue-500 bg-blue-100 rounded hover:bg-blue-200">
                  <Icon name="mdi:eye" />
                </button>
                <button class="w-8 h-8 text-green-500 bg-green-100 rounded hover:bg-green-200">
                  <Icon name="mdi:pencil" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Customer Details Modal -->
    <div v-if="selectedCustomer" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg w-[800px] p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-semibold">Müşteri Detayları</h3>
          <button @click="selectedCustomer = null" class="text-gray-500 hover:text-gray-700">
            <Icon name="mdi:close" />
          </button>
        </div>

        <div class="grid grid-cols-2 gap-6">
          <div>
            <h4 class="font-medium mb-2">Kişisel Bilgiler</h4>
            <div class="space-y-2">
              <p><span class="text-gray-600">Ad Soyad:</span> {{ selectedCustomer.name }}</p>
              <p><span class="text-gray-600">Müşteri Tipi:</span>
                <span class="px-2 py-1 text-xs rounded" :class="getCustomerTypeClass(selectedCustomer.type)">
                  {{ getCustomerTypeLabel(selectedCustomer.type) }}
                </span>
              </p>
            </div>
          </div>

          <div>
            <h4 class="font-medium mb-2">Adres Bilgileri</h4>
            <div class="space-y-2">
              <p><span class="text-gray-600">İl:</span> {{ selectedCustomer.city }}</p>
              <p><span class="text-gray-600">İlçe:</span> {{ selectedCustomer.district }}</p>
              <p><span class="text-gray-600">Mahalle:</span> {{ selectedCustomer.neighborhood }}</p>
              <p><span class="text-gray-600">Cadde/Sokak:</span> {{ selectedCustomer.street }}</p>
            </div>
          </div>
        </div>

        <div class="mt-6">
          <h4 class="font-medium mb-2">Sipariş Geçmişi</h4>
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Tarih</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Sipariş No</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Tutar</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in selectedCustomer.orders" :key="order.id" class="border-b">
                <td class="px-4 py-2">{{ formatDate(order.date) }}</td>
                <td class="px-4 py-2">#{{ order.id }}</td>
                <td class="px-4 py-2">₺{{ order.total }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>