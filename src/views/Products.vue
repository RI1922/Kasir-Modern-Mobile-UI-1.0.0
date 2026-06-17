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
                💰 Rp {{ Number(item.sellingPrice).toLocaleString('id-ID') }}
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
    {{ editMode ? 'Edit Produk' : 'Tambah Produk' }}
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




<div
    v-if="form.image"
    class="image-preview-wrapper"
>

    <img
        :src="form.image"
        class="image-preview"
    >

    <button
        type="button"
        class="image-remove-btn"
        @click="removeImage"
    >
        ✕
    </button>

</div>

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

const search = ref('')

const products = ref([])

const categories = ref([])

const showModal = ref(false)

const editMode = ref(false)

const currentId = ref(null)

const form = ref({

    name:'',

    categoryId:'',

    purchasePrice:0,

    sellingPrice:0,

    stock:0,

    image:''

})

const loadData = async () => {

    categories.value =
        await categoryService.getAll()

    const data =
        await productService.getAll()

    products.value = data.map(product => {

        const category =
            categories.value.find(
                c => c.id == product.categoryId
            )

        return {

            ...product,

            categoryName:
                category?.name || '-',

        }

    })

    alert(
    JSON.stringify(products.value).length
)

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

        purchasePrice:'',

        sellingPrice:'',

        stock:'',

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

const removeImage = () => {

    form.value.image = ''

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
    border-radius:8px;
    margin-right:8px;
}

.btn-delete{
    background:#ef4444;
    color:white;
    border:none;
    padding:8px 12px;
    border-radius:8px;
    margin-right:8px;
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

    display:left;

}

.product-card-info h3{

    font-size:14px;

    display:left;

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

@media(min-width:769px) and (max-width:1366px){

    .product-image img{

    width:100%;
    height:100%;
    object-fit:contain;

}

 .btn-edit,
    .btn-delete{

        min-width:40px;
        height:36px;

        padding:8px 2px;

        font-size:12px;
        font-weight:600;

        display:flex;
        align-items:center;
        justify-content:center;

        margin:0;
    }


}

@media(max-width:768px){


.table-card{
        display:none;
    }

    .mobile-products{
        display:block;
    }

    .mobile-products{

        display:grid;

        grid-template-columns:repeat(2,1fr);

        gap:12px;

    }

    .product-card{

        display:flex;

        flex-direction:column;

        text-align:left;

        padding:10px;

        margin-bottom:0;

        border-radius:18px;

        height:100%;

    }

.product-image img{

    width:100%;
    height:100%;
    object-fit:contain;

}


    .product-card-info h3{

        align-items:left !important;

        font-size:15px;

        line-height:1.3;

        margin-bottom:1px;

        display:-webkit-box;

        -webkit-line-clamp:2;

        -webkit-box-orient:vertical;

        overflow:hidden;

    }

    .product-card-actions .btn-edit,
.product-card-actions .btn-delete{

    flex:1 !important;

    width:0 !important;

    height:20px !important;

    padding:2px 28px !important;

    margin:0 !important;
    

}

.product-card-actions{

    display:left;

    flex-direction:row;

    gap:6px;

}

.btn-edit,
.btn-delete{

    flex:1;

    width:auto;

    height:37px;

    padding:8px 12px;

    border:none;

    margin-right:8px;

    border-radius:10px;

    font-size:11px;

    font-weight:600;

    display:flex;

    align-items:center;

    justify-content:center;

}

}

@media (max-width: 900px) and (orientation: landscape){

    

 .table-card{
        display:none;
    }

    .mobile-products{
        display:block;
    }

    .mobile-products{

        display:grid;

        grid-template-columns:repeat(3,1fr);

        gap:12px;

    }
}

.image-preview-wrapper{

    position:relative;

    display:inline-block;

    width:120px;

    height:120px;

    margin-top:12px;

}

.image-preview{

    width:100%;

    height:100%;

    object-fit:cover;

    border-radius:12px;

    border:2px solid #1f2937;

    display:block;

}

.image-remove-btn{

    position:absolute;

    top:-10px;

    right:-10px;

    width:28px;

    height:28px;

    border:none;

    border-radius:100%;

    background:rgba(255, 255, 255, 0.13);

    color:white;

    font-size:16px;

    font-weight:bold;

    cursor:pointer;

    padding:0;

    display:flex;

    align-items:center;

    justify-content:center;

    z-index:10;

}

</style>