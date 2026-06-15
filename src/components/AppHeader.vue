<template>

<header class="header">

    <div class="header-left">

        <button
            class="menu-btn"
            @click="$emit('toggle-menu')"
        >
            ☰
        </button>

        <div class="mobile-store">

            <h3>{{ storeName }}</h3>

        </div>

    </div>

</header>

</template>

<script setup>

import {
    ref,
    onMounted
} from 'vue'

import {
    settingsService
}
from '../services/settingsService'

const storeName = ref(
    ''
)

onMounted(() => {

    const settings =
        settingsService.getSettings()

    if(settings.storeName){

        storeName.value =
            settings.storeName

    }

})

</script>

<style scoped>

.header{

    display:flex;

    align-items:center;

    margin-bottom:8px;

}

.header-left{

    display:flex;

    align-items:center;

    gap:12px;

}

.header h2{

    margin:0;

    font-size:24px;

    font-weight:700;

}

.header small{

    color:#9ca3af;

}

.menu-btn{

    display:none;

}

@media(max-width:768px){

    .menu-btn{

        display:flex;

        align-items:center;

        justify-content:center;

        width:42px;

        height:42px;

        border:none;

        border-radius:10px;

        background:#111827;

        color:white;

        font-size:20px;

        cursor:pointer;

    }

    .header h2{

        font-size:18px;

    }

    .header small{

        font-size:11px;

    }

}


.header{

    display:flex;

    align-items:center;

    justify-content:center;

    margin-bottom:12px;

}

.header-left{

    display:flex;

    align-items:center;

    gap:12px;

    width:100%;

}

.menu-btn{

    display:none;

}

.mobile-store{

    display:none;

}

/* HP */

@media(max-width:768px){

    .menu-btn{

        display:flex;

        align-items:center;

        justify-content:center;

        width:42px;

        height:42px;

        border:none;

        border-radius:10px;

        background:#111827;

        color:white;

        font-size:20px;

        cursor:pointer;

    }

    .mobile-store{

        display:block;

    }

    .mobile-store h3{

        margin:0;

        font-size:20px;

        font-weight:700;

        color:white;

    }

}

/* TABLET & DESKTOP */

@media(min-width:769px){

    .header{

        display:none;

    }

}

</style>