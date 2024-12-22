<template>
  <div>
    <LeftMenu v-if="isAuthenticated && $route.path !== '/login'" />
    <div :class="{ 'pl-64': isAuthenticated && $route.path !== '/login' }">
      <NuxtLayout />
    </div>
  </div>
</template>

<script setup>  
import '@unocss/reset/tailwind.css'

import { useAuth } from './composables/useAuth'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const { isAuthenticated, checkAuth } = useAuth()
const router = useRouter()

onMounted(() => {
  if (!checkAuth() && router.currentRoute.value.path !== '/login') {
    router.push('/login')
  }
})
</script>
