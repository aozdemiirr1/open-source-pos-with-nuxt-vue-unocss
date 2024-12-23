import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

// Create axios instance
const api = axios.create({
  baseURL: '/api'
})

// Create mock adapter
const mock = new MockAdapter(api)

// Mock data for orders
const mockOrders = [
  {
    id: 'order-1',
    customer: 'Ahmet Yılmaz',
    type: 'masa',
    tableNo: '1',
    total: 150,
    status: 'pending',
    date: new Date(),
    items: [
      { id: 1, name: 'Tavuk Döner', quantity: 2, price: 75 }
    ]
  },
  {
    id: 'order-2',
    customer: 'Mehmet Demir',
    type: 'masa',
    tableNo: '3',
    total: 200,
    status: 'preparing',
    date: new Date(),
    items: [
      { id: 2, name: 'Et Döner', quantity: 1, price: 200 }
    ]
  }
]

// Mock data for tables
const mockTables = Array.from({ length: 12 }, (_, index) => {
  const tableNo = (index + 1).toString()
  const tableOrder = mockOrders.find(order => 
    order.type === 'masa' && 
    order.tableNo === tableNo && 
    ['pending', 'preparing', 'ready'].includes(order.status)
  )

  if (tableOrder) {
    return {
      id: tableOrder.id,
      number: index + 1,
      status: 'active',
      customer: tableOrder.customer,
      startTime: tableOrder.date,
      items: tableOrder.items,
      total: tableOrder.total
    }
  }

  return {
    id: `table-${index + 1}`,
    number: index + 1,
    status: 'empty',
    customer: null,
    startTime: null,
    items: [],
    total: 0
  }
})

// Mock API endpoints
mock.onGet('/orders').reply(200, mockOrders)
mock.onGet('/tables').reply(200, mockTables)

// Create new order
mock.onPost('/orders').reply((config) => {
  const newOrder = JSON.parse(config.data)
  newOrder.id = `order-${mockOrders.length + 1}`
  mockOrders.push(newOrder)
  return [201, newOrder]
})

// Update order status
mock.onPut(/\/orders\/\w+/).reply((config) => {
  const orderId = config.url?.split('/').pop()
  const orderIndex = mockOrders.findIndex(o => o.id === orderId)
  
  if (orderIndex === -1) {
    return [404, { message: 'Order not found' }]
  }

  const updatedOrder = { ...mockOrders[orderIndex], ...JSON.parse(config.data) }
  mockOrders[orderIndex] = updatedOrder
  return [200, updatedOrder]
})

// Export API service
export const useOrdersApi = () => {
  return {
    getOrders: () => api.get('/orders'),
    getTables: () => api.get('/tables'),
    createOrder: (order: any) => api.post('/orders', order),
    updateOrder: (orderId: string, data: any) => api.put(`/orders/${orderId}`, data)
  }
} 