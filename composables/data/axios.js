import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

// Create mock instance
const mock = new MockAdapter(axios)

// Mock orders data
const mockOrders = [
  {
    id: '100001',
    customer: 'Ahmet Yılmaz',
    type: 'masa', 
    tableNo: '5',
    phone: '5551234567',
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
    id: '100002',
    customer: 'Ayşe Demir',
    type: 'gel-al',
    city: 'İstanbul',
    district: 'Bulgurlu',
    neighborhood: 'Ferah Mahallesi',
    street: 'Canan Cd.',
    phone: '5551234567',
    total: 180,
    status: 'preparing',
    date: new Date('2024-01-15T14:30:00'),
    items: [
      { id: '1001', name: 'Hamburger', quantity: 2, price: 90 }
    ]
  },
  {
    id: '100003',
    customer: 'Mehmet Kaya',
    type: 'online',
    city: 'İstanbul',
    district: 'Ümraniye',
    neighborhood: 'Atatürk Mahallesi',
    street: 'Çağlayan Cd.',
    phone: '5551234567',
    total: 350,
    status: 'completed',
    date: new Date('2024-01-15T13:15:00'),
    items: [
      { id: '1001', name: 'Lahmacun', quantity: 5, price: 50 },
      { id: '1002', name: 'Ayran', quantity: 5, price: 20 }
    ]
  },
  {
    id: '100004',
    customer: 'Abdullah Özdemir',
    type: 'masa',
    tableNo: '1',
    phone: '5551234567',
    total: 150,
    status: 'ready',
    date: new Date('2024-01-15T15:30:00'),
    items: [
      { id: '1001', name: 'Pizza', quantity: 1, price: 150 },
      { id: '1002', name: 'Cola', quantity: 2, price: 15 },
      { id: '1003', name: 'Patates Kızartması', quantity: 1, price: 30 }
    ]
  },
  {
    id: '100005',
    customer: 'Ali Yılmaz',
    type: 'masa',
    tableNo: '2',
    phone: '5551234567',
    total: 150,
    status: 'ready',
    date: new Date('2024-01-15T15:30:00'),
    items: [
      { id: '1001', name: 'Pizza', quantity: 1, price: 150 },
      { id: '1002', name: 'Cola', quantity: 2, price: 15 },
      { id: '1003', name: 'Patates Kızartması', quantity: 1, price: 30 }
    ]
  },
  {
    id: '100006',
    customer: 'Cemal Yılmaz',
    type: 'masa',
    tableNo: '3',
    phone: '5551234567',
    total: 150,
    status: 'ready',
    date: new Date('2024-01-15T15:30:00'),
    items: [
      { id: '1001', name: 'Pizza', quantity: 1, price: 150 },
      { id: '1002', name: 'Cola', quantity: 2, price: 15 },
      { id: '1003', name: 'Patates Kızartması', quantity: 1, price: 30 }
    ]
  },
  {
    id: '100007',
    customer: 'Aydın Can',
    type: 'online',
    city: 'İstanbul',
    district: 'Ümraniye',
    neighborhood: 'Atatürk Mahallesi',
    street: 'Çağlayan Cd.',
    phone: '5551234567',
    total: 150,
    status: 'ready',
    date: new Date('2024-01-15T15:30:00'),
    items: [
      { id: '1001', name: 'Pizza', quantity: 1, price: 150 },
      { id: '1002', name: 'Cola', quantity: 2, price: 15 },
      { id: '1003', name: 'Patates Kızartması', quantity: 1, price: 30 }
    ]
  },
  {
    id: '100008',
    customer: 'Furkan Tarık',
    type: 'masa',
    tableNo: '4',
    phone: '5551234567',
    total: 150,
    status: 'ready',
    date: new Date('2024-01-15T15:30:00'),
    items: [
      { id: '1001', name: 'Pizza', quantity: 1, price: 150 },
      { id: '1002', name: 'Cola', quantity: 2, price: 15 },
      { id: '1003', name: 'Patates Kızartması', quantity: 1, price: 30 }
    ]
  }
]

// Mock customers data
const mockCustomers = []

// Mock tables data
const mockTables = [
  { id: 1, number: '1', status: 'empty', currentOrder: null },
  { id: 2, number: '2', status: 'empty', currentOrder: null },
  { id: 3, number: '3', status: 'empty', currentOrder: null },
  { id: 4, number: '4', status: 'empty', currentOrder: null },
  { id: 5, number: '5', status: 'empty', currentOrder: null },
  { id: 6, number: '6', status: 'empty', currentOrder: null }
]

// Setup mock endpoints
mock.onGet('/orders').reply(200, mockOrders)
mock.onGet('/customers').reply(200, mockCustomers)
mock.onPost('/customers').reply((config) => {
  const newCustomer = JSON.parse(config.data)
  
  // Mevcut müşteriyi kontrol et
  const existingCustomer = mockCustomers.find(c => 
    c.name === newCustomer.name && 
    c.type === newCustomer.type
  )

  if (existingCustomer) {
    // Mevcut müşteriyi güncelle
    Object.assign(existingCustomer, newCustomer)
    return [200, existingCustomer]
  } else {
    // Yeni müşteri ekle
    mockCustomers.push(newCustomer)
    return [200, newCustomer]
  }
})

mock.onPut('/customers/:id').reply((config) => {
  const updatedCustomer = JSON.parse(config.data)
  const customerIndex = mockCustomers.findIndex(c => c.id === updatedCustomer.id)
  
  if (customerIndex !== -1) {
    mockCustomers[customerIndex] = updatedCustomer
    
    // Update related orders
    mockOrders.forEach(order => {
      if (order.customer === updatedCustomer.name) {
        if (order.type !== 'masa') {
          order.city = updatedCustomer.city
          order.district = updatedCustomer.district
          order.neighborhood = updatedCustomer.neighborhood
          order.street = updatedCustomer.street
        }
        order.phone = updatedCustomer.phone
      }
    })
  }
  
  return [200, updatedCustomer]
})

mock.onPost('/orders').reply((config) => {
  const newOrder = JSON.parse(config.data)
  
  // Siparişi orders listesine ekle
  mockOrders.push(newOrder)

  // Masa siparişi ise tables listesini güncelle
  if (newOrder.type === 'masa') {
    const table = mockTables.find(t => t.number === newOrder.tableNo)
    if (table) {
      table.status = 'occupied'
      table.currentOrder = newOrder.id
    }
  }

  return [200, newOrder]
})

// Tables endpoint'lerini ekleyelim
mock.onGet('/tables').reply(() => [200, mockTables])

mock.onPut('/tables/:number').reply((config) => {
  const tableNumber = config.url.split('/').pop()
  const updatedTable = JSON.parse(config.data)
  const table = mockTables.find(t => t.number === tableNumber)
  
  if (table) {
    Object.assign(table, updatedTable)
    return [200, table]
  }
  
  return [404, { message: 'Table not found' }]
})

// Export API functions
export const useOrdersApi = () => {
  return {
    getOrders: () => axios.get('/orders'),
    getCustomers: () => axios.get('/customers'),
    createCustomer: (customer) => axios.post('/customers', customer),
    updateCustomer: (customer) => axios.put(`/customers/${customer.id}`, customer),
    deleteCustomer: (id) => axios.delete(`/customers/${id}`),
    createOrder: (order) => axios.post('/orders', order)
  }
}

export default axios
