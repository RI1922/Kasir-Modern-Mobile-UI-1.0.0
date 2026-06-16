<template>
    <MainLayout>

        <div class="page-header">

            <button
                class="btn-primary"
                @click="openCreate"
            >
                + Tambah Kategori
            </button>

        </div>

        <div class="search-box">

            <input
                v-model="search"
                type="text"
                placeholder="Cari kategori..."
            >

        </div>

        <div class="table-card">

            <table>

                <thead>

                    <tr>
                        <th>No</th>
                        <th>Nama Kategori</th>
                        <th>Aksi</th>
                    </tr>

                </thead>

                <tbody>

                    <tr
                        v-for="(item,index) in filteredCategories"
                        :key="item.id"
                    >
                        <td>{{ index + 1 }}</td>

                        <td>{{ item.name }}</td>

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

        <!-- MODAL -->

        <div
            v-if="showModal"
            class="modal"
        >

            <div class="modal-content">

                <h2>
                    {{ editMode ? 'Edit Kategori' : 'Tambah Kategori' }}
                </h2>

                <input
                    v-model="form.name"
                    type="text"
                    placeholder="Nama kategori"
                >

                <div class="modal-actions">

                    <button
                        class="btn-primary"
                        @click="save"
                    >
                        Simpan
                    </button>

                    <button
                        class="btn-secondary"
                        @click="closeModal"
                    >
                        Batal
                    </button>

                </div>

            </div>

        </div>

    </MainLayout>
</template>

<script setup>

import { ref, computed, onMounted } from 'vue'

import MainLayout from '../layouts/MainLayout.vue'

import { categoryService }
from '../services/categoryService'

const categories = ref([])

const search = ref('')

const showModal = ref(false)

const editMode = ref(false)

const currentId = ref(null)

const form = ref({

    name:''

})

const loadData = async () => {

    categories.value =
        await categoryService.getAll()

}

onMounted(loadData)

const filteredCategories = computed(() => {

    return categories.value.filter(item =>

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

        name:''

    }

    showModal.value = true

}

const openEdit = (item) => {

    editMode.value = true

    currentId.value = item.id

    form.value = {

        name:item.name

    }

    showModal.value = true

}

const closeModal = () => {

    showModal.value = false

}

const save = async () => {

    if(!form.value.name) return

    if(editMode.value){

        await categoryService.update(

            currentId.value,

            form.value.name

        )

    }else{

        await categoryService.create(

            form.value.name

        )

    }

    await loadData()

    closeModal()

}

const remove = async (id) => {

    if(
        !confirm(
            'Hapus kategori ini?'
        )
    ) return

    await categoryService.delete(id)

    await loadData()

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

    cursor:pointer;

}

.btn-delete{

    background:#ef4444;

    color:white;

    border:none;

    padding:8px 12px;

    border-radius:10px;

    cursor:pointer;

}

.modal{

    position:fixed;

    inset:0;

    background:rgba(0,0,0,.7);

    display:flex;

    align-items:center;

    justify-content:center;

}

.modal-content{

    width:400px;

    max-width:95%;

    background:#111827;

    padding:24px;

    border-radius:20px;

}

.modal-content input{

    width:100%;

    padding:14px;

    margin-top:15px;

    background:#1f2937;

    border:none;

    border-radius:12px;

    color:white;

}

.modal-actions{

    display:flex;

    gap:10px;

    margin-top:20px;

}

.btn-secondary{

    background:#374151;

    color:white;

    border:none;

    padding:12px 18px;

    border-radius:12px;

}

@media(max-width:768px){

    td:last-child{

        display:flex;
        flex-direction:row;
        gap:6px;
        align-items:center;

    }

    .btn-edit,
    .btn-delete{

        min-width:40px;
        height:20px;

        padding:8px 8px;

        font-size:12px;
        font-weight:600;

        display:flex;
        align-items:center;
        justify-content:center;

        margin:0;
    }

}

</style>