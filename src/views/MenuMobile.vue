<template>

<MainLayout>

    <div class="menu-grid">

        <router-link to="/kategori">
            📂 Kategori
        </router-link>

        <router-link to="/brand">
            🏷 Brand
        </router-link>

        <router-link to="/riwayat">
            🧾 Riwayat
        </router-link>

        <router-link to="/settings">
            ⚙️ Pengaturan
        </router-link>

    </div>

</MainLayout>

</template>

<script setup>

import MainLayout
from '../layouts/MainLayout.vue'

</script>

<style scoped>

.menu-grid{

    display:grid;

    grid-template-columns:
    repeat(2,1fr);

    gap:15px;

}

.menu-grid a{

    background:#111827;

    padding:25px;

    border-radius:18px;

    text-align:center;

    text-decoration:none;

    color:white;

    font-weight:600;

}

</style>