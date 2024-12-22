<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'

const { getAllUsers, updateUserPassword, getCurrentUser } = useAuth()
const users = ref([])
const currentUser = ref(null)

onMounted(() => {
  users.value = getAllUsers()
  currentUser.value = getCurrentUser()
})

const showChangePasswordModal = ref(false)
const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const error = ref('')
const success = ref('')
const selectedUserEmail = ref('')

const handleChangePassword = () => {
  error.value = ''
  success.value = ''

  if (!oldPassword.value || !newPassword.value || !confirmPassword.value) {
    error.value = 'Lütfen tüm alanları doldurun'
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    error.value = 'Yeni şifreler eşleşmiyor'
    return
  }

  if (updateUserPassword(selectedUserEmail.value, newPassword.value)) {
    success.value = 'Şifre başarıyla değiştirildi'
    setTimeout(() => {
      showChangePasswordModal.value = false
      oldPassword.value = ''
      newPassword.value = ''
      confirmPassword.value = ''
    }, 1500)
  } else {
    error.value = 'Şifre değiştirilemedi'
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
    </div>

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
                <button @click="openChangePasswordModal(user.email)"
                  class="text-blue-600 hover:text-blue-900 font-medium text-sm">
                  Şifre Değiştir
                </button>
              </td>
            </tr>
          </tbody>
        </table>
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

          <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>
          <div v-if="success" class="text-green-500 text-sm">{{ success }}</div>
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
