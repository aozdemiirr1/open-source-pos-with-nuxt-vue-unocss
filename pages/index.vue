<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <!-- Header Section -->
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p class="text-gray-600">Welcome to your POS system</p>
      </div>
      <button 
        @click="showOrderHistory"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
      >
        <Icon name="mdi:history" />
        Show Latest Order History
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div v-for="stat in statsData" :key="stat.title" 
           class="bg-white p-4 rounded-lg shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm">{{ stat.title }}</p>
            <p class="text-2xl font-bold">{{ stat.value }}</p>
          </div>
          <Icon :name="stat.icon" class="text-3xl text-gray-600" />
        </div>
        <p class="text-sm mt-2" :class="stat.trend > 0 ? 'text-green-500' : 'text-red-500'">
          {{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}% from last month
        </p>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Sales -->
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <h2 class="text-lg font-semibold mb-4">Recent Sales</h2>
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
        <h2 class="text-lg font-semibold mb-4">Top Products</h2>
        <div class="space-y-4">
          <div v-for="product in topProducts" :key="product.id" 
               class="flex items-center justify-between">
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
    <OrderHistoryModal ref="orderHistoryModal" />
  </div>
</template>

<script setup lang="ts">
const statsData = [
  {
    title: "Today's Sales",
    value: "$2,854",
    icon: "mdi:cash-register",
    trend: 12.5
  },
  {
    title: "Total Orders",
    value: "145",
    icon: "mdi:shopping-cart",
    trend: 8.2
  },
  {
    title: "Average Order",
    value: "$48.90",
    icon: "mdi:chart-line",
    trend: -2.4
  },
  {
    title: "Total Customers",
    value: "64",
    icon: "mdi:account-group",
    trend: 15.8
  }
]

const recentSales = [
  {
    id: 1,
    product: "Cappuccino",
    time: "2 minutes ago",
    amount: "$4.50",
    icon: "mdi:coffee"
  },
  {
    id: 2,
    product: "Chicken Sandwich",
    time: "15 minutes ago",
    amount: "$8.99",
    icon: "mdi:food"
  },
  {
    id: 3,
    product: "Green Tea",
    time: "25 minutes ago",
    amount: "$3.50",
    icon: "mdi:tea"
  },
  {
    id: 4,
    product: "Caesar Salad",
    time: "45 minutes ago",
    amount: "$10.99",
    icon: "mdi:food-fork-drink"
  }
]

const topProducts = [
  {
    id: 1,
    name: "Espresso",
    sales: "486 sales",
    color: "bg-blue-500"
  },
  {
    id: 2,
    name: "Latte",
    sales: "389 sales",
    color: "bg-green-500"
  },
  {
    id: 3,
    name: "Croissant",
    sales: "356 sales",
    color: "bg-yellow-500"
  },
  {
    id: 4,
    name: "Iced Coffee",
    sales: "285 sales",
    color: "bg-purple-500"
  }
]

const orderHistoryModal = ref()

const showOrderHistory = () => {
  orderHistoryModal.value.open()
}
</script>