<script setup>
import { ref, computed } from 'vue'

// Menü Kategorileri
const menuCategories = [
    { id: '1', name: 'Hızlı Menü' },
    { id: '2', name: 'Yarım Ekmek' },
    { id: '3', name: 'Tam Ekmek' },
    { id: '4', name: 'Burgerler' },
]

// Ürünler
const products = [
    {
        id: 1,
        categoryId: '1',
        name: 'Tavuk Döner Menü',
        description: 'Patates + İçecek',
        price: 120,
        hasDrinkOption: true,
        hasSauceOption: true,
        ingredients: ['Tavuk Döner', 'Domates', 'Marul', 'Soğan']
    },
    {
        id: 2,
        categoryId: '1',
        name: 'Et    Döner Menü',
        description: 'Patates + İçecek',
        price: 120,
        hasDrinkOption: true,
        hasSauceOption: true,
        ingredients: ['Et Döner', 'Domates', 'Marul', 'Soğan']
    },
    {
        id: 3,
        categoryId: '2',
        name: 'Yarım Ekmek Döner',
        description: 'Bol malzemeli',
        price: 85,
        hasSauceOption: true,
        ingredients: ['Döner', 'Domates', 'Marul', 'Soğan']
    },
    {
        id: 3,
        categoryId: '3',
        name: 'Tam Ekmek Döner',
        description: 'Bol malzemeli',
        price: 100,
        hasSauceOption: true,
        ingredients: ['Döner', 'Domates', 'Marul', 'Soğan']
    },
    {
        id: 4,
        categoryId: '4',
        name: 'Burger',
        description: 'Burger',
        price: 100,
        hasSauceOption: true,
        ingredients: ['Döner', 'Domates', 'Marul', 'Soğan']
    }
]

// İçecekler
const drinks = [
    { id: 'cola', name: 'Cola', price: 10 },
    { id: 'fanta', name: 'Fanta', price: 10 },
    { id: 'ayran', name: 'Ayran', price: 8 },
    { id: 'su', name: 'Su', price: 5 }
]

// Soslar
const sauces = [
    { id: 'mayonez', name: 'Mayonez', price: 2 },
    { id: 'ketcap', name: 'Ketçap', price: 2 },
    { id: 'aci', name: 'Acı Sos', price: 2 },
    { id: 'ranch', name: 'Ranch Sos', price: 3 }
]

// Reactive States
const activeCategory = ref('1')
const selectedProduct = ref(null)
const selectedExtras = ref({
    drink: null,
    sauces: []
})
const selectedIngredients = ref([])
const orderNotes = ref('')
const cart = ref([])

// Sipariş Bilgileri
const orderType = ref('')
const tableNumber = ref('')
const customerName = ref('')
const customerPhone = ref('')
const customerAddress = ref('')

// Computed Properties
const filteredProducts = computed(() => {
    return products.filter(p => p.categoryId === activeCategory.value)
})

const cartTotal = computed(() => {
    return cart.value.reduce((total, item) => {
        return total + calculateItemTotal(item)
    }, 0)
})

// Methods
const showProductModal = (product) => {
    selectedProduct.value = product
    selectedExtras.value = { drink: null, sauces: [] }
    selectedIngredients.value = product.ingredients ? [...product.ingredients] : []
    orderNotes.value = ''
    orderType.value = ''
    tableNumber.value = ''
    customerName.value = ''
    customerPhone.value = ''
    customerAddress.value = ''
}

const calculateItemTotal = (item) => {
    let total = item.price * item.quantity

    if (item.extras.drink) {
        total += drinks.find(d => d.id === item.extras.drink)?.price || 0
    }

    item.extras.sauces?.forEach(sauceId => {
        total += sauces.find(s => s.id === sauceId)?.price || 0
    })

    return total
}

const addToCart = () => {
    if (!selectedProduct.value) return

    // Validasyon
    if (!orderType.value) {
        alert('Lütfen sipariş tipini seçin')
        return
    }

    if (orderType.value === 'masa' && !tableNumber.value) {
        alert('Lütfen masa numarası girin')
        return
    }

    if (orderType.value !== 'masa' && !customerName.value) {
        alert('Lütfen müşteri adı girin')
        return
    }

    if (orderType.value === 'online' && (!customerPhone.value || !customerAddress.value)) {
        alert('Lütfen telefon ve adres bilgilerini girin')
        return
    }

    const cartItem = {
        id: Date.now(),
        productId: selectedProduct.value.id,
        name: selectedProduct.value.name,
        price: selectedProduct.value.price,
        quantity: 1,
        extras: {
            drink: selectedExtras.value.drink,
            sauces: selectedExtras.value.sauces
        },
        removedIngredients: selectedProduct.value.ingredients?.filter(
            ing => !selectedIngredients.value.includes(ing)
        ),
        notes: orderNotes.value,
        orderType: orderType.value,
        tableNumber: tableNumber.value,
        customerName: customerName.value,
        customerPhone: customerPhone.value,
        customerAddress: customerAddress.value
    }

    cart.value.push(cartItem)
    selectedProduct.value = null
}

const increaseQuantity = (item) => {
    item.quantity++
}

const decreaseQuantity = (item) => {
    if (item.quantity > 1) {
        item.quantity--
    } else {
        cart.value = cart.value.filter(i => i.id !== item.id)
    }
}

const completeOrder = () => {
    const order = {
        id: Date.now(),
        items: [...cart.value],
        total: cartTotal.value,
        status: 'pending',
        date: new Date()
    }

    console.log('Sipariş oluşturuldu:', order)
    cart.value = []
}
</script>

<template>
    <div class="h-screen flex flex-col bg-gray-100">
        <!-- Header -->
        <div class="p-6">
            <div class="mb-6 flex justify-between items-center">
                <div>
                    <h1 class="text-2xl font-bold text-gray-800">Yeni Sipariş</h1>
                    <p class="text-gray-600">Yeni sipariş oluşturun</p>
                </div>
            </div>
        </div>

        <div class="flex flex-1 gap-6 p-6 pt-0 overflow-hidden">
            <!-- Sol Panel: Sepet -->
            <div class="w-1/3">
                <div class="bg-white rounded-lg shadow-sm p-4 h-full overflow-auto">
                    <h3 class="text-lg font-semibold mb-4">Sepet</h3>

                    <div v-if="cart.length === 0" class="text-center py-8 text-gray-500">
                        Sepet boş
                    </div>

                    <div v-else class="space-y-4">
                        <div v-for="item in cart" :key="item.id" class="border-b pb-4">
                            <div class="flex justify-between items-start">
                                <div>
                                    <h4 class="font-medium">{{ item.name }}</h4>
                                    <p class="text-sm text-gray-600">
                                        {{ item.orderType === 'masa' ? `Masa: ${item.tableNumber}` : 
                                           item.orderType === 'gelal' ? `Müşteri: ${item.customerName}` :
                                           `Online - ${item.customerName}` }}
                                    </p>
                                    <p v-if="item.extras.drink" class="text-sm text-gray-600">
                                        İçecek: {{ drinks.find(d => d.id === item.extras.drink)?.name }}
                                    </p>
                                    <p v-if="item.extras.sauces.length" class="text-sm text-gray-600">
                                        Soslar: {{ item.extras.sauces.map(s => sauces.find(sauce => sauce.id === s)?.name).join(', ') }}
                                    </p>
                                    <p v-if="item.notes" class="text-sm text-gray-500 italic">
                                        Not: {{ item.notes }}
                                    </p>
                                </div>
                                <div class="text-right">
                                    <p class="font-medium">₺{{ calculateItemTotal(item) }}</p>
                                    <div class="flex items-center gap-2 mt-2">
                                        <button @click="decreaseQuantity(item)"
                                            class="w-6 h-6 bg-gray-100 rounded">-</button>
                                        <span>{{ item.quantity }}</span>
                                        <button @click="increaseQuantity(item)"
                                            class="w-6 h-6 bg-gray-100 rounded">+</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="border-t pt-4">
                            <div class="flex justify-between font-medium">
                                <span>Toplam</span>
                                <span>₺{{ cartTotal }}</span>
                            </div>
                        </div>

                        <button @click="completeOrder"
                            class="w-full px-4 py-2 bg-green-500 text-white rounded-lg">
                            Siparişi Tamamla
                        </button>
                    </div>
                </div>
            </div>

            <!-- Sağ Panel: Menü -->
            <div class="w-2/3 overflow-hidden flex flex-col">
                <!-- Menü Kategorileri -->
                <div class="mb-4">
                    <div class="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        <div v-for="category in menuCategories" :key="category.id" 
                            @click="activeCategory = category.id"
                            :class="[
                                'px-3 py-1.5 text-sm rounded-lg whitespace-nowrap cursor-pointer transition-colors',
                                activeCategory === category.id
                                    ? 'bg-blue-100 text-blue-700 font-medium'
                                    : 'text-gray-600 hover:bg-gray-50'
                            ]">
                            {{ category.name }}
                        </div>
                    </div>
                </div>

                <!-- Ürünler Grid -->
                <div class="overflow-auto">
                    <div class="grid grid-cols-2 gap-6">
                        <div v-for="product in filteredProducts" :key="product.id"
                            class="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-lg transition-all transform hover:-translate-y-1"
                            @click="showProductModal(product)">
                            <div class="mb-4">
                                <h3 class="text-lg font-semibold">{{ product.name }}</h3>
                                <p class="text-gray-600 mt-1">{{ product.description }}</p>
                                <div class="flex flex-wrap items-center gap-2 mt-2">
                                    <span v-for="ing in product.ingredients" :key="ing"
                                        class="text-xs bg-gray-100 px-2 py-1 rounded-full">
                                        {{ ing }}
                                    </span>
                                </div>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-xl font-bold text-blue-600">₺{{ product.price }}</span>
                                <div class="text-sm text-blue-500">Seçenekleri Gör →</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Ürün Detay Modal -->
        <div v-if="selectedProduct" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg w-[500px] max-h-[90vh] overflow-auto p-6">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-semibold">{{ selectedProduct.name }}</h3>
                    <button @click="selectedProduct = null" class="text-gray-500 hover:text-gray-700">
                        <Icon name="mdi:close" />
                    </button>
                </div>

                <div class="space-y-4">
                    <!-- Sipariş Tipi -->
                    <div>
                        <h4 class="font-medium mb-2">Sipariş Tipi</h4>
                        <div class="relative">
                            <select v-model="orderType" class="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">Seçiniz</option>
                                <option value="masa">Masa</option>
                                <option value="gelal">Gel-Al</option>
                                <option value="online">Online</option>
                            </select>
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Icon name="mdi:clipboard-list" class="text-lg text-gray-400" />
                            </div>
                            <div class="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                                <Icon name="mdi:chevron-down" class="text-gray-400" />
                            </div>
                        </div>
                    </div>

                    <!-- Sipariş Bilgileri -->
                    <div v-if="orderType" class="space-y-3">
                        <div v-if="orderType === 'masa'">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Masa Numarası</label>
                            <input v-model="tableNumber" type="number" class="w-full p-2 border rounded-lg">
                        </div>

                        <div v-if="orderType !== 'masa'">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Müşteri Adı</label>
                            <input v-model="customerName" type="text" class="w-full p-2 border rounded-lg">
                        </div>

                        <template v-if="orderType === 'online'">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                                <input v-model="customerPhone" type="tel" class="w-full p-2 border rounded-lg">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Adres</label>
                                <textarea v-model="customerAddress" class="w-full p-2 border rounded-lg" rows="2"></textarea>
                            </div>
                        </template>
                    </div>

                    <!-- İçecek Seçimi -->
                    <div v-if="selectedProduct.hasDrinkOption">
                        <h4 class="font-medium mb-2">İçecek Seçimi</h4>
                        <div class="relative">
                            <select v-model="selectedExtras.drink" class="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">İçecek Seçiniz</option>
                                <option v-for="drink in drinks" :key="drink.id" :value="drink.id">
                                    {{ drink.name }} (+₺{{ drink.price }})
                                </option>
                            </select>
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Icon name="mdi:cup" class="text-lg text-gray-400" />
                            </div>
                            <div class="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                                <Icon name="mdi:chevron-down" class="text-gray-400" />
                            </div>
                        </div>
                    </div>

                    <!-- Sos Seçimi -->
                    <div v-if="selectedProduct.hasSauceOption">
                        <h4 class="font-medium mb-2">Sos Seçimi</h4>
                        <div class="flex flex-wrap gap-2">
                            <div v-for="sauce in sauces" :key="sauce.id" 
                                @click="selectedExtras.sauces.includes(sauce.id) ? 
                                    selectedExtras.sauces = selectedExtras.sauces.filter(id => id !== sauce.id) : 
                                    selectedExtras.sauces.push(sauce.id)"
                                :class="[
                                    'px-3 py-1.5 rounded-lg cursor-pointer border transition-colors',
                                    selectedExtras.sauces.includes(sauce.id)
                                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                                        : 'border-gray-300 hover:border-blue-500'
                                ]">
                                {{ sauce.name }} (+₺{{ sauce.price }})
                            </div>
                        </div>
                    </div>

                    <!-- Malzeme Çıkarma -->
                    <div v-if="selectedProduct.ingredients?.length">
                        <h4 class="font-medium mb-2">Malzemeler</h4>
                        <div class="flex flex-wrap gap-2">
                            <div v-for="ing in selectedProduct.ingredients" :key="ing"
                                @click="selectedIngredients.includes(ing) ? 
                                    selectedIngredients = selectedIngredients.filter(i => i !== ing) : 
                                    selectedIngredients.push(ing)"
                                :class="[
                                    'px-3 py-1.5 rounded-lg cursor-pointer border transition-colors',
                                    selectedIngredients.includes(ing)
                                        ? 'bg-green-50 border-green-500 text-green-700'
                                        : 'bg-red-50 border-red-500 text-red-700'
                                ]">
                                {{ ing }}
                            </div>
                        </div>
                    </div>

                    <!-- Notlar -->
                    <div>
                        <h4 class="font-medium mb-2">Özel Not</h4>
                        <textarea v-model="orderNotes" class="w-full p-2 border rounded-lg" rows="2"
                            placeholder="Varsa özel isteklerinizi yazın..."></textarea>
                    </div>

                    <div class="flex justify-end gap-2">
                        <button @click="selectedProduct = null" class="px-4 py-2 bg-gray-500 text-white rounded-lg">
                            İptal
                        </button>
                        <button @click="addToCart" class="px-4 py-2 bg-green-500 text-white rounded-lg">
                            Sepete Ekle
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>