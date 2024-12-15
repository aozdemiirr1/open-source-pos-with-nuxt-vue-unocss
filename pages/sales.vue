<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Point of Sale</h1>
      <p class="text-gray-600">Process transactions and manage sales</p>
    </div>

    <div class="grid grid-cols-12 gap-6">
      <!-- Products Grid -->
      <div class="col-span-8">
        <div class="bg-white p-4 rounded-lg shadow-sm">
          <!-- Categories -->
          <div class="flex gap-2 mb-4 overflow-x-auto pb-2">
            <button 
              v-for="category in categories" 
              :key="category"
              @click="selectedCategory = category"
              class="px-4 py-2 rounded-full whitespace-nowrap"
              :class="selectedCategory === category ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'"
            >
              {{ category }}
            </button>
          </div>

          <!-- Products -->
          <div class="grid grid-cols-3 gap-4">
            <div 
              v-for="product in filteredProducts" 
              :key="product.id"
              @click="addToCart(product)"
              class="bg-gray-50 p-4 rounded-lg cursor-pointer hover:shadow-md transition-shadow"
            >
              <div class="text-center mb-2">
                <Icon :name="product.icon" class="text-4xl text-gray-600" />
              </div>
              <h3 class="font-medium">{{ product.name }}</h3>
              <p class="text-gray-600">${{ product.price.toFixed(2) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Cart -->
      <div class="col-span-4">
        <div class="bg-white p-4 rounded-lg shadow-sm">
          <h2 class="text-xl font-bold mb-4">Current Order</h2>
          
          <!-- Cart Items -->
          <div class="space-y-2 mb-4 max-h-[400px] overflow-y-auto">
            <div 
              v-for="item in cart" 
              :key="item.id"
              class="flex items-center justify-between p-2 bg-gray-50 rounded"
            >
              <div class="flex items-center gap-2">
                <Icon :name="item.icon" class="text-xl text-gray-600" />
                <div>
                  <p class="font-medium">{{ item.name }}</p>
                  <p class="text-sm text-gray-600">${{ item.price.toFixed(2) }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button 
                  @click="decreaseQuantity(item)"
                  class="p-1 hover:bg-gray-200 rounded"
                >
                  <Icon name="mdi:minus" />
                </button>
                <span>{{ item.quantity }}</span>
                <button 
                  @click="increaseQuantity(item)"
                  class="p-1 hover:bg-gray-200 rounded"
                >
                  <Icon name="mdi:plus" />
                </button>
              </div>
            </div>
          </div>

          <!-- Totals -->
          <div class="border-t pt-4 space-y-2">
            <div class="flex justify-between">
              <span>Subtotal</span>
              <span>${{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Tax (10%)</span>
              <span>${{ tax.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between font-bold">
              <span>Total</span>
              <span>${{ total.toFixed(2) }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="mt-4 space-y-2">
            <button 
              @click="processPayment"
              class="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
              :disabled="!cart.length"
            >
              Process Payment
            </button>
            <button 
              @click="clearCart"
              class="w-full py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              :disabled="!cart.length"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { faker } from '@faker-js/faker'

// Generate fake products
const generateProducts = () => {
  const categories = ['Beverages', 'Food', 'Desserts', 'Snacks']
  const icons = ['mdi:coffee', 'mdi:food', 'mdi:cake', 'mdi:food-apple']
  
  return Array.from({ length: 30 }, () => {
    const categoryIndex = faker.number.int({ min: 0, max: 3 })
    return {
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      price: parseFloat(faker.commerce.price({ min: 2, max: 20 })),
      category: categories[categoryIndex],
      icon: icons[categoryIndex]
    }
  })
}

const categories = ['All', 'Beverages', 'Food', 'Desserts', 'Snacks']
const selectedCategory = ref('All')
const products = ref(generateProducts())
const cart = ref([])

// Filter products by category
const filteredProducts = computed(() => {
  if (selectedCategory.value === 'All') return products.value
  return products.value.filter(p => p.category === selectedCategory.value)
})

// Cart calculations
const subtotal = computed(() => {
  return cart.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const tax = computed(() => subtotal.value * 0.1)
const total = computed(() => subtotal.value + tax.value)

// Cart functions
const addToCart = (product) => {
  const existingItem = cart.value.find(item => item.id === product.id)
  if (existingItem) {
    existingItem.quantity++
  } else {
    cart.value.push({ ...product, quantity: 1 })
  }
}

const increaseQuantity = (item) => {
  item.quantity++
}

const decreaseQuantity = (item) => {
  if (item.quantity > 1) {
    item.quantity--
  } else {
    cart.value = cart.value.filter(i => i.id !== item.id)
  }
}

const clearCart = () => {
  cart.value = []
}

const processPayment = () => {
  // Here you would typically integrate with a payment system
  alert(`Processing payment for $${total.value.toFixed(2)}`)
  clearCart()
}
</script> 