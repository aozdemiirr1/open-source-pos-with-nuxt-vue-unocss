<script setup lang="ts">
import { ref } from 'vue'

const settings = ref({
    companyInfo: {
        name: 'Restoran Adı',
        address: 'Restoran Adresi',
        phone: '0212 123 45 67',
        email: 'info@restoran.com',
        taxNumber: '1234567890'
    },
    printSettings: {
        showLogo: true,
        showAddress: true,
        showPhone: true,
        showEmail: true,
        showTaxNumber: true,
        footerText: 'Bizi tercih ettiğiniz için teşekkür ederiz!'
    },
    tableSettings: {
        totalTables: 12,
        defaultServiceTime: 60 // dakika
    },
    orderSettings: {
        allowOnlineOrders: true,
        minOrderAmount: 50,
        deliveryFee: 15,
        maxDeliveryDistance: 5 // km
    }
})

const saveSettings = () => {
    // Ayarları kaydet
    console.log('Ayarlar kaydedildi:', settings.value)
}
</script>

<template>
    <div class="p-6 bg-gray-100 min-h-screen">
        <!-- Header -->
        <div class="flex justify-between items-center">
            <div class="mb-6">
                <h1 class="text-2xl font-bold text-gray-800">Ayarlar</h1>
                <p class="text-gray-600">Sistem ayarlarını yönetin</p>
            </div>
            <div>
                <button @click="saveSettings"
                    class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 flex items-center gap-2">
                    <Icon name="mdi:content-save" />
                    Ayarları Kaydet
                </button>
            </div>
        </div>

        <div class="space-y-6">
            <!-- İşletme Bilgileri -->
            <div class="bg-white rounded-lg shadow p-6">
                <h2 class="text-lg font-semibold mb-4">İşletme Bilgileri</h2>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">İşletme Adı</label>
                        <input v-model="settings.companyInfo.name" type="text"
                            class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                        <input v-model="settings.companyInfo.phone" type="text"
                            class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                        <input v-model="settings.companyInfo.email" type="email"
                            class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Vergi No</label>
                        <input v-model="settings.companyInfo.taxNumber" type="text"
                            class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div class="col-span-2">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Adres</label>
                        <textarea v-model="settings.companyInfo.address"
                            class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" rows="2"></textarea>
                    </div>
                </div>
            </div>

            <!-- Yazıcı Ayarları -->
            <div class="bg-white rounded-lg shadow p-6">
                <h2 class="text-lg font-semibold mb-4">Fiş Yazdırma Ayarları</h2>
                <div class="space-y-3">
                    <div class="flex items-center">
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" v-model="settings.printSettings.showLogo" class="sr-only peer">
                            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                            <span class="ml-2 text-sm text-gray-700">Logo Göster</span>
                        </label>
                    </div>
                    <div class="flex items-center">
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" v-model="settings.printSettings.showAddress" class="sr-only peer">
                            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                            <span class="ml-2 text-sm text-gray-700">Adres Göster</span>
                        </label>
                    </div>
                    <div class="flex items-center">
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" v-model="settings.printSettings.showPhone" class="sr-only peer">
                            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                            <span class="ml-2 text-sm text-gray-700">Telefon Göster</span>
                        </label>
                    </div>
                    <div class="flex items-center">
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" v-model="settings.printSettings.showEmail" class="sr-only peer">
                            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                            <span class="ml-2 text-sm text-gray-700">E-posta Göster</span>
                        </label>
                    </div>
                    <div class="flex items-center">
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" v-model="settings.printSettings.showTaxNumber" class="sr-only peer">
                            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                            <span class="ml-2 text-sm text-gray-700">Vergi No Göster</span>
                        </label>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Fiş Alt Metni</label>
                        <input v-model="settings.printSettings.footerText" type="text"
                            class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" />
                    </div>
                </div>
            </div>

            <!-- Masa Ayarları -->
            <div class="bg-white rounded-lg shadow p-6">
                <h2 class="text-lg font-semibold mb-4">Masa Ayarları</h2>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Toplam Masa Sayısı</label>
                        <input v-model="settings.tableSettings.totalTables" type="number"
                            class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Varsayılan Servis Süresi
                            (dk)</label>
                        <input v-model="settings.tableSettings.defaultServiceTime" type="number"
                            class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" />
                    </div>
                </div>
            </div>

            <!-- Sipariş Ayarları -->
            <div class="bg-white rounded-lg shadow p-6">
                <h2 class="text-lg font-semibold mb-4">Sipariş Ayarları</h2>
                <div class="space-y-4">
                    <div class="flex items-center">
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" v-model="settings.orderSettings.allowOnlineOrders" class="sr-only peer">
                            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                            <span class="ml-2 text-sm text-gray-700">Online Siparişleri Kabul Et</span>
                        </label>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Minimum Sipariş Tutarı
                                (₺)</label>
                            <input v-model="settings.orderSettings.minOrderAmount" type="number"
                                class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Teslimat Ücreti (₺)</label>
                            <input v-model="settings.orderSettings.deliveryFee" type="number"
                                class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Maksimum Teslimat Mesafesi
                                (km)</label>
                            <input v-model="settings.orderSettings.maxDeliveryDistance" type="number"
                                class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
