<script setup>
import { ref, computed } from 'vue'
import { useOrdersApi } from '../composables/data/axios'

// Menü Kategorileri
const menuCategories = [
    { id: '1', name: 'Döner Menüler' },
    { id: '2', name: 'Döner Çeşitleri' },
    { id: '3', name: 'Burgerler' },
    { id: '4', name: 'Tatlılar' },
    { id: '5', name: 'İçecekler' },
    { id: '6', name: 'Pizzalar' },
    { id: '7', name: 'Kebaplar' },
    { id: '8', name: 'Pideler' },
    { id: '9', name: 'Yan Ürünler' }
]

// Ürünler
const products = [
    // Döner Menüler
    {
        id: 1,
        categoryId: '1',
        name: 'Tavuk Döner Menü',
        description: 'Patates + İçecek + Sos',
        price: 150,
        hasDrinkOption: true,
        hasSauceOption: true,
        ingredients: ['Tavuk Döner', 'Patates Kızartması', 'Domates', 'Marul', 'Soğan']
    },
    {
        id: 2,
        categoryId: '1',
        name: 'Et Döner Menü',
        description: 'Patates + İçecek + Sos',
        price: 180,
        hasDrinkOption: true,
        hasSauceOption: true,
        ingredients: ['Et Döner', 'Patates Kızartması', 'Domates', 'Marul', 'Soğan']
    },
    {
        id: 101,
        categoryId: '1',
        name: 'Karışık Döner Menü',
        description: 'Patates + İçecek + Sos',
        price: 165,
        hasDrinkOption: true,
        hasSauceOption: true,
        ingredients: ['Et Döner', 'Tavuk Döner', 'Patates Kızartması', 'Domates', 'Marul']
    },
    {
        id: 102,
        categoryId: '1',
        name: 'İskender Menü',
        description: 'Pilav + İçecek + Sos',
        price: 190,
        hasDrinkOption: true,
        hasSauceOption: true,
        ingredients: ['Et Döner', 'Pilav', 'Domates', 'Yoğurt']
    },
    {
        id: 103,
        categoryId: '1',
        name: 'Dürüm Menü',
        description: 'Patates + İçecek + Sos',
        price: 145,
        hasDrinkOption: true,
        hasSauceOption: true,
        ingredients: ['Tavuk Döner', 'Patates Kızartması', 'Domates', 'Marul']
    },
    {
        id: 104,
        categoryId: '1',
        name: 'Porsiyon Menü',
        description: 'Pilav + İçecek + Sos',
        price: 170,
        hasDrinkOption: true,
        hasSauceOption: true,
        ingredients: ['Et Döner', 'Pilav', 'Domates', 'Marul']
    },
    {
        id: 105,
        categoryId: '1',
        name: 'Çocuk Menü',
        description: 'Patates + İçecek + Sos',
        price: 120,
        hasDrinkOption: true,
        hasSauceOption: true,
        ingredients: ['Tavuk Döner', 'Patates Kızartması', 'Domates']
    },
    {
        id: 106,
        categoryId: '1',
        name: 'Aile Menü',
        description: '4 Kişilik + İçecek + Sos',
        price: 550,
        hasDrinkOption: true,
        hasSauceOption: true,
        ingredients: ['Et Döner', 'Tavuk Döner', 'Patates Kızartması', 'Pilav']
    },
    {
        id: 107,
        categoryId: '1',
        name: 'Öğrenci Menü',
        description: 'Patates + İçecek + Sos',
        price: 130,
        hasDrinkOption: true,
        hasSauceOption: true,
        ingredients: ['Tavuk Döner', 'Patates Kızartması', 'Domates']
    },

    // Döner Çeşitleri
    {
        id: 3,
        categoryId: '2',
        name: 'Yarım Ekmek Tavuk Döner',
        description: 'Bol malzemeli',
        price: 90,
        hasSauceOption: true,
        ingredients: ['Tavuk Döner', 'Domates', 'Marul', 'Soğan']
    },
    {
        id: 4,
        categoryId: '2',
        name: 'Tam Ekmek Tavuk Döner',
        description: 'Bol malzemeli',
        price: 160,
        hasSauceOption: true,
        ingredients: ['Tavuk Döner', 'Domates', 'Marul', 'Soğan']
    },
    {
        id: 5,
        categoryId: '2',
        name: 'Yarım Ekmek Et Döner',
        description: 'Bol malzemeli',
        price: 110,
        hasSauceOption: true,
        ingredients: ['Et Döner', 'Domates', 'Marul', 'Soğan']
    },
    {
        id: 6,
        categoryId: '2',
        name: 'Tam Ekmek Et Döner',
        description: 'Bol malzemeli',
        price: 200,
        hasSauceOption: true,
        ingredients: ['Et Döner', 'Domates', 'Marul', 'Soğan']
    },
    {
        id: 201,
        categoryId: '2',
        name: 'Dürüm Tavuk Döner',
        description: 'Lavaş içinde',
        price: 95,
        hasSauceOption: true,
        ingredients: ['Tavuk Döner', 'Domates', 'Marul', 'Soğan']
    },
    {
        id: 202,
        categoryId: '2',
        name: 'Dürüm Et Döner',
        description: 'Lavaş içinde',
        price: 115,
        hasSauceOption: true,
        ingredients: ['Et Döner', 'Domates', 'Marul', 'Soğan']
    },
    {
        id: 203,
        categoryId: '2',
        name: 'Porsiyon Tavuk Döner',
        description: 'Pilav ile',
        price: 130,
        hasSauceOption: true,
        ingredients: ['Tavuk Döner', 'Pilav', 'Domates', 'Marul']
    },
    {
        id: 204,
        categoryId: '2',
        name: 'Porsiyon Et Döner',
        description: 'Pilav ile',
        price: 150,
        hasSauceOption: true,
        ingredients: ['Et Döner', 'Pilav', 'Domates', 'Marul']
    },
    {
        id: 205,
        categoryId: '2',
        name: 'İskender Porsiyon',
        description: 'Tereyağlı',
        price: 170,
        hasSauceOption: true,
        ingredients: ['Et Döner', 'Pide', 'Domates', 'Yoğurt']
    },

    // Burgerler
    {
        id: 7,
        categoryId: '3',
        name: 'Klasik Burger',
        description: 'Patates + İçecek',
        price: 160,
        hasDrinkOption: true,
        hasSauceOption: true,
        ingredients: ['Dana Köfte', 'Cheddar Peyniri', 'Domates', 'Marul', 'Turşu']
    },
    {
        id: 8,
        categoryId: '3',
        name: 'Chicken Burger',
        description: 'Patates + İçecek',
        price: 140,
        hasDrinkOption: true,
        hasSauceOption: true,
        ingredients: ['Tavuk Göğsü', 'Cheddar Peyniri', 'Domates', 'Marul', 'Turşu']
    },
    {
        id: 301,
        categoryId: '3',
        name: 'Double Burger',
        description: 'Patates + İçecek',
        price: 190,
        hasDrinkOption: true,
        hasSauceOption: true,
        ingredients: ['2x Dana Köfte', '2x Cheddar Peyniri', 'Domates', 'Marul', 'Turşu']
    },
    {
        id: 302,
        categoryId: '3',
        name: 'Cheeseburger',
        description: 'Patates + İçecek',
        price: 170,
        hasDrinkOption: true,
        hasSauceOption: true,
        ingredients: ['Dana Köfte', '2x Cheddar Peyniri', 'Domates', 'Marul', 'Turşu']
    },
    {
        id: 303,
        categoryId: '3',
        name: 'Mushroom Burger',
        description: 'Patates + İçecek',
        price: 175,
        hasDrinkOption: true,
        hasSauceOption: true,
        ingredients: ['Dana Köfte', 'Mantar', 'Cheddar Peyniri', 'Domates', 'Marul']
    },
    {
        id: 304,
        categoryId: '3',
        name: 'BBQ Burger',
        description: 'Patates + İçecek',
        price: 180,
        hasDrinkOption: true,
        hasSauceOption: true,
        ingredients: ['Dana Köfte', 'BBQ Sos', 'Cheddar Peyniri', 'Soğan Halkası']
    },
    {
        id: 305,
        categoryId: '3',
        name: 'Spicy Chicken Burger',
        description: 'Patates + İçecek',
        price: 150,
        hasDrinkOption: true,
        hasSauceOption: true,
        ingredients: ['Acılı Tavuk', 'Cheddar Peyniri', 'Domates', 'Marul']
    },
    {
        id: 306,
        categoryId: '3',
        name: 'Fish Burger',
        description: 'Patates + İçecek',
        price: 145,
        hasDrinkOption: true,
        hasSauceOption: true,
        ingredients: ['Balık Fileto', 'Tartar Sos', 'Marul']
    },
    {
        id: 307,
        categoryId: '3',
        name: 'Veggie Burger',
        description: 'Patates + İçecek',
        price: 140,
        hasDrinkOption: true,
        hasSauceOption: true,
        ingredients: ['Sebze Köftesi', 'Domates', 'Marul', 'Turşu']
    },

    // Tatlılar
    {
        id: 9,
        categoryId: '4',
        name: 'Künefe',
        description: 'Antep Fıstıklı',
        price: 100,
        ingredients: ['Kadayıf', 'Peynir', 'Antep Fıstığı']
    },
    {
        id: 10,
        categoryId: '4',
        name: 'Baklava',
        description: '4 Dilim',
        price: 120,
        ingredients: ['Antep Fıstığı', 'Ceviz']
    },
    {
        id: 401,
        categoryId: '4',
        name: 'Sütlaç',
        description: 'Fırında',
        price: 60,
        ingredients: ['Süt', 'Pirinç', 'Tarçın']
    },
    {
        id: 402,
        categoryId: '4',
        name: 'Kazandibi',
        description: 'Klasik',
        price: 65,
        ingredients: ['Süt', 'Un', 'Vanilya']
    },
    {
        id: 403,
        categoryId: '4',
        name: 'Profiterol',
        description: 'Çikolata Soslu',
        price: 80,
        ingredients: ['Krema', 'Çikolata Sos']
    },
    {
        id: 404,
        categoryId: '4',
        name: 'Trileçe',
        description: 'Karamelli',
        price: 75,
        ingredients: ['Süt', 'Karamel Sos']
    },
    {
        id: 405,
        categoryId: '4',
        name: 'Dondurma',
        description: '3 Top',
        price: 50,
        ingredients: ['Çikolata', 'Vanilya', 'Çilek']
    },
    {
        id: 406,
        categoryId: '4',
        name: 'Kemalpaşa',
        description: 'Şerbetli',
        price: 70,
        ingredients: ['Un', 'Şerbet']
    },
    {
        id: 407,
        categoryId: '4',
        name: 'Kadayıf',
        description: 'Cevizli',
        price: 85,
        ingredients: ['Kadayıf', 'Ceviz']
    },

    // İçecekler
    {
        id: 501,
        categoryId: '5',
        name: 'Cola',
        description: '330ml',
        price: 30
    },
    {
        id: 502,
        categoryId: '5',
        name: 'Fanta',
        description: '330ml',
        price: 30
    },
    {
        id: 503,
        categoryId: '5',
        name: 'Sprite',
        description: '330ml',
        price: 30
    },
    {
        id: 504,
        categoryId: '5',
        name: 'Ayran',
        description: '300ml',
        price: 20
    },
    {
        id: 505,
        categoryId: '5',
        name: 'Su',
        description: '500ml',
        price: 10
    },
    {
        id: 506,
        categoryId: '5',
        name: 'Şalgam',
        description: '300ml',
        price: 25
    },
    {
        id: 507,
        categoryId: '5',
        name: 'Ice Tea',
        description: '330ml',
        price: 30
    },
    {
        id: 508,
        categoryId: '5',
        name: 'Meyve Suyu',
        description: '330ml',
        price: 25
    },
    {
        id: 509,
        categoryId: '5',
        name: 'Limonata',
        description: '300ml',
        price: 35
    },

    // Pizzalar
    {
        id: 11,
        categoryId: '6',
        name: 'Margarita Pizza',
        description: 'Domates sos, mozarella peyniri, fesleğen',
        price: 140,
        hasDrinkOption: true,
        ingredients: ['Domates Sos', 'Mozarella', 'Fesleğen']
    },
    {
        id: 12,
        categoryId: '6',
        name: 'Karışık Pizza',
        description: 'Sucuk, sosis, mantar, zeytin',
        price: 160,
        hasDrinkOption: true,
        ingredients: ['Domates Sos', 'Mozarella', 'Sucuk', 'Sosis', 'Mantar', 'Zeytin']
    },
    {
        id: 601,
        categoryId: '6',
        name: 'Ton Balıklı Pizza',
        description: 'Ton balığı, soğan, mısır',
        price: 165,
        hasDrinkOption: true,
        ingredients: ['Domates Sos', 'Mozarella', 'Ton Balığı', 'Soğan', 'Mısır']
    },
    {
        id: 602,
        categoryId: '6',
        name: 'Mantarlı Pizza',
        description: 'Mantar, kaşar peyniri',
        price: 145,
        hasDrinkOption: true,
        ingredients: ['Domates Sos', 'Mozarella', 'Mantar']
    },
    {
        id: 603,
        categoryId: '6',
        name: 'Dört Peynirli Pizza',
        description: 'Mozarella, rokfor, parmesan, kaşar',
        price: 170,
        hasDrinkOption: true,
        ingredients: ['Domates Sos', 'Mozarella', 'Rokfor', 'Parmesan', 'Kaşar']
    },
    {
        id: 604,
        categoryId: '6',
        name: 'Tavuklu Pizza',
        description: 'Tavuk, mantar, mısır',
        price: 155,
        hasDrinkOption: true,
        ingredients: ['Domates Sos', 'Mozarella', 'Tavuk', 'Mantar', 'Mısır']
    },
    {
        id: 605,
        categoryId: '6',
        name: 'Vejeteryan Pizza',
        description: 'Biber, mantar, mısır, zeytin',
        price: 150,
        hasDrinkOption: true,
        ingredients: ['Domates Sos', 'Mozarella', 'Biber', 'Mantar', 'Mısır', 'Zeytin']
    },
    {
        id: 606,
        categoryId: '6',
        name: 'Sucuklu Pizza',
        description: 'Sucuk, biber, mantar',
        price: 160,
        hasDrinkOption: true,
        ingredients: ['Domates Sos', 'Mozarella', 'Sucuk', 'Biber', 'Mantar']
    },
    {
        id: 607,
        categoryId: '6',
        name: 'BBQ Pizza',
        description: 'BBQ sos, tavuk, soğan',
        price: 165,
        hasDrinkOption: true,
        ingredients: ['BBQ Sos', 'Mozarella', 'Tavuk', 'Soğan']
    },

    // Kebaplar
    {
        id: 13,
        categoryId: '7',
        name: 'Adana Kebap',
        description: 'Acılı kebap, yanında bulgur pilavı',
        price: 180,
        hasDrinkOption: true,
        ingredients: ['Kıyma', 'Bulgur Pilavı', 'Közlenmiş Biber']
    },
    {
        id: 14,
        categoryId: '7',
        name: 'Urfa Kebap',
        description: 'Acısız kebap, yanında bulgur pilavı',
        price: 170,
        hasDrinkOption: true,
        ingredients: ['Kıyma', 'Bulgur Pilavı', 'Közlenmiş Biber']
    },
    {
        id: 701,
        categoryId: '7',
        name: 'Beyti Kebap',
        description: 'Lavaşa sarılı, yoğurt soslu',
        price: 190,
        hasDrinkOption: true,
        ingredients: ['Kıyma', 'Lavaş', 'Yoğurt Sos']
    },
    {
        id: 702,
        categoryId: '7',
        name: 'Kuzu Şiş',
        description: 'Kuzu eti, yanında pilav',
        price: 200,
        hasDrinkOption: true,
        ingredients: ['Kuzu Eti', 'Pilav', 'Közlenmiş Biber']
    },
    {
        id: 703,
        categoryId: '7',
        name: 'Tavuk Şiş',
        description: 'Tavuk eti, yanında pilav',
        price: 160,
        hasDrinkOption: true,
        ingredients: ['Tavuk Eti', 'Pilav', 'Közlenmiş Biber']
    },
    {
        id: 704,
        categoryId: '7',
        name: 'Patlıcanlı Kebap',
        description: 'Patlıcan, kıyma, yanında pilav',
        price: 185,
        hasDrinkOption: true,
        ingredients: ['Kıyma', 'Patlıcan', 'Pilav']
    },
    {
        id: 705,
        categoryId: '7',
        name: 'İskender Kebap',
        description: 'Döner, yoğurt, tereyağlı sos',
        price: 195,
        hasDrinkOption: true,
        ingredients: ['Döner', 'Yoğurt', 'Tereyağlı Sos']
    },
    {
        id: 706,
        categoryId: '7',
        name: 'Çöp Şiş',
        description: 'Kuzu eti, yanında pilav',
        price: 175,
        hasDrinkOption: true,
        ingredients: ['Kuzu Eti', 'Pilav', 'Közlenmiş Biber']
    },
    {
        id: 707,
        categoryId: '7',
        name: 'Karışık Kebap',
        description: 'Adana, Urfa, Şiş, yanında pilav',
        price: 220,
        hasDrinkOption: true,
        ingredients: ['Adana Kebap', 'Urfa Kebap', 'Kuzu Şiş', 'Pilav']
    },

    // Pideler
    {
        id: 15,
        categoryId: '8',
        name: 'Kıymalı Pide',
        description: 'Özel kıyma harcı ile',
        price: 130,
        hasDrinkOption: true,
        ingredients: ['Kıyma', 'Soğan', 'Maydanoz']
    },
    {
        id: 16,
        categoryId: '8',
        name: 'Kaşarlı Pide',
        description: 'Bol kaşarlı',
        price: 120,
        hasDrinkOption: true,
        ingredients: ['Kaşar Peyniri']
    },
    {
        id: 801,
        categoryId: '8',
        name: 'Kuşbaşılı Pide',
        description: 'Dana kuşbaşı et ile',
        price: 150,
        hasDrinkOption: true,
        ingredients: ['Kuşbaşı Et', 'Soğan', 'Biber']
    },
    {
        id: 802,
        categoryId: '8',
        name: 'Karışık Pide',
        description: 'Kıyma, kaşar, kuşbaşı',
        price: 160,
        hasDrinkOption: true,
        ingredients: ['Kıyma', 'Kaşar', 'Kuşbaşı Et']
    },
    {
        id: 803,
        categoryId: '8',
        name: 'Sucuklu Pide',
        description: 'Sucuk, kaşar',
        price: 140,
        hasDrinkOption: true,
        ingredients: ['Sucuk', 'Kaşar Peyniri']
    },
    {
        id: 804,
        categoryId: '8',
        name: 'Yumurtalı Pide',
        description: 'Yumurta, kaşar',
        price: 125,
        hasDrinkOption: true,
        ingredients: ['Yumurta', 'Kaşar Peyniri']
    },
    {
        id: 805,
        categoryId: '8',
        name: 'Pastırmalı Pide',
        description: 'Pastırma, kaşar',
        price: 155,
        hasDrinkOption: true,
        ingredients: ['Pastırma', 'Kaşar Peyniri']
    },
    {
        id: 806,
        categoryId: '8',
        name: 'Kavurmalı Pide',
        description: 'Et kavurma, kaşar',
        price: 145,
        hasDrinkOption: true,
        ingredients: ['Kavurma', 'Kaşar Peyniri']
    },
    {
        id: 807,
        categoryId: '8',
        name: 'Peynirli Pide',
        description: 'Beyaz peynir, kaşar',
        price: 130,
        hasDrinkOption: true,
        ingredients: ['Beyaz Peynir', 'Kaşar Peyniri']
    },

    // Yan Ürünler
    {
        id: 17,
        categoryId: '9',
        name: 'Patates Kızartması',
        description: 'Çıtır patates',
        price: 50,
        hasSauceOption: true
    },
    {
        id: 18,
        categoryId: '9',
        name: 'Soğan Halkası',
        description: 'Çıtır soğan halkası',
        price: 45,
        hasSauceOption: true
    },
    {
        id: 901,
        categoryId: '9',
        name: 'Çıtır Tavuk',
        description: '8 parça',
        price: 70,
        hasSauceOption: true
    },
    {
        id: 902,
        categoryId: '9',
        name: 'Nugget',
        description: '10 parça',
        price: 65,
        hasSauceOption: true
    },
    {
        id: 903,
        categoryId: '9',
        name: 'Mozzarella Stick',
        description: '6 parça',
        price: 60,
        hasSauceOption: true
    },
    {
        id: 904,
        categoryId: '9',
        name: 'Bulgur Pilavı',
        description: 'Domatesli',
        price: 40
    },
    {
        id: 905,
        categoryId: '9',
        name: 'Pirinç Pilavı',
        description: 'Tereyağlı',
        price: 40
    },
    {
        id: 906,
        categoryId: '9',
        name: 'Mercimek Çorbası',
        description: 'Günlük',
        price: 35
    },
    {
        id: 907,
        categoryId: '9',
        name: 'Ezme Salata',
        description: 'Acılı',
        price: 35
    }
]

// İçecekler
const drinks = [
    { id: 'cola', name: 'Cola', price: 30 },
    { id: 'fanta', name: 'Fanta', price: 30 },
    { id: 'sprite', name: 'Sprite', price: 30 },
    { id: 'ayran', name: 'Ayran', price: 20 },
    { id: 'su', name: 'Su', price: 10 },
    { id: 'salgam', name: 'Şalgam', price: 25 },
    { id: 'icetea-seftali', name: 'Ice Tea Şeftali', price: 30 },
    { id: 'icetea-limon', name: 'Ice Tea Limon', price: 30 },
    { id: 'meyvesuyu-visne', name: 'Vişne Suyu', price: 25 },
    { id: 'meyvesuyu-seftali', name: 'Şeftali Suyu', price: 25 },
    { id: 'gazoz', name: 'Gazoz', price: 25 },
    { id: 'limonata', name: 'Limonata', price: 35 }
]

// Soslar
const sauces = [
    { id: 'mayonez', name: 'Mayonez', price: 5 },
    { id: 'ketcap', name: 'Ketçap', price: 5 },
    { id: 'aci', name: 'Acı Sos', price: 5 },
    { id: 'ranch', name: 'Ranch Sos', price: 8 },
    { id: 'barbeku', name: 'Barbekü Sos', price: 8 }
]

// Reactive States
const showSuccessModal = ref(false)
const activeCategory = ref('1')
const selectedProduct = ref(null)
const selectedExtras = ref({
    drink: null,
    sauces: []
})
const selectedIngredients = ref([])
const orderNotes = ref('')
const cart = ref([])
const showReceipt = ref(false)
const currentOrder = ref(null)

// Sipariş Bilgileri
const orderType = ref('')
const tableNumber = ref('')
const customerName = ref('')
const customerPhone = ref('')
const customerCity = ref('')
const customerDistrict = ref('')
const customerNeighborhood = ref('')
const customerStreet = ref('')

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
    customerCity.value = ''
    customerDistrict.value = ''
    customerNeighborhood.value = ''
    customerStreet.value = ''
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

    if ((orderType.value === 'online' || orderType.value === 'gel-al') && !customerName.value) {
        alert('Lütfen müşteri adı girin')
        return
    }

    if ((orderType.value === 'online' || orderType.value === 'gel-al') && 
        (!customerCity.value || !customerDistrict.value || !customerNeighborhood.value || !customerStreet.value)) {
        alert('Lütfen adres bilgilerini eksiksiz girin')
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
        customerCity: customerCity.value,
        customerDistrict: customerDistrict.value,
        customerNeighborhood: customerNeighborhood.value,
        customerStreet: customerStreet.value
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

const completeOrder = async () => {
  try {
    // Form validasyonu
    if (!orderType.value) {
      alert('Lütfen sipariş tipini seçin')
      return
    }

    if (orderType.value === 'masa') {
      if (!tableNumber.value || !customerName.value || !customerPhone.value) {
        alert('Lütfen masa numarası, müşteri adı ve telefon numarası girin')
        return
      }
    }

    const ordersApi = useOrdersApi()
    
    // Sipariş bilgilerini hazırla
    const order = {
      id: `order-${Date.now()}`,
      customer: customerName.value,
      type: orderType.value,
      tableNo: orderType.value === 'masa' ? tableNumber.value : null,
      phone: customerPhone.value,
      city: customerCity.value,
      district: customerDistrict.value,
      neighborhood: customerNeighborhood.value,
      street: customerStreet.value,
      total: cartTotal.value,
      status: 'pending',
      date: new Date(),
      items: cart.value
    }

    // Siparişi kaydet
    await ordersApi.createOrder(order)

    // Başarı modalını göster
    showSuccessModal.value = true
    
    // 2 saniye sonra modalı kapat ve formu temizle
    setTimeout(() => {
      showSuccessModal.value = false
      resetForm()
    }, 2000)
    
  } catch (error) {
    console.error('Error completing order:', error)
    alert('Sipariş oluşturulurken bir hata oluştu')
  }
}

const resetForm = () => {
  cart.value = []
  selectedProduct.value = null
  orderType.value = ''
  tableNumber.value = ''
  customerName.value = ''
  customerPhone.value = ''
  customerCity.value = ''
  customerDistrict.value = ''
  customerNeighborhood.value = ''
  customerStreet.value = ''
  orderNotes.value = ''
}

const closeReceipt = () => {
    showReceipt.value = false
    currentOrder.value = null
    cart.value = []
}

const saveOrder = async () => {
  try {
    const ordersApi = useOrdersApi()
    
    // Sipariş bilgilerini hazırla
    const order = {
      id: `order-${Date.now()}`,
      customer: customerName.value,
      type: orderType.value,
      tableNo: orderType.value === 'masa' ? tableNumber.value : null,
      phone: customerPhone.value,
      city: customerCity.value,
      district: customerDistrict.value,
      neighborhood: customerNeighborhood.value,
      street: customerStreet.value,
      total: cartTotal.value,
      status: 'pending',
      date: new Date(),
      items: cart.value.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        extras: item.extras,
        removedIngredients: item.removedIngredients,
        notes: item.notes
      }))
    }

    // Müşteri bilgilerini hazırla
    const customer = {
      id: `customer-${Date.now()}`,
      name: customerName.value,
      type: orderType.value,
      status: 'active',
      tableNo: orderType.value === 'masa' ? tableNumber.value : null,
      phone: orderType.value !== 'masa' ? customerPhone.value : null,
      city: orderType.value !== 'masa' ? order.city : null,
      district: orderType.value !== 'masa' ? order.district : null,
      neighborhood: orderType.value !== 'masa' ? order.neighborhood : null,
      street: orderType.value !== 'masa' ? order.street : null
    }

    // Önce müşteriyi kaydet
    await ordersApi.createCustomer(customer)
    
    // Sonra siparişi kaydet
    await ordersApi.createOrder(order)

    // Başarılı mesajı göster ve formu temizle
    alert('Sipariş başarıyla oluşturuldu')
    closeReceipt()
    
  } catch (error) {
    console.error('Error saving order:', error)
    alert('Sipariş oluşturulurken bir hata oluştu')
  }
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
                <div class="bg-white rounded shadow-sm p-4 h-full overflow-auto">
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
                                            item.orderType === 'gel-al' ? `Müşteri: ${item.customerName}` :
                                                `Online - ${item.customerName}` }}
                                    </p>
                                    <p v-if="item.extras.drink" class="text-sm text-gray-600">
                                        İçecek: {{ drinks.find(d => d.id === item.extras.drink)?.name }}
                                    </p>
                                    <p v-if="item.extras.sauces.length" class="text-sm text-gray-600">
                                        Soslar: {{ item.extras.sauces.map(s => sauces.find(sauce => sauce.id ===
                                        s)?.name).join(', ') }}
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

                        <div class="pt-4">
                            <div class="flex justify-between font-medium">
                                <span>Toplam</span>
                                <span>₺{{ cartTotal }}</span>
                            </div>
                        </div>

                        <button @click="completeOrder" class="w-full px-4 py-2 bg-green-500 text-white rounded-lg">
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
                        <div v-for="category in menuCategories" :key="category.id" @click="activeCategory = category.id"
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
                    <div class="grid grid-cols-3 gap-6">
                        <div v-for="product in filteredProducts" :key="product.id"
                            class="bg-white rounded shadow-sm p-6 cursor-pointer transition-all transform"
                            @click="showProductModal(product)">
                            <div class="mb-4">
                                <h3 class="text-lg font-semibold">{{ product.name }}</h3>
                                <p class="text-gray-600 text-xs mt-1">{{ product.description }}</p>
                                
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-md  text-gray-600">₺{{ product.price }}</span>
                                <button class="text-sm  text-blue-500 flex items-center">
                                    <Icon name="mdi:cart-plus" class="text-lg" /> <span class="ml-1">Sepete Ekle</span>
                                </button>
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
                            <select v-model="orderType"
                                class="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">Seçiniz</option>
                                <option value="masa">Masa</option>
                                <option value="gel-al">Gel-Al</option>
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
                            
                            <label class="block text-sm font-medium text-gray-700 mt-3 mb-1">Müşteri Adı Soyadı</label>
                            <input v-model="customerName" type="text" class="w-full p-2 border rounded-lg">
                            
                            <label class="block text-sm font-medium text-gray-700 mt-3 mb-1">Telefon Numarası</label>
                            <input v-model="customerPhone" type="text" class="w-full p-2 border rounded-lg">
                        </div>

                        <template v-if="orderType === 'gel-al' || orderType === 'online'">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Müşteri Adı</label>
                                <input v-model="customerName" type="text" class="w-full p-2 border rounded-lg">
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Telefon Numarası</label>
                                <input v-model="customerPhone" type="text" class="w-full p-2 border rounded-lg">
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">İl</label>
                                <input v-model="customerCity" type="text" class="w-full p-2 border rounded-lg">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">İlçe</label>
                                <input v-model="customerDistrict" type="text" class="w-full p-2 border rounded-lg">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Mahalle</label>
                                <input v-model="customerNeighborhood" type="text" class="w-full p-2 border rounded-lg">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Cadde/Sokak</label>
                                <input v-model="customerStreet" type="text" class="w-full p-2 border rounded-lg">
                            </div>
                        </template>
                    </div>

                    <!-- İçecek Seçimi -->
                    <div v-if="selectedProduct.hasDrinkOption">
                        <h4 class="font-medium mb-2">İçecek Seçimi</h4>
                        <div class="relative">
                            <select v-model="selectedExtras.drink"
                                class="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
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
                            <div v-for="sauce in sauces" :key="sauce.id" @click="selectedExtras.sauces.includes(sauce.id) ?
                                selectedExtras.sauces = selectedExtras.sauces.filter(id => id !== sauce.id) :
                                selectedExtras.sauces.push(sauce.id)" :class="[
                                        'px-3 py-1.5 rounded cursor-pointer border text-xs transition-colors',
                                        selectedExtras.sauces.includes(sauce.id)
                                            ? 'bg-green-50 border-green-500 text-green-700'
                                            : 'border-gray-300 hover:border-green-500'
                                    ]">
                                {{ sauce.name }} (+₺{{ sauce.price }})
                            </div>
                        </div>
                    </div>

                    <!-- Malzeme Çıkarma -->
                    <div v-if="selectedProduct.ingredients?.length">
                        <h4 class="font-medium mb-2">Malzemeler</h4>
                        <div class="flex flex-wrap gap-2">
                            <div v-for="ing in selectedProduct.ingredients" :key="ing" @click="selectedIngredients.includes(ing) ?
                                selectedIngredients = selectedIngredients.filter(i => i !== ing) :
                                selectedIngredients.push(ing)" :class="[
                                        'px-3 py-1.5 rounded text-xs cursor-pointer border transition-colors',
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

        <!-- Fiş Modal -->
        <div v-if="showReceipt" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg w-[400px] p-6">
                <div class="text-center border-b pb-4 mb-4">
                    <h3 class="text-xl font-bold">Sipariş Fişi</h3>
                    <p class="text-gray-500 text-sm">{{ new Date(currentOrder.date).toLocaleString() }}</p>
                    <p class="text-gray-500 text-sm">Sipariş No: #{{ currentOrder.id }}</p>
                </div>

                <div class="space-y-4">
                    <!-- Müşteri Bilgileri -->
                    <div class="border-b pb-4">
                        <h4 class="font-medium mb-2">Sipariş Bilgileri</h4>
                        <p class="text-sm">
                            <span class="font-medium">Sipariş Tipi:</span>
                            {{ currentOrder.orderDetails.orderType === 'masa' ? 'Masa' :
                                currentOrder.orderDetails.orderType === 'gel-al' ? 'Gel-Al' : 'Online' }}
                        </p>
                        <template v-if="currentOrder.orderDetails.orderType === 'masa'">
                            <p class="text-sm">
                                <span class="font-medium">Masa No:</span> {{ currentOrder.orderDetails.tableNumber }}
                            </p>
                        </template>
                        <template v-else>
                            <p class="text-sm">
                                <span class="font-medium">Müşteri:</span> {{ currentOrder.orderDetails.customerName }}
                            </p>
                            <template v-if="currentOrder.orderDetails.orderType === 'online'">
                                <p class="text-sm">
                                    <span class="font-medium">Telefon:</span> {{ currentOrder.orderDetails.customerPhone }}
                                </p>
                                <p class="text-sm">
                                    <span class="font-medium">Adres:</span> {{ currentOrder.orderDetails.customerAddress }}
                                </p>
                            </template>
                        </template>
                    </div>

                    <!-- Ürünler -->
                    <div class="space-y-3">
                        <div v-for="item in currentOrder.items" :key="item.id" class="text-sm">
                            <div class="flex justify-between">
                                <span>{{ item.name }} x{{ item.quantity }}</span>
                                <span>₺{{ calculateItemTotal(item) }}</span>
                            </div>
                            <div v-if="item.extras.drink" class="text-gray-600 ml-4">
                                + {{ drinks.find(d => d.id === item.extras.drink)?.name }}
                            </div>
                            <div v-if="item.extras.sauces.length" class="text-gray-600 ml-4">
                                + {{ item.extras.sauces.map(s => sauces.find(sauce => sauce.id === s)?.name).join(', ') }}
                            </div>
                            <div v-if="item.notes" class="text-gray-500 italic ml-4">
                                Not: {{ item.notes }}
                            </div>
                        </div>
                    </div>

                    <!-- Toplam -->
                    <div class="border-t pt-4">
                        <div class="flex justify-between font-bold">
                            <span>Toplam</span>
                            <span>₺{{ currentOrder.total }}</span>
                        </div>
                    </div>

                    <button @click="closeReceipt" class="w-full px-4 py-2 bg-green-500 text-white rounded-lg mt-4">
                        Tamam
                    </button>
                </div>
            </div>
        </div>

        <!-- Success Modal -->
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="transform opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="transform opacity-0"
        >
          <div v-if="showSuccessModal" class="fixed inset-0 flex items-center justify-center z-50">
            <div class="fixed inset-0 bg-black opacity-30"></div>
            <div class="bg-white rounded-lg p-6 shadow-xl z-10 transform transition-all">
              <div class="flex items-center justify-center mb-4">
                <div class="bg-green-100 rounded-full p-3">
                  <svg class="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </div>
              <h3 class="text-lg font-medium text-center text-gray-900 mb-2">
                Sipariş Başarıyla Oluşturuldu
              </h3>
              <p class="text-sm text-gray-500 text-center">
                Sipariş detaylarını siparişler sayfasından görüntüleyebilirsiniz.
              </p>
            </div>
          </div>
        </Transition>
    </div>
</template>
