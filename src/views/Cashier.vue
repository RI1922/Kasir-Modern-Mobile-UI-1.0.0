<template>

<MainLayout>

    <input
        v-model="search"
        placeholder="Cari produk..."
        class="search"
    >

    <div class="product-grid">

        <div
    class="product-card"
    :class="[
        'card-' + ((item.id % 4) + 1)
    ]"
            v-for="item in filteredProducts"
            :key="item.id"
            @click="addToCart(item)"
        >

            <div class="product-image">

    <img
        v-if="item.image"
        :src="item.image"
        alt=""
    >

    <span v-else>
        📦
    </span>

</div>


            <h3>{{ item.name }}</h3>

            <p>
                Rp {{ formatRupiah(item.sellingPrice) }}
            </p>

            <small>
                Stok: {{ item.stock }}
            </small>

        </div>

    </div>

    <!-- FLOATING CART -->

<button
    class="floating-cart"
    :class="{ hidden: cartOpen }"
    @click="cartOpen = true"
>
    🛒

    <span class="cart-badge">

        {{ cart.length }}

    </span>

</button>

    <!-- DRAWER -->

    <div
        v-if="cartOpen"
        class="cart-overlay"
        @click="cartOpen=false"
    >

        <div
            class="cart-drawer"
            @click.stop
        >

            <div class="drawer-header">

                <h2>Keranjang</h2>

                <button
                    class="close-btn"
                    @click="cartOpen=false"
                >
                    ✕
                </button>

            </div>

            <div
                v-if="cart.length === 0"
                class="empty-cart"
            >
                Keranjang kosong
            </div>

            <div
                v-for="item in cart"
                :key="item.id"
                class="cart-item"
            >

                <div>

                    <strong>
                        {{ item.name }}
                    </strong>

                        <p>
    Rp {{ formatRupiah(item.sellingPrice) }}
</p>
            

                </div>

<div class="action-box">

    <div class="qty-box">

        <button @click="decreaseQty(item)">-</button>

        <span>{{ item.qty }}</span>

        <button @click="increaseQty(item)">+</button>

    </div>

    <button
        class="remove-btn"
        @click="removeFromCart(item.id)"
    >
        🗑
    </button>

</div>

            </div>

            <div class="summary">

                <h3>
                    Total : Rp {{ formatRupiah(total) }}
                </h3>

                <input
                    type="number"
                    v-model.number="payment"
                    placeholder="Bayar"
                >

                <h3>
                    Kembalian : Rp {{ formatRupiah(change) }}
                </h3>

                <button
                    class="checkout-btn"
                    @click="checkout"
                >
                    Simpan Transaksi
                </button>

            </div>

        </div>

    </div>

</MainLayout>

</template>

<script setup>

import {
    showSuccess,
    showError
}
from '../utils/toast'

import {
    ref,
    computed,
    onMounted
}
from 'vue'

import MainLayout
from '../layouts/MainLayout.vue'

import { productService }
from '../services/productService'

import { categoryService }
from '../services/categoryService'

import { transactionService }
from '../services/transactionService'

import {
    settingsService
}
from '../services/settingsService'

const products = ref([])

const categories = ref([])

const search = ref('')

const cart = ref([])

const cartOpen = ref(false)

const payment = ref(0)

const settings = ref(null)

onMounted(async () => {

    await loadData()

    settings.value =
        await settingsService.getSettings()

})

const loadData = async () => {

    products.value =
        await productService.getAll()

    categories.value =
        await categoryService.getAll()

}

const filteredProducts = computed(() => {

    const keyword =
        search.value.toLowerCase()

    return products.value.filter(item => {

        const category =
            categories.value.find(
                c => c.id === item.categoryId
            )

        return (

            item.name
                ?.toLowerCase()
                .includes(keyword)

            ||

            category?.name
                ?.toLowerCase()
                .includes(keyword)

        )

    })

})

const addToCart = (product) => {

    if(product.stock <= 0){

    showError('Stok habis')
    return

}

    const exist = cart.value.find(

        x => x.id === product.id

    )

if(exist){

    if(exist.qty >= exist.stock){

        showError(
            'Stok tidak mencukupi'
        )

        return

    }

    exist.qty++

    return

}

cart.value.push({

    ...product,

    qty:1

})

}

const increaseQty = (item) => {

    if(item.qty >= item.stock){

        showError('Stok tidak mencukupi')
        return

    }

    item.qty++

}

const decreaseQty = (item) => {

    item.qty--

    if(item.qty <= 0){

        removeFromCart(item.id)

    }

}

const removeFromCart = (id) => {

    cart.value = cart.value.filter(

        item => item.id !== id

    )

}

const total = computed(() => {

    return cart.value.reduce(

        (sum,item) =>

            sum +
            (item.qty * item.sellingPrice),

        0

    )

})

const formatRupiah = (value) => {

    return new Intl.NumberFormat(
        'id-ID'
    ).format(value || 0)

}

const change = computed(() => {

    const result =
        payment.value - total.value

    return result > 0
        ? result
        : 0

})

const printReceipt = (data) => {

    const receiptWindow =
        window.open('', '_blank')

        if(!receiptWindow){

    showError(
        'Popup diblokir browser'
    )

    return

}

    receiptWindow.document.write(`

        <html>

        <head>

            <title>Struk</title>

            <style>

body{

    font-family:'Courier New', monospace;

    width:280px;

    margin:0 auto;

    padding:5px;

    font-size:13px;

    line-height:1.5;

}

.store{

    text-align:center;

}

.store-name{

    font-size:22px;

    font-weight:bold;

}

.line{

    border-top:1px dashed #000;

    margin:8px 0;

}

.row{

    display:flex;

    justify-content:space-between;

    align-items:center;

}

.detail{

    padding-left:10px;

}

.center{

    text-align:center;

}

h2{

    text-align:center;

    margin-bottom:10px;

}

.line{

    border-top:1px dashed #000;

    margin:10px 0;

}

.total{

    font-weight:bold;

}

.center{

    text-align:center;

}

</style>

        </head>

        <body>

            <div class="store">

    <div class="store-name">
        ${settings.value?.storeName || 'Kasir Modern'}
    </div>

    <div>
        Sistem Kasir Digital
    </div>

</div>

<div class="line"></div>

<div>
    Invoice :
    ${data.invoice}
</div>

<div>
    ${new Date().toLocaleString('id-ID')}
</div>

<div class="line"></div>

${data.items.map((item,index) => `

<div>

    ${index + 1}. ${item.name}

</div>

<div class="row detail">

    <span>
        ${item.qty} x ${formatRupiah(item.sellingPrice)}
    </span>

    <span>
        ${formatRupiah(
            item.qty *
            item.sellingPrice
        )}
    </span>

</div>

`).join('')}

<div class="line"></div>

<div class="row">

    <strong>Total</strong>

    <strong>
        Rp ${formatRupiah(data.total)}
    </strong>

</div>

<div class="row">

    <span>Bayar</span>

    <span>
        Rp ${formatRupiah(data.payment)}
    </span>

</div>

<div class="row">

    <span>Kembali</span>

    <span>
        Rp ${formatRupiah(data.change)}
    </span>

</div>

<div class="line"></div>

<div class="center">

    Terima Kasih

    <br>

    Selamat Berbelanja di ${settings.value?.storeName || 'Kasir Modern'}

</div>

        </body>

        </html>

    `)

    receiptWindow.document.close()

    receiptWindow.print()

}

const checkout = async () => {

    try {

        if(cart.value.length === 0){

            showError('Keranjang kosong')
            return

        }

        if(payment.value < total.value){

            showError('Uang kurang')
            return

        }

for(const item of cart.value){

    const product =
        products.value.find(
            p => p.id === item.id
        )

    if(
        !product ||
        product.stock < item.qty
    ){

        showError(
            `${item.name} stok tidak mencukupi`
        )

        await loadData()

        return
    }

}

        const profit = cart.value.reduce(

    (sum,item) =>

        sum +

        (
            (
                Number(item.sellingPrice)
                -
                Number(item.purchasePrice)
            )
            *
            Number(item.qty)
        ),

    0

)

const invoice =
    `INV-${Date.now()}-${Math.floor(Math.random()*1000)}`

        await transactionService.create({

            invoice,

            total: total.value,

            profit,

            payment: payment.value,

            change: change.value,

            items: JSON.parse(
    JSON.stringify(cart.value)
),

            createdAt: new Date()

        })



await loadData()

await Promise.all(

    cart.value.map(async item => {

        const latestProduct =
            products.value.find(
                p => p.id === item.id
            )

        if(!latestProduct){

            throw new Error(
                `Produk ${item.name} tidak ditemukan`
            )

        }

        return productService.updateStock(

            item.id,

            Math.max(
                0,
                latestProduct.stock - item.qty
            )

        )

    })

)

await loadData()




    const receiptData = {

    invoice,

    total: total.value,

    payment: payment.value,

    change: change.value,

    items: JSON.parse(
        JSON.stringify(cart.value)
    )
    
    }

        cart.value = []

        payment.value = 0

        cartOpen.value = false

showSuccess(
    'Transaksi berhasil disimpan'
)

if(
    confirm(
        'Transaksi berhasil.\n\nCetak struk sekarang?'
    )
)

{

    printReceipt(receiptData)

}
}

    catch(error){

        console.error(error)

        showError(
            'ERROR: ' +
            error.message
        )

    }

}

</script>

<style scoped>

.search{

    width:100%;
    padding:14px;

    background:#0f172a;

    color:white;

    border:none;

    border-radius:14px;

    margin-bottom:20px;
}

.search::placeholder{

    color:#94a3b8;
}

.product-grid{

    display:grid;

    grid-template-columns:
        repeat(auto-fill,minmax(220px,1fr));

    gap:20px;
}

.product-card{

    position:relative;

    overflow:hidden;

    border-radius:24px;

    padding:18px;

    cursor:pointer;

    transition:.35s ease;

    background:
        linear-gradient(
            135deg,
            #0f172a,
            #2563eb
        );

    box-shadow:
        0 10px 25px rgba(0,0,0,.25);

}

.product-card:hover{

    transform:
        translateY(-8px);

    box-shadow:
        0 20px 40px rgba(0,0,0,.45);

}

.product-card::before{

    content:'';

    position:absolute;

    top:0;

    left:-120%;

    width:80%;

    height:100%;

    background:
        linear-gradient(

            90deg,

            transparent,

            rgba(255,255,255,.15),

            transparent

        );

    transition:.7s;

}

.product-card:hover::before{

    left:120%;

}

.product-card:hover{

    transform:translateY(-3px);
}

.product-image{

    height:120px;

    border-radius:20px;

    background:
        rgba(255,255,255,.08);

    backdrop-filter:blur(8px);

    display:flex;

    align-items:center;

    justify-content:center;

    font-size:50px;

    margin-bottom:15px;

}

.product-image img{

    width:100%;
    height:100%;
    object-fit:contain;

    border-radius:20px;

}

.floating-cart{

    position:fixed;

    right:20px;

    bottom:90px;

    width:65px;

    height:65px;

    border:none;

    border-radius:50%;

    background:#2563eb;

    color:white;

    font-size:22px;

    cursor:pointer;

    z-index:999;
}

.cart-overlay{

    position:fixed;

    inset:0;

    background:rgba(0,0,0,.7);

    z-index:9999;

    display:flex;

    justify-content:center;

    align-items:center;

    padding:15px;

}

.cart-drawer{

    position:absolute;

    right:20px;
    top:20px;

    width:380px;

    min-height:auto;
height:auto;

    background:#111827;

    border-radius:24px;

    padding:20px;

    overflow:auto;

    box-shadow:
        0 20px 60px rgba(0,0,0,.5);
}

.drawer-header{

    display:flex;

    justify-content:space-between;

    align-items:center;

    margin-bottom:20px;
}

.close-btn{

    background:none;

    border:none;

    color:white;

    font-size:22px;

    cursor:pointer;
}

.cart-item{

    background:#1f2937;

    padding:12px;

    border-radius:12px;

    margin-bottom:10px;

    display:flex;

    justify-content:space-between;

    align-items:center;
}

.cart-item input{

    width:70px;
}

.summary{

    margin-top:20px;
}

.summary input{

    width:100%;

    padding:12px;

    margin:10px 0;

    border:none;

    border-radius:12px;
}

.checkout-btn{

    width:100%;

    padding:14px;

    border:none;

    border-radius:12px;

    background:#2563eb;

    color:white;

    font-weight:bold;

    cursor:pointer;
}

.empty-cart{

    text-align:center;

    opacity:.7;

    padding:30px 0;
}


.cart-badge{

    position:absolute;

    top:-5px;

    right:-5px;

    width:24px;

    height:24px;

    border-radius:50%;

    background:#ef4444;

    color:white;

    font-size:12px;

    display:flex;

    align-items:center;

    justify-content:center;
}

.qty-box{

    display:flex;

    align-items:center;

    gap:10px;
}

.qty-box button{

    width:32px;

    height:32px;

    border:none;

    border-radius:8px;

    background:#2563eb;

    color:white;

    cursor:pointer;
}

.remove-btn{

    border:none;

    background:#ef4444;

    color:white;

    padding:8px 12px;

    border-radius:8px;

    cursor:pointer;
}

.card-1{

    background:
        linear-gradient(
            135deg,
            #0f172a,
            #00ffb7
        );

}

.card-2{

    background:
        linear-gradient(
            135deg,
            #0f172a,
            #0044ff
        );

}

.card-3{

    background:
        linear-gradient(
            135deg,
            #0f172a,
            #ff8800
        );

}

.card-4{

    background:
        linear-gradient(
            135deg,
            #0f172a,
            #ff00fb
        );

}

.cart-item strong{

    display:block;

    font-size:14px;

    line-height:1.3;

    overflow:hidden;

    text-overflow:ellipsis;

}





@media(max-width:768px){

    .product-grid{

        grid-template-columns:
            repeat(2,1fr);

        gap:12px;

    }

    .product-card{

        padding:12px;

        border-radius:18px;

    }

    .product-image{

        height:90px;

        border-radius:14px;

        margin-bottom:10px;

    }

    .product-image img{

        border-radius:14px;

    }

    .product-card h3{

        font-size:15px;

        display:-webkit-box;

        -webkit-line-clamp:2;

        -webkit-box-orient:vertical;

        overflow:hidden;

        min-height:38px;

    }

    .floating-cart{

    position:fixed;

    right:20px;

    bottom:90px;

    width:62px;

    height:62px;

    border:none;

    border-radius:50%;

    background:#2563eb;

    color:white;

    font-size:28px;

    display:flex;

    align-items:center;

    justify-content:center;

    cursor:pointer;

    z-index:999;

}

}

@media(min-width:769px) and (max-width:1366px){

    .floating-cart{

    position:fixed;

    right:70px;

    bottom:70px;

    width:82px;

    height:72px;

    border:none;

    border-radius:50%;

    background:#2563eb;

    color:white;

    font-size:38px;

    display:flex;

    align-items:center;

    justify-content:center;

    cursor:pointer;

    z-index:999;

        

    }

    .product-image img{

    width:100%;
    height:100%;
    object-fit:contain;

}

    .cart-badge{

        width:28px;

        height:28px;

        font-size:24px;

        top:-6px;

        right:-6px;

    }


}

@media(min-width:900px){

    .floating-cart{

    position:fixed;

    right:70px;

    bottom:80px;

    width:82px;

    height:82px;

    border:none;

    border-radius:50%;

    background:#2563eb;

    color:white;

    font-size:38px;

    display:flex;

    align-items:center;

    justify-content:center;

    cursor:pointer;

    z-index:999;

        

    }

    .product-image img{

    width:100%;
    height:100%;
    object-fit:contain;

}

    .cart-badge{

        width:28px;

        height:28px;

        font-size:24px;

        top:-6px;

        right:-6px;

    }


}

/* ==================================
   HP LANDSCAPE
================================== */

@media (max-width: 900px) and (orientation: landscape){

    .product-grid{

        grid-template-columns:
            repeat(3,1fr);

        gap:12px;

    }

    .product-card{

        padding:12px;

        border-radius:18px;

    }

    .product-image img{

    width:100%;
    height:100%;
    object-fit:contain;

}

    .product-card h3{

        font-size:14px;

        margin-bottom:4px;

    }

    .product-card p{

        font-size:13px;

        margin-bottom:2px;

    }

    .product-card small{

        font-size:12px;

    }

}

@media (max-width:768px){

    .cart-drawer{

        position:fixed;

        top:50%;
        left:50%;

        transform:translate(-50%, -50%);

        width:95vw;

        max-width:430px;

        max-height:85vh;

        overflow-y:auto;

        padding:16px;

        border-radius:24px;

    }

    .cart-item{

        display:flex;

        justify-content:space-between;

        align-items:center;

        gap:12px;

        padding:14px;

    }

    .cart-item > div:first-child{

        flex:1;

        min-width:0;

    }

    .qty-box{

        display:flex;

        align-items:center;

        gap:4px;

    }

    .qty-box button{

        width:32px;

        height:32px;

        min-width:32px;

        font-size:16px;

        border-radius:8px;

    }

    .qty-box span{

        min-width:16px;

        font-size:14px;

        text-align:center;

    }

    .remove-btn{

        width:32px;

        height:32px;

        min-width:32px;

        border-radius:8px;

        font-size:12px;

    }

.cart-item strong{

    display:block;

    font-size:14px;

    line-height:1.3;

    overflow:hidden;

    text-overflow:ellipsis;

}

    .cart-item p{

        font-size:12px;

    }

    .summary{

        margin-top:20px;

        padding-top:15px;

        border-top:1px solid rgba(255,255,255,.1);

    }

    .summary input{

        width:100%;

        height:52px;

        background:#1f2937;

        color:white;

        border:1px solid #374151;

        border-radius:12px;

        padding:0 16px;

        font-size:18px;

        margin:15px 0;

        box-sizing:border-box;

    }

    .summary input::placeholder{

        color:#9ca3af;

    }

    .checkout-btn{

        height:54px;

        font-size:16px;

        margin-top:10px;

    }

.qty-box{

    display:flex;

    align-items:center;

    gap:6px;

}

.qty-box button{

    width:38px;

    height:38px;

    min-width:38px;

    border:none;

    border-radius:10px;

    background:#2563eb;

    color:white;

    font-size:18px;

    cursor:pointer;

}

.qty-box span{

    min-width:20px;

    text-align:center;

    color:white;

    font-weight:600;

}

.remove-btn{

    width:38px;

    height:38px;

    min-width:38px;

    padding:0;

    border:none;

    border-radius:10px;

    background:#ef4444;

    color:white;

    display:flex;

    align-items:center;

    justify-content:center;

    cursor:pointer;

}

    .cart-overlay{

    position:fixed;

    inset:0;

    background:rgba(0,0,0,.7);

    z-index:9999;

    display:flex;

    justify-content:center;

    align-items:center;

    padding:15px;

}

.qty-box button,
.remove-btn{

    width:34px;
    height:34px;

}

.qty-box span{

    min-width:18px;
    text-align:center;

}

}


.floating-cart.hidden{
    display:none;
}

.action-box{

    display:flex;

    align-items:center;

    gap:10px;

    flex-shrink:0;

}

</style>