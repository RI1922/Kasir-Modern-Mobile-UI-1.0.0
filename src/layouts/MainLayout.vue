<template>



<div class="layout">

<Sidebar
    v-if="!useMobileSidebar || mobileMenu"
    :mobileMenu="mobileMenu"
    @close="mobileMenu = false"
/>

    <main class="content">

<AppHeader
    v-if="useMobileSidebar"
    :mobileMenu="mobileMenu"
    @toggle-menu="mobileMenu = !mobileMenu"
/>

        <div class="page-content">
            <slot />
        </div>

    </main>

</div>

</template>

<script setup>

import {
    ref,
    computed,
    onMounted,
    onUnmounted
} from 'vue'

import Sidebar from '../components/Sidebar.vue'
import AppHeader from '../components/AppHeader.vue'

const mobileMenu = ref(false)

const screenWidth = ref(window.innerWidth)
const screenHeight = ref(window.innerHeight)

const updateSize = () => {

    screenWidth.value = window.innerWidth
    screenHeight.value = window.innerHeight

}

onMounted(() => {

    window.addEventListener(
        'resize',
        updateSize
    )

})

onUnmounted(() => {

    window.removeEventListener(
        'resize',
        updateSize
    )

})

const useMobileSidebar = computed(() => {

    const shortestSide = Math.min(
        screenWidth.value,
        screenHeight.value
    )

    return shortestSide < 768

})


</script>

<style scoped>

.layout{

    display:flex;

    height:100vh;

    overflow:hidden;

    background:#020617;

}

.content{

    flex:1;

    width:100%;

    padding:0;

    box-sizing:border-box;

    overflow-x:hidden;

    overflow-y:auto;

    height:100vh;

}

.page-content{

    margin-top:0px;

}

/* MOBILE */

@media(max-width:768px){

    .content{

        margin-left:0;

        width:100%;

        padding:0;

    }

    .page-content{

        padding:0 16px 0px;

        margin-top:0;

    }

}

</style>