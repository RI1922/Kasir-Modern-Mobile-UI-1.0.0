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

        <div class="store-info">

            <h2>
                {{ storeName }}
            </h2>

        </div>

    </div>

    <nav class="menu">

        <router-link to="/" @click="emit('close')" >
            🏠 Dashboard
        </router-link>

        <router-link to="/kasir" @click="emit('close')" >
            🛒 Kasir
        </router-link>

        <router-link to="/produk" @click="emit('close')" >
            📦 Produk
        </router-link>

        <router-link to="/kategori" @click="emit('close')" >
            📂 Kategori
        </router-link>

        <router-link to="/laporan" @click="emit('close')" >
            📊 Laporan
        </router-link>

        <router-link to="/reports" @click="emit('close')" >
            🧾 Transaksi
        </router-link>

        <router-link to="/settings" @click="emit('close')" >
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

    width:240px;

    height:100dvh;

    background:#0f172a;

    border-right:1px solid #1e293b;

    box-shadow:
        4px 0 20px rgba(0,0,0,.25);

}

.sidebar-content{

    padding:20px;

    height:100%;

    overflow-y:auto;

    overflow-x:hidden;

    box-sizing:border-box;

}

.sidebar-header{

    display:flex;

    align-items:center;

    gap:12px;

    margin-bottom:24px;

    padding-bottom:18px;

    border-bottom:
        1px solid rgba(255,255,255,.08);

}

.logo{

    width:60px;

    height:60px;

    border-radius:14px;

    object-fit:cover;

}




.sidebar-header h2{

    margin:0;

    font-size:18px;

    color:white;

    line-height:1.3;

    word-break:break-word;

    overflow-wrap:break-word;

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

    width:100%;

    box-sizing:border-box;

    color:white;

    text-decoration:none;

    padding:14px 16px;

    border-radius:14px;

    background:#111827;

    font-size:15px;

    transition:.25s;

    display:flex;

    align-items:center;

    gap:10px;

}

.menu a:hover{

    transform:translateX(4px);

    background:#1f2937;

}

.menu a.router-link-active{

    background:#2563eb;

        box-shadow:
        0 4px 15px rgba(37,99,235,.35);

}

.sidebar-overlay{

    display:none;

}

.sidebar-content::-webkit-scrollbar{

    width:6px;

}

.sidebar-content::-webkit-scrollbar-thumb{

    background:#334155;

    border-radius:20px;

}

/* MOBILE */

@media(max-width:768px){


    .sidebar{

        position:fixed;

        top:0;

        left:0;

width:80%;

max-width:280px;

        z-index:1000;

        transform:translateX(-100%);

        transition:.3s ease;

    }

.sidebar.mobileOpen{

    transform:translateX(0);

    box-shadow:
        20px 0 40px rgba(0,0,0,.45);

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
