<template>

<aside
    class="sidebar"
    :class="{
        mobileOpen: mobileMenu
    }"
>

<div
    v-if="mobileMenu"
    class="sidebar-overlay"
    @click="emit('close')"
></div>

<div class="sidebar-content">

    <div class="sidebar-header">

        <img
            v-if="logo"
            :src="logo"
            class="logo"
        >

        <div>

            <h2>
                {{ storeName }}
            </h2>

        </div>

    </div>

    <nav class="menu">

        <router-link to="/">
            🏠 Dashboard
        </router-link>

        <router-link to="/kasir">
            🛒 Kasir
        </router-link>

        <router-link to="/produk">
            📦 Produk
        </router-link>

        <router-link to="/kategori">
            📂 Kategori
        </router-link>

        <router-link to="/brand">
            🏷 Brand
        </router-link>

        <router-link to="/laporan">
            📊 Laporan
        </router-link>

        <router-link to="/reports">
            🧾 Riwayat Transaksi
        </router-link>

        <router-link to="/settings">
            ⚙️ Pengaturan
        </router-link>

    </nav>

</div>

</aside>

</template>

<script setup>

import { ref,onMounted } from 'vue'
import { settingsService } from '../services/settingsService'

const props = defineProps({
    mobileMenu:Boolean
})

const emit = defineEmits([
    'close'
])

const storeName = ref('Kasir Modern')
const logo = ref('')

onMounted(() => {

    const settings =
        settingsService.getSettings()

    if(settings.storeName){
        storeName.value =
            settings.storeName
    }

    if(settings.logo){
        logo.value =
            settings.logo
    }

})

</script>

<style scoped>

.sidebar{

    width:280px;

    height:100vh;

    background:#0f172a;

    border-right:1px solid #1e293b;

}

.sidebar-content{

    padding:20px;

    height:100%;

    overflow-y:auto;

    box-sizing:border-box;

}

.sidebar-header{

    display:flex;

    align-items:center;

    gap:12px;

    margin-bottom:30px;

}

.logo{

    width:50px;

    height:50px;

    border-radius:12px;

    object-fit:cover;

    border:2px solid #334155;

}

.sidebar-header h2{

    margin:0;

    color:white;

    font-size:22px;

}

.sidebar-header small{

    color:#94a3b8;

}

.menu{

    display:flex;

    flex-direction:column;

    gap:10px;

}

.menu a{

    color:white;

    text-decoration:none;

    padding:14px;

    border-radius:12px;

    background:#111827;

    font-size:15px;

    transition:.2s;

}

.menu a.router-link-active{

    background:#2563eb;

}

.sidebar-overlay{

    display:none;

}

/* MOBILE */

@media(max-width:768px){

    .sidebar{

        position:fixed;

        top:0;

        left:0;

        z-index:9999;

        transform:translateX(-100%);

        transition:.3s ease;

    }

    .sidebar.mobileOpen{

        transform:translateX(0);

    }

    .sidebar-overlay{

        display:block;

        position:fixed;

        inset:0;

        background:rgba(0,0,0,.55);

        z-index:-1;

    }

}

</style>
