<template>
    <div class="p-6 bg-gray-100 min-h-screen">
      <!-- Header -->
      <div class="mb-6 flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Siparişler</h1>
          <p class="text-gray-600">Tüm siparişleri yönetin</p>
        </div>
      </div>
  
      <!-- Order Type Filters -->
      <div class="flex gap-3 mb-6">
        <button 
          v-for="type in orderTypes" 
          :key="type.id"
          @click="activeOrderType = type.id"
          :class="[
            'px-4 py-2 rounded-lg flex items-center gap-2',
            activeOrderType === type.id 
              ? 'bg-blue-500 text-white' 
              : 'bg-white text-gray-700'
          ]"
        >
          <Icon :name="type.icon" />
          {{ type.label }}
        </button>
      </div>
  
      <!-- Orders Table -->
      <div class="bg-white rounded-lg shadow-sm">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="p-4 text-left text-13px">Sipariş No</th>
              <th class="p-4 text-left text-13px">Müşteri</th>
              <th class="p-4 text-left text-13px">Tip</th>
              <th class="p-4 text-left text-13px">Tutar</th>
              <th class="p-4 text-left text-13px">Durum</th>
              <th class="p-4 text-left text-13px">Tarih</th>
              <th class="p-4 text-left text-13px">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in filteredOrders" :key="order.id" class="border-b">
              <td class="p-4">#{{ order.id }}</td>
              <td class="p-4">{{ order.customer }}</td>
              <td class="p-4">
                <span 
                  class="px-2 py-1 text-xs rounded"
                  :class="getOrderTypeClass(order.type)"
                >
                  {{ getOrderTypeLabel(order.type) }}
                </span>
              </td>
              <td class="p-4">₺{{ order.total }}</td>
              <td class="p-4">
                <span 
                  class="px-2 py-1 text-xs rounded"
                  :class="getStatusClass(order.status)"
                >
                  {{ getStatusLabel(order.status) }}
                </span>
              </td>
              <td class="p-4">{{ formatDate(order.date) }}</td>
              <td class="p-4">
                <div class="flex gap-2">
                  <button @click="showOrderDetails(order)" class="w-8 h-8 text-blue-500 bg-blue-100 rounded">
                    <Icon name="mdi:eye" />
                  </button>
                  <button @click="printOrder(order)" class="w-8 h-8 text-green-500 bg-green-100 rounded">
                    <Icon name="mdi:printer" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Order Details Modal -->
      <div v-if="selectedOrder" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg w-[800px] p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-semibold">Sipariş Detayları</h3>
            <button @click="selectedOrder = null" class="text-gray-500 hover:text-gray-700">
              <Icon name="mdi:close" />
            </button>
          </div>
          
          <div class="space-y-6">
            <div class="grid grid-cols-3 gap-4">
              <div>
                <p class="text-sm text-gray-600">Sipariş No</p>
                <p class="font-medium">#{{ selectedOrder.id }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Müşteri</p>
                <p class="font-medium">{{ selectedOrder.customer }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Sipariş Tipi</p>
                <span class="px-2 py-1 text-xs rounded" :class="getOrderTypeClass(selectedOrder.type)">
                  {{ getOrderTypeLabel(selectedOrder.type) }}
                </span>
              </div>
              <div>
                <p class="text-sm text-gray-600">Durum</p>
                <span class="px-2 py-1 text-xs rounded" :class="getStatusClass(selectedOrder.status)">
                  {{ getStatusLabel(selectedOrder.status) }}
                </span>
              </div>
              <div>
                <p class="text-sm text-gray-600">Tarih</p>
                <p class="font-medium">{{ formatDate(selectedOrder.date) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Toplam Tutar</p>
                <p class="font-medium">₺{{ selectedOrder.total }}</p>
              </div>
            </div>

            <!-- Order Items -->
            <div class="mt-6">
              <h4 class="font-semibold mb-3">Sipariş İçeriği</h4>
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
                  <tr v-for="item in selectedOrder.items" :key="item.id" class="border-b">
                    <td class="p-3">{{ item.name }}</td>
                    <td class="p-3">{{ item.quantity }}</td>
                    <td class="p-3">₺{{ item.price }}</td>
                    <td class="p-3">₺{{ item.quantity * item.price }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="flex justify-end mt-6">
              <button @click="printOrder(selectedOrder)" class="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center gap-2">
                <Icon name="mdi:printer" />
                Siparişi Yazdır
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { faker } from '@faker-js/faker'
  
  const orderTypes = [
    { id: 'all', label: 'Tümü', icon: 'mdi:clipboard-list' },
    { id: 'masa', label: 'Masa', icon: 'mdi:table-chair' },
    { id: 'gelal', label: 'Gel-Al', icon: 'mdi:shopping' },
    { id: 'online', label: 'Online', icon: 'mdi:truck-delivery' }
  ]
  
  const activeOrderType = ref('all')
  const selectedOrder = ref(null)

  // Generate mock menu items
  const menuItems = [
    { id: 1, name: 'Karışık Pizza', price: 120 },
    { id: 2, name: 'Hamburger', price: 85 },
    { id: 3, name: 'Cola', price: 15 },
    { id: 4, name: 'Patates Kızartması', price: 30 },
    { id: 5, name: 'Tavuk Döner', price: 70 }
  ]
  
  // Generate mock orders with items
  const orders = ref(Array.from({ length: 20 }, () => {
    const orderItems = Array.from({ length: faker.number.int({ min: 1, max: 4 }) }, () => {
      const menuItem = faker.helpers.arrayElement(menuItems)
      return {
        id: faker.string.numeric(4),
        name: menuItem.name,
        quantity: faker.number.int({ min: 1, max: 3 }),
        price: menuItem.price
      }
    })

    const total = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    return {
      id: faker.string.numeric(6),
      customer: faker.person.fullName(),
      type: faker.helpers.arrayElement(['masa', 'gelal', 'online']),
      total: total,
      status: faker.helpers.arrayElement(['pending', 'preparing', 'ready', 'completed']),
      date: faker.date.recent(),
      items: orderItems
    }
  }))
  
  const filteredOrders = computed(() => {
    if (activeOrderType.value === 'all') return orders.value
    return orders.value.filter(order => order.type === activeOrderType.value)
  })
  
  const showOrderDetails = (order) => {
    selectedOrder.value = order
  }

  const printOrder = (order) => {
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head>
          <title>Sipariş Fişi #${order.id}</title>
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
            <h2>Sipariş Fişi</h2>
            <p>Sipariş No: #${order.id}</p>
            <p>Tarih: ${formatDate(order.date)}</p>
            <p>Müşteri: ${order.customer}</p>
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
              ${order.items.map(item => `
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
            <h3>Toplam: ₺${order.total}</h3>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }
  
  const getOrderTypeLabel = (type) => {
    const labels = {
      masa: 'Masa',
      gelal: 'Gel-Al',
      online: 'Online'
    }
    return labels[type] || type
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
  
  const getOrderTypeClass = (type) => {
    const classes = {
      masa: 'bg-blue-100 text-blue-800',
      gelal: 'bg-green-100 text-green-800',
      online: 'bg-purple-100 text-purple-800'
    }
    return classes[type] || 'bg-gray-100 text-gray-800'
  }
  
  const getStatusClass = (status) => {
    const classes = {
      pending: 'bg-yellow-100 text-yellow-800',
      preparing: 'bg-blue-100 text-blue-800',
      ready: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800'
    }
    return classes[status] || 'bg-gray-100 text-gray-800'
  }
  
  const formatDate = (date) => {
    return new Date(date).toLocaleString('tr-TR')
  }
  </script>