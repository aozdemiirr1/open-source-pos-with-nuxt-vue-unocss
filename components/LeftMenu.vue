<template>
    <div class="left-menu h-screen w-64 bg-gray-800 text-white fixed left-0 top-0">
      <div class="p-4 border-b border-gray-700">
        <h2 class="text-xl font-bold">POS System</h2>
      </div>
      
      <nav class="p-2">
        <ul class="space-y-2">
          <li v-for="item in menuItems" :key="item.id">
            <NuxtLink 
              :to="item.path"
              class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Icon :name="item.icon" class="text-xl" />
              <span>{{ item.label }}</span>
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
  </template>
  
  <script setup lang="ts">
  const menuItems = [
    {
      id: 1,
      label: 'Dashboard',
      icon: 'mdi:view-dashboard',
      path: '/'
    },
    {
      id: 2,
      label: 'Sales',
      icon: 'mdi:cash-register',
      path: '/sales'
    },
    {
      id: 3,
      label: 'Products',
      icon: 'mdi:package-variant',
      path: '/products'
    },
    {
      id: 4,
      label: 'Inventory',
      icon: 'mdi:warehouse',
      path: '/inventory'
    },
    {
      id: 5,
      label: 'Customers',
      icon: 'mdi:account-group',
      path: '/customers'
    },
    {
      id: 6,
      label: 'Reports',
      icon: 'mdi:file-chart',
      path: '/reports'
    },
    {
      id: 7,
      label: 'Settings',
      icon: 'mdi:cog',
      path: '/settings'
    }
  ]
  </script>