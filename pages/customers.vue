<script setup>
import { ref, computed } from 'vue'
import { faker } from '@faker-js/faker'

const customerTypes = ['masa', 'gel-al', 'online']

// Generate fake customers
const generateCustomers = () => {
    return Array.from({ length: 50 }, () => ({
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        phone: faker.phone.number(),
        type: customerTypes[Math.floor(Math.random() * customerTypes.length)],
        city: faker.location.city(),
        district: faker.location.county(),
        neighborhood: faker.location.street(),
        street: faker.location.streetAddress(),
        orders: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, () => ({
            id: faker.string.uuid(),
            product: faker.commerce.productName(),
            price: faker.commerce.price()
        }))
    }))
}

const customers = ref(generateCustomers())
const searchQuery = ref('')
const showAddCustomerModal = ref(false)
const showOrdersModal = ref(false)
const editMode = ref(false)
const selectedCustomerOrders = ref([])
const currentPage = ref(1)
const itemsPerPage = 10

const newCustomer = ref({
    id: '',
    name: '',
    phone: '',
    type: 'masa',
    city: '',
    district: '',
    neighborhood: '',
    street: '',
    orders: []
})

// Filtered customers
const filteredCustomers = computed(() => {
    let result = [...customers.value]

    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(customer =>
            customer.name.toLowerCase().includes(query) ||
            customer.phone.includes(query) ||
            customer.city.toLowerCase().includes(query) ||
            customer.district.toLowerCase().includes(query) ||
            customer.neighborhood.toLowerCase().includes(query)
        )
    }

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

const viewOrders = (customer) => {
    selectedCustomerOrders.value = customer.orders
    showOrdersModal.value = true
}

const calculateTotal = () => {
    return selectedCustomerOrders.value
        .reduce((sum, order) => sum + parseFloat(order.price), 0)
        .toFixed(2)
}

const printReceipt = () => {
    window.print()
}

const editCustomer = (customer) => {
    editMode.value = true
    newCustomer.value = { ...customer }
    showAddCustomerModal.value = true
}

const deleteCustomer = (customer) => {
    if (confirm('Bu müşteriyi silmek istediğinizden emin misiniz?')) {
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
            orders: []
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
        phone: '',
        type: 'masa',
        city: '',
        district: '',
        neighborhood: '',
        street: '',
        orders: []
    }
}

const getCustomerTypeClass = (type) => {
  const classes = {
    masa: 'bg-blue-100 text-blue-800',
    'gel-al': 'bg-green-100 text-green-800',
    online: 'bg-purple-100 text-purple-800'
  }
  return classes[type] || 'bg-gray-100 text-gray-800'
}

const getCustomerTypeLabel = (type) => {
  const labels = {
    masa: 'Masa',
    'gel-al': 'Gel-Al',
    online: 'Online'
  }
  return labels[type] || type
}
</script>

<template>
    <div class="p-6 bg-gray-100 min-h-screen">
        <!-- Header -->
        <div class="mb-6 flex justify-between items-center">
            <div>
                <h1 class="text-2xl font-bold text-gray-800">Müşteriler</h1>
                <p class="text-gray-600">Müşteri veritabanını yönetin</p>
            </div>
            <button @click="showAddCustomerModal = true"
                class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2">
                <Icon name="mdi:account-plus" />
                Yeni Müşteri Ekle
            </button>
        </div>

        <!-- Search -->
        <div class="flex items-center mb-6 gap-4">
            <div class="relative flex-1 max-w-md">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon name="mdi:magnify" class="h-5 w-5 text-gray-400" />
                </div>
                <input v-model="searchQuery" type="text" placeholder="Müşteri ara..."
                    class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
        </div>

        <!-- Customers Table -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ad Soyad
                        </th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Telefon
                        </th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Müşteri Tipi
                        </th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            İl
                        </th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            İlçe
                        </th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Mahalle
                        </th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Cadde/Sokak
                        </th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            İşlemler
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="customer in paginatedCustomers" :key="customer.id" class="hover:bg-gray-50">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            <span class="inline-block max-w-[90px] truncate">{{ customer.name }}</span>
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
                            <span class="inline-block max-w-[70px] truncate">{{ customer.city }}</span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span class="inline-block max-w-[70px] truncate">{{ customer.district }}</span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ customer.neighborhood }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ customer.street }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div class="flex gap-2">
                                <button @click="viewOrders(customer)" class="w-8 h-8 text-blue-500 bg-blue-100 rounded hover:bg-blue-200">
                                    <Icon name="mdi:eye" />
                                </button>
                                <button @click="editCustomer(customer)" class="w-8 h-8 text-green-500 bg-green-100 rounded hover:bg-green-200">
                                    <Icon name="mdi:pencil" />
                                </button>
                                <button @click="deleteCustomer(customer)" class="w-8 h-8 text-red-500 bg-red-100 rounded hover:bg-red-200">
                                    <Icon name="mdi:delete" />
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Add/Edit Customer Modal -->
        <div v-if="showAddCustomerModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg w-[500px] p-6">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-semibold">{{ editMode ? 'Müşteriyi Düzenle' : 'Yeni Müşteri Ekle' }}</h3>
                    <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
                        <Icon name="mdi:close" />
                    </button>
                </div>
                <form @submit.prevent="saveCustomer" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Ad Soyad</label>
                        <input v-model="newCustomer.name" type="text" required
                            class="mt-1 w-full p-2 border rounded-lg" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700">Telefon</label>
                        <input v-model="newCustomer.phone" type="tel" required
                            class="mt-1 w-full p-2 border rounded-lg" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700">Müşteri Tipi</label>
                        <select v-model="newCustomer.type" required class="mt-1 w-full p-2 border rounded-lg">
                            <option value="masa">Masa</option>
                            <option value="gel-al">Gel Al</option>
                            <option value="online">Online</option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700">İl</label>
                        <input v-model="newCustomer.city" type="text" required
                            class="mt-1 w-full p-2 border rounded-lg" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700">İlçe</label>
                        <input v-model="newCustomer.district" type="text" required
                            class="mt-1 w-full p-2 border rounded-lg" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700">Mahalle</label>
                        <input v-model="newCustomer.neighborhood" type="text" required
                            class="mt-1 w-full p-2 border rounded-lg" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700">Cadde/Sokak</label>
                        <input v-model="newCustomer.street" type="text" required
                            class="mt-1 w-full p-2 border rounded-lg" />
                    </div>

                    <div class="flex justify-end gap-2 mt-6">
                        <button type="button" @click="closeModal" class="px-4 py-2 !bg-red-500 text-white rounded-lg">
                            İptal
                        </button>
                        <button type="submit" class="px-4 py-2 !bg-green-500 text-white rounded-lg">
                            {{ editMode ? 'Güncelle' : 'Ekle' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- View Orders Modal -->
        <div v-if="showOrdersModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg w-[600px] p-6">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-semibold">Müşteri Siparişleri</h3>
                    <button @click="showOrdersModal = false" class="text-gray-500 hover:text-gray-700">
                        <Icon name="mdi:close" />
                    </button>
                </div>

                <div class="border rounded p-4 mb-4">
                    <!-- Receipt content -->
                    <div class="space-y-2">
                        <div v-for="order in selectedCustomerOrders" :key="order.id" class="flex justify-between">
                            <span>{{ order.product }}</span>
                            <span>{{ order.price }}</span>
                        </div>
                        <div class="border-t pt-2 font-bold">
                            <div class="flex justify-between">
                                <span>Toplam</span>
                                <span>{{ calculateTotal() }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end">
                    <button @click="printReceipt" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                        <Icon name="mdi:printer" class="mr-2" />
                        Yazdır
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>