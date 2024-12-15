<template>
    <div class="p-6 bg-gray-100 min-h-screen">
      <!-- Header -->
      <div class="mb-6 flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Customers</h1>
          <p class="text-gray-600">Manage your customer database</p>
        </div>
        <button 
          @click="showAddCustomerModal = true"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
        >
          <Icon name="mdi:account-plus" />
          Add New Customer
        </button>
      </div>
  
      <!-- Search and Filter -->
      <div class="bg-white p-4 rounded-lg shadow-sm mb-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search customers..."
          class="w-full p-2 border rounded-lg"
        />
      </div>
  
      <!-- Custom Data Table -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th 
                  v-for="column in columns" 
                  :key="column.key"
                  @click="sortBy(column.key)"
                  class="p-3 text-left cursor-pointer hover:bg-gray-100"
                >
                  <div class="flex items-center gap-2">
                    {{ column.label }}
                    <div v-if="sortColumn === column.key" class="text-gray-500">
                      <Icon :name="sortDirection === 'asc' ? 'mdi:chevron-up' : 'mdi:chevron-down'" />
                    </div>
                  </div>
                </th>
                <th class="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="customer in paginatedCustomers" 
                :key="customer.id" 
                class="border-b hover:bg-gray-50"
              >
                <td class="p-3">{{ customer.name }}</td>
                <td class="p-3">{{ customer.email }}</td>
                <td class="p-3">{{ customer.phone }}</td>
                <td class="p-3">{{ customer.totalOrders }} orders</td>
                <td class="p-3">${{ customer.totalSpent.toFixed(2) }}</td>
                <td class="p-3">
                  <div class="flex gap-2">
                    <button 
                      @click="editCustomer(customer)"
                      class="p-2 text-blue-500 hover:bg-blue-50 rounded-full"
                    >
                      <Icon name="mdi:pencil" />
                    </button>
                    <button 
                      @click="deleteCustomer(customer)"
                      class="p-2 text-red-500 hover:bg-red-50 rounded-full"
                    >
                      <Icon name="mdi:delete" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
  
        <!-- Pagination -->
        <div class="p-4 border-t border-gray-200 flex items-center justify-between">
          <div class="text-gray-600">
            Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filteredCustomers.length }} entries
          </div>
          <div class="flex gap-2">
            <button 
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button 
              @click="currentPage++"
              :disabled="currentPage >= totalPages"
              class="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
  
      <!-- Add/Edit Customer Modal -->
      <div v-if="showAddCustomerModal" 
           class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg w-[500px] p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-semibold">{{ editMode ? 'Edit Customer' : 'Add New Customer' }}</h3>
            <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
              <Icon name="mdi:close" />
            </button>
          </div>
          
          <form @submit.prevent="saveCustomer" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Name</label>
              <input 
                v-model="newCustomer.name"
                type="text"
                required
                class="mt-1 w-full p-2 border rounded-lg"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <input 
                v-model="newCustomer.email"
                type="email"
                required
                class="mt-1 w-full p-2 border rounded-lg"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Phone</label>
              <input 
                v-model="newCustomer.phone"
                type="tel"
                required
                class="mt-1 w-full p-2 border rounded-lg"
              />
            </div>
            
            <div class="flex justify-end gap-2 mt-6">
              <button 
                type="button"
                @click="closeModal"
                class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button 
                type="submit"
                class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                {{ editMode ? 'Update' : 'Add' }} Customer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { faker } from '@faker-js/faker'
  
  // Table columns configuration
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'totalOrders', label: 'Total Orders' },
    { key: 'totalSpent', label: 'Total Spent' }
  ]
  
  // Sorting
  const sortColumn = ref('name')
  const sortDirection = ref('asc')
  
  // Pagination
  const currentPage = ref(1)
  const itemsPerPage = 10
  
  // Generate fake customers
  const generateCustomers = () => {
    return Array.from({ length: 50 }, () => ({
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      totalOrders: faker.number.int({ min: 1, max: 50 }),
      totalSpent: parseFloat(faker.commerce.price({ min: 100, max: 5000 }))
    }))
  }
  
  const customers = ref(generateCustomers())
  const searchQuery = ref('')
  const showAddCustomerModal = ref(false)
  const editMode = ref(false)
  const newCustomer = ref({
    id: '',
    name: '',
    email: '',
    phone: '',
    totalOrders: 0,
    totalSpent: 0
  })
  
  // Filtered and sorted customers
  const filteredCustomers = computed(() => {
    let result = [...customers.value]
    
    // Search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(customer => 
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.phone.includes(query)
      )
    }
    
    // Sort
    result.sort((a, b) => {
      const aValue = a[sortColumn.value]
      const bValue = b[sortColumn.value]
      
      if (sortDirection.value === 'asc') {
        return aValue > bValue ? 1 : -1
      }
      return aValue < bValue ? 1 : -1
    })
    
    return result
  })
  
  // Pagination calculations
  const totalPages = computed(() => 
    Math.ceil(filteredCustomers.value.length / itemsPerPage)
  )
  
  const startIndex = computed(() => 
    (currentPage.value - 1) * itemsPerPage
  )
  
  const endIndex = computed(() => 
    Math.min(startIndex.value + itemsPerPage, filteredCustomers.value.length)
  )
  
  const paginatedCustomers = computed(() => 
    filteredCustomers.value.slice(startIndex.value, endIndex.value)
  )
  
  // Sort function
  const sortBy = (column) => {
    if (sortColumn.value === column) {
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortColumn.value = column
      sortDirection.value = 'asc'
    }
  }
  
  // Customer operations
  const editCustomer = (customer) => {
    editMode.value = true
    newCustomer.value = { ...customer }
    showAddCustomerModal.value = true
  }
  
  const deleteCustomer = (customer) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      customers.value = customers.value.filter(c => c.id !== customer.id)
    }
  }
  
  const saveCustomer = () => {
    if (editMode.value) {
      const index = customers.value.findIndex(c => c.id === newCustomer.value.id)
      if (index !== -1) {
        customers.value[index] = { ...newCustomer.value }
      }
    } else {
      customers.value.unshift({
        ...newCustomer.value,
        id: faker.string.uuid(),
        totalOrders: 0,
        totalSpent: 0
      })
    }
    closeModal()
  }
  
  const closeModal = () => {
    showAddCustomerModal.value = false
    editMode.value = false
    newCustomer.value = {
      id: '',
      name: '',
      email: '',
      phone: '',
      totalOrders: 0,
      totalSpent: 0
    }
  }
  </script>