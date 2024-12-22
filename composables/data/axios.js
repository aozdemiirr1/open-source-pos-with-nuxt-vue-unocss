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
let mockTables = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  number: String(i + 1),
  status: 'empty',
  currentOrder: null,
  customerName: null,
  customerPhone: null,
  orderTotal: null,
  orderDate: null
}))

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
    const tableNumber = String(newOrder.tableNo)
    const table = mockTables.find(t => t.number === tableNumber)
    
    if (table) {
      table.status = 'occupied'
      table.currentOrder = newOrder.id
      table.customerName = newOrder.customer
      table.customerPhone = newOrder.phone
      table.orderTotal = newOrder.total
      table.orderDate = newOrder.date
    } else {
      // Eğer masa yoksa yeni oluştur
      mockTables.push({
        id: mockTables.length + 1,
        number: tableNumber,
        status: 'occupied',
        currentOrder: newOrder.id,
        customerName: newOrder.customer,
        customerPhone: newOrder.phone,
        orderTotal: newOrder.total,
        orderDate: newOrder.date
      })
    }
  }

  return [200, newOrder]
})

// Tables endpoint'lerini güncelleyelim
mock.onGet('/tables').reply(() => {
  // Masa numaralarına göre sırala
  const sortedTables = [...mockTables].sort((a, b) => 
    Number(a.number) - Number(b.number)
  )
  return [200, sortedTables]
})

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
    createOrder: (order) => axios.post('/orders', order),
    getTables: () => axios.get('/tables'),
    updateTable: (number, table) => axios.put(`/tables/${number}`, table),
    getSettings: async () => {
      try {
        // Get settings from localStorage
        const savedSettings = localStorage.getItem('restaurantSettings')
        if (savedSettings) {
          return { data: JSON.parse(savedSettings) }
        }

        // If no settings exist, return default settings
        const defaultSettings = {
          restaurantName: '',
          address: '',
          phone: '',
          email: '',
          taxRate: 0,
          currency: 'TRY',
          language: 'tr',
          orderPrefix: '#',
          tableCount: 12,
          defaultMenuCategory: '1',
          showOutOfStockItems: false,
          allowSpecialRequests: true,
          autoConfirmOrders: false,
          orderNumberPrefix: 'SIP',
          minimumOrderAmount: 0,
          deliveryFee: 0,
          freeDeliveryThreshold: 0,
          acceptedPaymentMethods: {
            cash: true,
            creditCard: true,
            onlinePayment: false
          },
          printerEnabled: false,
          printerName: '',
          autoPrintReceipts: true,
          receiptFooterText: '',
          notifyNewOrders: true,
          notifyLowStock: true,
          notificationSound: true,
          businessHours: {
            monday: { open: '09:00', close: '22:00', isOpen: true },
            tuesday: { open: '09:00', close: '22:00', isOpen: true },
            wednesday: { open: '09:00', close: '22:00', isOpen: true },
            thursday: { open: '09:00', close: '22:00', isOpen: true },
            friday: { open: '09:00', close: '22:00', isOpen: true },
            saturday: { open: '09:00', close: '22:00', isOpen: true },
            sunday: { open: '09:00', close: '22:00', isOpen: true }
          }
        }
        
        // Save default settings
        localStorage.setItem('restaurantSettings', JSON.stringify(defaultSettings))
        return { data: defaultSettings }
      } catch (error) {
        console.error('Error in getSettings:', error)
        throw error
      }
    },
    updateSettings: async (settings) => {
      try {
        localStorage.setItem('restaurantSettings', JSON.stringify(settings))
        return { data: settings }
      } catch (error) {
        console.error('Error in updateSettings:', error)
        throw error
      }
    }
  }
}

export default axios
