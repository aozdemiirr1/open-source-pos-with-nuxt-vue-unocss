<script setup>
import { ref, computed, watch } from 'vue'

const menuItems = [
    { id: 1, name: 'Karışık Pizza', price: 120 },
    { id: 2, name: 'Hamburger', price: 85 },
    { id: 3, name: 'Cola', price: 15 },
    { id: 4, name: 'Patates Kızartması', price: 30 },
    { id: 5, name: 'Tavuk Döner', price: 70 }
]

const tableStatuses = [
    { id: 'all', label: 'Tümü', icon: 'mdi:table-furniture' },
    { id: 'active', label: 'Aktif', icon: 'mdi:table' },
    { id: 'empty', label: 'Boş', icon: 'mdi:table' }
]

const activeStatus = ref('all')
const selectedTable = ref(null)
const searchQuery = ref('')

// Mock orders data from orders.vue
const mockOrders = [
  {
    id: '100001',
    customer: 'Ahmet Yılmaz',
    type: 'masa',
    tableNo: '5',
    total: 235,
    status: 'pending',
    date: new Date('2024-01-15T12:30:00'),
    items: [
      { id: '1001', name: 'Karışık Pizza', quantity: 1, price: 120 },
      { id: '1002', name: 'Cola', quantity: 2, price: 15 },
      { id: '1003', name: 'Patates Kızartması', quantity: 1, price: 30 }
    ]
  },
  {
    id: '100015', 
    customer: 'Abdullah Özdemir',
    type: 'masa',
    tableNo: '10',
    total: 155,
    status: 'ready',
    date: new Date('2024-01-15T13:45:00'),
    items: [
      { id: '1004', name: 'Hamburger', quantity: 1, price: 85 },
      { id: '1005', name: 'Patates Kızartması', quantity: 1, price: 30 },
      { id: '1006', name: 'Cola', quantity: 1, price: 15 }
    ]
  }
]

const orders = ref(mockOrders)
const tables = ref([])

// Watch orders for changes and update tables
watch(() => orders.value, (newOrders) => {
    updateTables()
}, { deep: true })

// Create tables and add orders
const updateTables = () => {
    // Create 12 tables
    tables.value = Array.from({ length: 12 }, (_, index) => {
        const tableNo = (index + 1).toString()
        
        // Check if there's an active order for this table number
        const tableOrder = orders.value.find(order => 
            order.type === 'masa' && 
            order.tableNo === tableNo && 
            ['pending', 'preparing', 'ready'].includes(order.status)
        )

        if (tableOrder) {
            return {
                id: tableOrder.id,
                number: index + 1,
                status: 'active',
                customer: tableOrder.customer,
                startTime: tableOrder.date,
                items: tableOrder.items,
                total: tableOrder.total
            }
        }

        // If table is empty
        return {
            id: `table-${index + 1}`,
            number: index + 1,
            status: 'empty',
            customer: null,
            startTime: null,
            items: [],
            total: 0
        }
    })
}

const filteredTables = computed(() => {
    let filtered = tables.value

    // Status filter
    if (activeStatus.value !== 'all') {
        filtered = filtered.filter(table => table.status === activeStatus.value)
    }

    // Search filter
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(table => {
            return (
                table.number.toString().includes(query) ||
                `masa ${table.number}`.toLowerCase().includes(query) ||
                (table.customer && table.customer.toLowerCase().includes(query))
            )
        })
    }

    return filtered
})

const getTableStatusClass = (status) => {
    const classes = {
        active: 'bg-green-100 text-green-800',
        empty: 'bg-gray-100 text-gray-800'
    }
    return classes[status]
}

const getTableStatusLabel = (status) => {
    const labels = {
        active: 'Dolu',
        empty: 'Boş'
    }
    return labels[status]
}

const showTableDetails = (table) => {
    if (table.status === 'active') {
        selectedTable.value = table
    }
}

const formatDate = (date) => {
    if (!date) return '-'
    return new Date(date).toLocaleString('tr-TR')
}

// Using the print function from orders page
const printTableReceipt = (table) => {
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
    <html>
      <head>
        <title>Masa ${table.number} Fişi</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .header { text-align: center; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
          .total { margin-top: 20px; text-align: right; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>Masa ${table.number}</h2>
          <p>Tarih: ${formatDate(table.startTime)}</p>
          <p>Müşteri: ${table.customer}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Ürün</th>
              <th>Adet</th>
              <th>Birim Fiyat</th>
              <th>Toplam</th>
            </tr>
          </thead>
          <tbody>
            ${table.items.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>₺${item.price}</td>
                <td>₺${item.quantity * item.price}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="total">
          <h3>Toplam: ₺${table.total}</h3>
        </div>
      </body>
    </html>
  `)
    printWindow.document.close()
    printWindow.print()
}

// Initialize tables on load
updateTables()
</script>

<template>
    <div class="p-6 bg-gray-100 min-h-screen">
        <!-- Header -->
        <div class="mb-6 flex justify-between items-center">
            <div>
                <h1 class="text-2xl font-bold text-gray-800">Masalar</h1>
                <p class="text-gray-600">Aktif masaları yönetin</p>
            </div>
        </div>

        <!-- Masa Filtreleri -->
        <div class="flex items-center mb-6 gap-4">
            <!-- Search -->
            <div class="relative flex-1 max-w-md">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon name="mdi:magnify" class="h-5 w-5 text-gray-400" />
                </div>
                <input v-model="searchQuery" type="text" placeholder="Masa ara..."
                    class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <!-- Table Status Filter -->
            <div class="relative">
                <select v-model="activeStatus" class="w-48 pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option v-for="status in tableStatuses" :key="status.id" :value="status.id">
                        {{ status.label }}
                    </option>
                </select>
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon :name="tableStatuses.find(t => t.id === activeStatus)?.icon" class="text-lg text-gray-400" />
                </div>
                <div class="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                    <Icon name="mdi:chevron-down" class="text-gray-400" />
                </div>
            </div>
        </div>

        <!-- Masalar Grid -->
        <div class="grid grid-cols-4 gap-6">
            <div v-for="table in filteredTables" :key="table.id" @click="showTableDetails(table)"
                class="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h3 class="text-lg font-semibold">Masa {{ table.number }}</h3>
                        <p class="text-sm text-gray-600">{{ formatDate(table.startTime) }}</p>
                    </div>
                    <span class="px-2 py-1 text-xs rounded-full" :class="getTableStatusClass(table.status)">
                        {{ getTableStatusLabel(table.status) }}
                    </span>
                </div>

                <div class="space-y-2">
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-600">Müşteri</span>
                        <span class="font-medium">{{ table.customer || '-' }}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-600">Ürün Sayısı</span>
                        <span class="font-medium">{{ table.items.length }}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-600">Toplam</span>
                        <span class="font-medium">₺{{ table.total }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Masa Detay Modal -->
        <div v-if="selectedTable" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg w-[600px] p-6">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-semibold">Masa {{ selectedTable.number }} Detayları</h3>
                    <button @click="selectedTable = null" class="text-gray-500 hover:text-gray-700">
                        <Icon name="mdi:close" />
                    </button>
                </div>

                <div class="space-y-6">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <p class="text-sm text-gray-600">Müşteri</p>
                            <p class="font-medium">{{ selectedTable.customer }}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-600">Başlangıç</p>
                            <p class="font-medium">{{ formatDate(selectedTable.startTime) }}</p>
                        </div>
                    </div>

                    <!-- Sipariş İçeriği -->
                    <div>
                        <h4 class="font-semibold mb-3">Sipariş Detayları</h4>
                        <table class="w-full">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="p-3 text-left text-sm">Ürün</th>
                                    <th class="p-3 text-left text-sm">Adet</th>
                                    <th class="p-3 text-left text-sm">Birim Fiyat</th>
                                    <th class="p-3 text-left text-sm">Toplam</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in selectedTable.items" :key="item.id" class="border-b">
                                    <td class="p-3">{{ item.name }}</td>
                                    <td class="p-3">{{ item.quantity }}</td>
                                    <td class="p-3">₺{{ item.price }}</td>
                                    <td class="p-3">₺{{ item.quantity * item.price }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="flex justify-between items-center">
                        <div class="text-lg font-semibold">
                            Toplam: ₺{{ selectedTable.total }}
                        </div>
                        <button @click="printTableReceipt(selectedTable)"
                            class="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center gap-2">
                            <Icon name="mdi:printer" />
                            Fiş Yazdır
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>