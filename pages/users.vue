<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'

const { getAllUsers, updateUserPassword, getCurrentUser, addUser } = useAuth()
const users = ref([])
const currentUser = ref(null)

// Modal states
const showAddUserModal = ref(false)
const showChangePasswordModal = ref(false)
const showConfirmDeleteModal = ref(false)
const showMessageModal = ref(false)

const newUser = ref({
  email: '',
  password: '',
  role: 'Şube', 
  status: 'active'
})

const messageModal = ref({
  message: '',
  type: 'success' // success or error
})

const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const error = ref('')
const success = ref('')
const selectedUserEmail = ref('')
const userToDelete = ref('')

onMounted(() => {
  users.value = getAllUsers()
  currentUser.value = getCurrentUser()
})

const showMessage = (message, type = 'success') => {
  messageModal.value.message = message
  messageModal.value.type = type
  showMessageModal.value = true
  setTimeout(() => {
    showMessageModal.value = false
  }, 2000)
}

const handleAddUser = () => {
  if (!newUser.value.email || !newUser.value.password) {
    showMessage('Lütfen tüm alanları doldurun', 'error')
    return
  }

  addUser(newUser.value)
  users.value = getAllUsers()
  showAddUserModal.value = false
  showMessage('Kullanıcı başarıyla eklendi')
  
  // Reset form
  newUser.value = {
    email: '',
    password: '',
    role: 'Şube',
    status: 'active'
  }
}

const confirmDelete = (email) => {
  userToDelete.value = email
  showConfirmDeleteModal.value = true
}

const handleDeleteUser = () => {
  const userIndex = users.value.findIndex(u => u.email === userToDelete.value)
  if (userIndex !== -1) {
    users.value.splice(userIndex, 1)
    showConfirmDeleteModal.value = false
    showMessage('Kullanıcı başarıyla silindi')
  }
}

const handleChangePassword = () => {
  error.value = ''
  success.value = ''

  if (!oldPassword.value || !newPassword.value || !confirmPassword.value) {
    showMessage('Lütfen tüm alanları doldurun', 'error')
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    showMessage('Yeni şifreler eşleşmiyor', 'error')
    return
  }

  if (updateUserPassword(selectedUserEmail.value, newPassword.value)) {
    showMessage('Şifre başarıyla değiştirildi')
    setTimeout(() => {
      showChangePasswordModal.value = false
      oldPassword.value = ''
      newPassword.value = ''
      confirmPassword.value = ''
    }, 1500)
  } else {
    showMessage('Şifre değiştirilemedi', 'error')
  }
}

const openChangePasswordModal = (email) => {
  selectedUserEmail.value = email
  showChangePasswordModal.value = true
}

const getUserTypeClass = (type) => {
  switch (type) {
    case 'Admin':
      return 'bg-purple-100 text-purple-800'
    case 'Şube':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusClass = (status) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'inactive':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
</script>

<template>
  <div class="p-6">
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
      <button @click="showAddUserModal = true"
        class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2">
        <Icon name="mdi:account-plus" />
        Yeni Kullanıcı
      </button>
    </div>

    <!-- Users Table -->
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Son Giriş</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in users" :key="user.email" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ user.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs rounded" :class="getUserTypeClass(user.role)">
                  {{ user.role }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ user.lastLogin }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs rounded" :class="getStatusClass(user.status)">
                  {{ user.status === 'active' ? 'Aktif' : 'Pasif' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <div class="flex gap-2 justify-end">
                  <button @click="openChangePasswordModal(user.email)"
                    class="w-8 h-8 text-blue-500 bg-blue-100 rounded hover:bg-blue-200">
                    <Icon name="mdi:key" />
                  </button>
                  <button @click="confirmDelete(user.email)" 
                    class="w-8 h-8 text-red-500 bg-red-100 rounded hover:bg-red-200">
                    <Icon name="mdi:delete" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add User Modal -->
    <div v-if="showAddUserModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg w-[600px] p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-semibold">Yeni Kullanıcı Ekle</h3>
          <button @click="showAddUserModal = false" class="text-gray-500 hover:text-gray-700">
            <Icon name="mdi:close" />
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input v-model="newUser.email" type="email" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
            <input v-model="newUser.password" type="password"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Rol</label>
            <select v-model="newUser.role" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option value="Şube">Şube</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <button @click="showAddUserModal = false"
            class="px-4 py-2 text-gray-600 hover:text-gray-800">
            İptal
          </button>
          <button @click="handleAddUser"
            class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            Kaydet
          </button>
        </div>
      </div>
    </div>

    <!-- Message Modal -->
    <div v-if="showMessageModal" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-[400px]">
        <div :class="messageModal.type === 'success' ? 'text-green-600' : 'text-red-600'" class="text-center text-lg font-medium">
          {{ messageModal.message }}
        </div>
      </div>
    </div>

    <!-- Confirm Delete Modal -->
    <div v-if="showConfirmDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg w-[400px] p-6">
        <h3 class="text-xl font-semibold mb-4">Kullanıcıyı Sil</h3>
        <p class="text-gray-600 mb-6">Bu kullanıcıyı silmek istediğinize emin misiniz?</p>
        <div class="flex justify-end gap-3">
          <button @click="showConfirmDeleteModal = false"
            class="px-4 py-2 text-gray-600 hover:text-gray-800">
            İptal
          </button>
          <button @click="handleDeleteUser"
            class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
            Sil
          </button>
        </div>
      </div>
    </div>

    <!-- Change Password Modal -->
    <div v-if="showChangePasswordModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg w-[600px] p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-semibold">Şifre Değiştir</h3>
          <button @click="showChangePasswordModal = false" class="text-gray-500 hover:text-gray-700">
            <Icon name="mdi:close" />
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Mevcut Şifre</label>
            <input type="password" v-model="oldPassword"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Yeni Şifre</label>
            <input type="password" v-model="newPassword"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Yeni Şifre (Tekrar)</label>
            <input type="password" v-model="confirmPassword"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <button @click="showChangePasswordModal = false" 
            class="px-4 py-2 text-gray-600 hover:text-gray-800">
            İptal
          </button>
          <button @click="handleChangePassword"
            class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            Kaydet
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
