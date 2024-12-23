<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { login } = useAuth()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  try {
    loading.value = true
    error.value = ''

    if (!email.value || !password.value) {
      error.value = 'Lütfen tüm alanları doldurun'
      return
    }

    // Only allow admin login
    const isAdminEmail = email.value === 'admin@gmail.com'
    if (!isAdminEmail) {
      error.value = 'Bu giriş paneli sadece admin girişi içindir.'
      return
    }

    if (login(email.value, password.value)) {
      router.push('/')
    } else {
      error.value = 'Geçersiz email veya şifre'
    }
  } catch (err) {
    error.value = 'Giriş yapılırken bir hata oluştu'
  } finally {
    loading.value = false
  }
}

const goToBranchLogin = () => {
  router.push('/branch-login')
}
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white/95 backdrop-blur-sm p-10 rounded-2xl shadow-2xl">
      <div>
        <div class="flex justify-center">
          <div class="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Icon name="mdi:cash-register" class="text-4xl text-white" />
          </div>
        </div>
        <h2 class="mt-8 text-center text-3xl font-extrabold text-gray-900">
          Admin Paneli
        </h2>
        <p class="mt-3 text-center text-sm text-gray-600">
          Lütfen admin hesabınıza giriş yapın
        </p>
      </div>

      <form class="mt-10 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-5">
          <div class="relative">
            <label for="email" class="text-sm font-medium text-gray-700 mb-1 block">Email</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="mdi:email" class="h-5 w-5 text-gray-400" />
              </div>
              <input v-model="email" id="email" name="email" type="email" required
                class="pl-10 appearance-none rounded-lg block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
                placeholder="Admin email adresinizi girin">
            </div>
          </div>

          <div class="relative">
            <label for="password" class="text-sm font-medium text-gray-700 mb-1 block">Şifre</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="mdi:lock" class="h-5 w-5 text-gray-400" />
              </div>
              <input v-model="password" id="password" name="password" type="password" required
                class="pl-10 appearance-none rounded-lg block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
                placeholder="Şifrenizi girin">
            </div>
          </div>
        </div>

        <div v-if="error" class="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center border border-red-200">
          {{ error }}
        </div>

        <div>
          <button type="submit" :disabled="loading"
            class="group relative w-full flex justify-center py-3 px-4 border border-blue-600 text-sm font-medium rounded-lg text-white !bg-blue-600 hover:bg-blue-700 hover:border-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition duration-150 ease-in-out shadow-lg hover:shadow-xl">
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <Icon name="mdi:login" class="h-5 w-5 text-blue-200" />
            </span>
            {{ loading ? 'Giriş yapılıyor...' : 'Giriş Yap' }}
          </button>
          <button @click="goToBranchLogin"
            class="mt-5 group relative w-full flex justify-center py-3 px-4 border border-gray-200 text-sm font-medium rounded-lg text-dark !bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition duration-150 ease-in-out shadow-lg hover:shadow-xl">
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <Icon name="mdi:login" class="h-5 w-5 text-dark" />
            </span>
            Şube Girişi İçin Tıklayın
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
