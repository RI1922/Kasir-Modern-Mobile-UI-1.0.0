<template>

<div class="layout">

    <Sidebar
        :mobileMenu="mobileMenu"
        @close="mobileMenu = false"
    />

    <main class="content">

        <AppHeader
            @toggle-menu="
                mobileMenu = !mobileMenu
            "
        />

        <div class="page-content">
            <slot />
        </div>

    </main>

</div>

</template>

<script setup>

import { ref } from 'vue'

import Sidebar from '../components/Sidebar.vue'
import AppHeader from '../components/AppHeader.vue'

const mobileMenu = ref(false)

</script>

<style scoped>

.layout{

    display:flex;

    min-height:100vh;

    background:#020617;

}

.content{

    flex:1;

    margin-left:280px;

    width:calc(100% - 280px);

    padding:20px;

    box-sizing:border-box;

}

.page-content{

    margin-top:20px;

}

/* MOBILE */

@media(max-width:768px){

    .content{

        margin-left:0;

        width:100%;

        padding:12px;

        padding-bottom:20px;

    }

    .page-content{

        margin-top:10px;

    }

}

</style>