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
    city: 'İstanbul',
    district: 'Kadıköy',
    neighborhood: 'Küçükçekmece',
    street: 'Atatürk Mh.',
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
    district: 'Kadıköy',
    neighborhood: 'Küçükçekmece',
    street: 'Atatürk Mh.',
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
    district: 'Kadıköy',
    neighborhood: 'Küçükçekmece',
    street: 'Atatürk Mh.',
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
    city: 'İstanbul',
    district: 'Kadıköy',
    neighborhood: 'Küçükçekmece',
    street: 'Atatürk Mh.',
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
    city: 'İstanbul',
    district: 'Kadıköy',
    neighborhood: 'Küçükçekmece',
    street: 'Atatürk Mh.',
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

// Setup mock endpoints
mock.onGet('/orders').reply(200, mockOrders)
mock.onGet('/customers').reply(200, mockCustomers)
mock.onPost('/customers').reply((config) => {
  const newCustomer = JSON.parse(config.data)
  
  // Add customer to mockCustomers
  mockCustomers.push(newCustomer)
  
  // If customer type is 'masa', create an initial order
  if (newCustomer.type === 'masa') {
    const newOrder = {
      id: `order-${Date.now()}`,
      customer: newCustomer.name,
      type: 'masa',
      tableNo: newCustomer.tableNo || '',
      city: newCustomer.city,
      district: newCustomer.district,
      neighborhood: newCustomer.neighborhood,
      street: newCustomer.street,
      phone: newCustomer.phone,
      total: 0,
      status: 'pending',
      date: new Date(),
      items: []
    }
    mockOrders.push(newOrder)
  }
  
  return [200, newCustomer]
})

mock.onPut('/customers/:id').reply((config) => {
  const updatedCustomer = JSON.parse(config.data)
  const customerIndex = mockCustomers.findIndex(c => c.id === updatedCustomer.id)
  
  if (customerIndex !== -1) {
    mockCustomers[customerIndex] = updatedCustomer
    
    // Update related orders
    mockOrders.forEach(order => {
      if (order.customer === updatedCustomer.name) {
        order.city = updatedCustomer.city
        order.district = updatedCustomer.district
        order.neighborhood = updatedCustomer.neighborhood
        order.street = updatedCustomer.street
        order.phone = updatedCustomer.phone
      }
    })
  }
  
  return [200, updatedCustomer]
})

// Export API functions
export const useOrdersApi = () => {
  return {
    getOrders: () => axios.get('/orders'),
    createCustomer: (customer) => axios.post('/customers', customer),
    updateCustomer: (customer) => axios.put(`/customers/${customer.id}`, customer),
    deleteCustomer: (id) => axios.delete(`/customers/${id}`)
  }
}

export default axios
