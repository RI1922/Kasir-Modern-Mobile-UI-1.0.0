<template>

<MainLayout>

    <div class="page-header">

        <button
            class="btn-primary"
            @click="openCreate"
        >
            + Tambah Produk
        </button>

    </div>

    <div class="search-box">

        <input
            v-model="search"
            type="text"
            placeholder="Cari produk..."
        >

    </div>

    <!-- MOBILE CARD -->

<div class="mobile-products">

    <div
        v-for="item in filteredProducts"
        :key="item.id"
        class="product-card"
    >

        <img
            v-if="item.image"
            :src="item.image"
            class="product-card-image"
        >

        <div class="product-card-info">

            <h3>
                {{ item.name }}
            </h3>

            <p>
                📂 {{ item.categoryName }}
            </p>

            <p>
                🏷 {{ item.brandName }}
            </p>

            <p>
                💰 Rp {{ item.sellingPrice }}
            </p>

            <p>
                📦 Stok : {{ item.stock }}
            </p>

        </div>

        <div class="product-card-actions">

            <button
                class="btn-edit"
                @click="openEdit(item)"
            >
                Edit
            </button>

            <button
                class="btn-delete"
                @click="remove(item.id)"
            >
                Hapus
            </button>

        </div>

    </div>

</div>

    <div class="table-card">

        <table>

            <thead>

                <tr>
                    <th>No</th>
                    <th width="120">Gambar</th>
                    <th>Nama</th>
                    <th>Kategori</th>
                    <th>Brand</th>
                    <th>Harga Jual</th>
                    <th>Stok</th>
                    <th>Aksi</th>
                </tr>

            </thead>

            <tbody>

                <tr
                    v-for="(item,index) in filteredProducts"
                    :key="item.id"
                >

                    <td>{{ index + 1 }}</td>

                    <td>

    <img
        v-if="item.image"
        :src="item.image"
        class="product-thumb"
    >

</td>

<td>{{ item.name }}</td>

                    <td>{{ item.categoryName }}</td>

                    <td>{{ item.brandName }}</td>

                    <td>
                        Rp {{ item.sellingPrice }}
                    </td>

                    <td>
                        {{ item.stock }}
                    </td>

                    <td>

                        <button
                            class="btn-edit"
                            @click="openEdit(item)"
                        >
                            Edit
                        </button>

                        <button
                            class="btn-delete"
                            @click="remove(item.id)"
                        >
                            Hapus
                        </button>

                    </td>

                </tr>

            </tbody>

        </table>

    </div>

    <div
    v-if="showModal"
    class="modal"
>

    <div class="modal-content">

        <h2>
            Tambah Produk
        </h2>

        <input
            v-model="form.name"
            placeholder="Nama Produk"
        >

        <select
            v-model="form.categoryId"
        >

            <option value="">
                Pilih Kategori
            </option>

            <option
                v-for="item in categories"
                :key="item.id"
                :value="item.id"
            >
                {{ item.name }}
            </option>

        </select>

        <select
            v-model="form.brandId"
        >

            <option value="">
                Pilih Brand
            </option>

            <option
                v-for="item in brands"
                :key="item.id"
                :value="item.id"
            >
                {{ item.name }}
            </option>

        </select>

        <input
            v-model="form.barcode"
            placeholder="Barcode"
        >

        <input
            v-model="form.purchasePrice"
            type="number"
            placeholder="Harga Beli"
        >

        <input
            v-model="form.sellingPrice"
            type="number"
            placeholder="Harga Jual"
        >

        <input
            v-model="form.stock"
            type="number"
            placeholder="Stok"
        >

        <input
    type="file"
    accept="image/*"
    @change="handleImageUpload"
>

        <div class="modal-actions">

            <button
                class="btn-primary"
                @click="save"
            >
                Simpan
            </button>

            <button
                class="btn-delete"
                @click="showModal=false"
            >
                Batal
            </button>

        </div>

    </div>

</div>

</MainLayout>

</template>

<script setup>

import {
    ref,
    computed,
    onMounted
} from 'vue'

import MainLayout from '../layouts/MainLayout.vue'

import { productService }
from '../services/productService'

import { categoryService }
from '../services/categoryService'

import { brandService }
from '../services/brandService'

const search = ref('')

const products = ref([])

const categories = ref([])

const brands = ref([])

const showModal = ref(false)

const editMode = ref(false)

const currentId = ref(null)

const form = ref({

    name:'',

    categoryId:'',

    brandId:'',

    barcode:'',

    purchasePrice:0,

    sellingPrice:0,

    stock:0,

    image:''

})

const loadData = async () => {

    categories.value =
        await categoryService.getAll()

    brands.value =
        await brandService.getAll()

    const data =
        await productService.getAll()

    products.value = data.map(product => {

        const category =
            categories.value.find(
                c => c.id == product.categoryId
            )

        const brand =
            brands.value.find(
                b => b.id == product.brandId
            )

        return {

            ...product,

            categoryName:
                category?.name || '-',

            brandName:
                brand?.name || '-'

        }

    })

}

onMounted(loadData)

const filteredProducts = computed(() => {

    return products.value.filter(item =>

        item.name
            .toLowerCase()
            .includes(
                search.value.toLowerCase()
            )

    )

})

const openCreate = () => {

    editMode.value = false

    currentId.value = null

    form.value = {

        name:'',

        categoryId:'',

        brandId:'',

        barcode:'',

        purchasePrice:0,

        sellingPrice:0,

        stock:0,

        image:''

    }

    showModal.value = true

}

const openEdit = (item) => {

    editMode.value = true

    currentId.value = item.id

    form.value = {

        name:item.name,

        categoryId:item.categoryId,

        brandId:item.brandId,

        barcode:item.barcode,

        purchasePrice:item.purchasePrice,

        sellingPrice:item.sellingPrice,

        stock:item.stock,

        image:item.image || ''

    }

    showModal.value = true

}

const remove = async(id) => {

    if(
        !confirm(
            'Hapus produk ini?'
        )
    ) return

    await productService.delete(id)

    await loadData()

}

const handleImageUpload = (event) => {

    const file =
        event.target.files[0]

    if(!file) return

    const reader =
        new FileReader()

    reader.onload = (e) => {

        form.value.image =
            e.target.result

    }

    reader.readAsDataURL(file)

}

const save = async () => {

    if(editMode.value){

        await productService.update(

            currentId.value,

            form.value

        )

    }else{

        await productService.create({

            ...form.value,

            createdAt:new Date()

        })

    }

    await loadData()

    showModal.value = false

}

</script>

<style scoped>

.page-header{
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin-bottom:20px;
}

.search-box{
    margin-bottom:20px;
}

.search-box input{
    width:100%;
    padding:14px;
    border:none;
    border-radius:14px;
    background:#111827;
    color:white;
}

.table-card{
    background:#111827;
    border-radius:20px;
    overflow:hidden;
}

table{
    width:100%;
    border-collapse:collapse;
}

th,
td{
    padding:16px;
    text-align:left;
}

th{
    background:#1f2937;
}

tr{
    border-bottom:1px solid #1f2937;
}

.btn-primary{
    background:#2563eb;
    color:white;
    border:none;
    padding:12px 18px;
    border-radius:12px;
    cursor:pointer;
}

.btn-edit{
    background:#f59e0b;
    color:white;
    border:none;
    padding:8px 12px;
    border-radius:10px;
    margin-right:8px;
}

.btn-delete{
    background:#ef4444;
    color:white;
    border:none;
    padding:8px 12px;
    border-radius:10px;
}

.modal{

    position:fixed;

    inset:0;

    background:rgba(0,0,0,.7);

    display:flex;

    justify-content:center;

    align-items:center;

}

.modal-content{

    width:500px;

    max-width:95%;

    background:#111827;

    padding:24px;

    border-radius:20px;

    display:flex;

    flex-direction:column;

    gap:12px;

}

.modal-content input,
.modal-content select{

    padding:12px;

    border:none;

    border-radius:12px;

    background:#1f2937;

    color:white;

}

.modal-actions{

    display:flex;

    gap:10px;

}

.product-thumb{

    width:80px;

    height:80px;

    object-fit:cover;

    object-position:center;

    border-radius:12px;

    display:block;

    border:2px solid #1f2937;

    background:#111827;

}

/* MOBILE PRODUCT CARD */

.mobile-products{

    display:none;

}

.product-card{

    background:#111827;

    border-radius:16px;

    padding:12px;

    margin-bottom:12px;

    display:flex;

    gap:12px;

    align-items:center;

}

.product-card-image{

    width:60px;

    height:60px;

    border-radius:12px;

    object-fit:cover;

    flex-shrink:0;

}

.product-card-info{

    flex:1;

}

.product-card-info h3{

    font-size:14px;

    margin-bottom:4px;

}

.product-card-info p{

    font-size:11px;

    margin:2px 0;

    opacity:.85;

}

.product-card-actions{

    display:flex;

    flex-direction:column;

    gap:6px;

}

@media(max-width:768px){

    .table-card{

        display:none;

    }

    .mobile-products{

        display:block;

    }

    .product-card{

        padding:10px;

    }

    .product-card-image{

        width:55px;

        height:55px;

    }

    .product-card-info h3{

        font-size:13px;

    }

    .product-card-info p{

        font-size:11px;

    }

    .btn-edit,
    .btn-delete{

        font-size:10px;

        padding:6px 10px;

    }

}

</style>