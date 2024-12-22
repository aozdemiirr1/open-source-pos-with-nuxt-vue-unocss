<template>
    <div class="left-menu h-screen w-64 bg-gray-800 text-white fixed left-0 top-0">
        <div class="p-4 border-b border-gray-700 flex items-center gap-3">
            <Icon name="mdi:cash-register" class="text-2xl" />
            <h2 class="text-xl font-bold">{{ getUserDisplayName() }}</h2>
        </div>

        <nav class="p-4">
            <ul class="space-y-2">
                <li v-for="item in menuItems" :key="item.id">
                    <div v-if="item.title" class="mb-1 mt-4">
                        <span class="text-xs uppercase text-gray-400">{{ item.title }}</span>
                    </div>
                    <NuxtLink :to="item.path"
                        class="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-gray-700/50 transition-colors duration-200"
                        :class="{ 'bg-gray-700': $route.path === item.path }">
                        <Icon :name="item.icon" class="text-xl text-gray-300" />
                        <span class="font-medium text-sm">{{ item.label }}</span>
                    </NuxtLink>
                </li>
            </ul>
        </nav>

        <div class="absolute bottom-0 left-0 w-full p-4 border-t border-gray-700">
            <div class="flex items-center gap-3 py-2 cursor-pointer" @click="handleLogout">
                <div class="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                    <Icon name="mdi:logout" class="text-xl" />
                </div>
                <div>
                    <p class="text-sm font-medium">{{ getUserDisplayName() }}</p>
                    <p class="text-xs text-gray-400">{{ getCurrentUser()?.email }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAuth } from '../composables/useAuth'
import { useRouter } from 'vue-router'
import { computed } from 'vue'


const currentUser = ref(null)

const { logout, getCurrentUser, isAdmin, getUserDisplayName } = useAuth()
const router = useRouter()
currentUser.value = getCurrentUser()

const handleLogout = () => {
    logout()
    router.push('/login')
}

const menuItems = computed(() => {
    const baseItems = [
        {
            id: 1,
            title: 'Main',
            label: 'Dashboard',
            icon: 'mdi:view-dashboard',
            path: '/'
        },
        {
            id: 2,
            title: 'Operations',
            label: 'Siparişler',
            icon: 'mdi:clipboard-list',
            path: '/orders'
        },
        {
            id: 3,
            label: 'Yeni Sipariş',
            icon: 'mdi:plus-circle',
            path: '/new-order'
        },
        {
            id: 4,
            label: 'Masalar',
            icon: 'mdi:table-furniture',
            path: '/tables'
        },
        {
            id: 5,
            title: 'Management',
            label: 'Müşteriler',
            icon: 'mdi:account-group',
            path: '/customers'
        }
    ]

    // Add settings for non-admin users only
    if (!isAdmin()) {
        baseItems.push({
            id: 8,
            title: 'Settings',
            label: 'Ayarlar',
            icon: 'mdi:cog',
            path: '/settings'
        })
    }

    // Add admin-only menu items
    if (isAdmin()) {
        baseItems.push(
            {
                id: 7,
                title: 'System',
                label: 'Kullanıcılar',
                icon: 'mdi:account-cog',
                path: '/users'
            }
        )
    }

    return baseItems
})
</script>

<style scoped>
.left-menu {
    box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
}
</style>