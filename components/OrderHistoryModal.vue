<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg w-[800px] max-h-[80vh] overflow-hidden">
      <!-- Modal Header -->
      <div class="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 class="text-xl font-semibold">Latest Order History</h3>
        <button @click="close" class="text-gray-500 hover:text-gray-700">
          <Icon name="mdi:close" class="text-xl" />
        </button>
      </div>
      
      <!-- Modal Content -->
      <div class="p-4 overflow-y-auto max-h-[60vh]">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="p-3 text-left">Order ID</th>
              <th class="p-3 text-left">Customer</th>
              <th class="p-3 text-left">Items</th>
              <th class="p-3 text-left">Total</th>
              <th class="p-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id" class="border-b hover:bg-gray-50">
              <td class="p-3">#{{ order.id }}</td>
              <td class="p-3">{{ order.customer }}</td>
              <td class="p-3">{{ order.items }}</td>
              <td class="p-3">{{ order.total }}</td>
              <td class="p-3">{{ order.date }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Modal Footer -->
      <div class="p-4 border-t border-gray-200">
        <button 
          @click="close"
          class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { faker } from '@faker-js/faker'

const isOpen = ref(false)
const orders = ref([])

const generateOrders = () => {
  return Array.from({ length: 20 }, () => ({
    id: faker.string.numeric(6),
    customer: faker.person.fullName(),
    items: `${faker.number.int({ min: 1, max: 5 })} items`,
    total: faker.commerce.price({ min: 10, max: 200, dec: 2, symbol: '$' }),
    date: faker.date.recent({ days: 7 }).toLocaleDateString()
  }))
}

const open = () => {
  orders.value = generateOrders()
  isOpen.value = true
}

const close = () => {
  isOpen.value = false
}

defineExpose({ open, close })
</script> 