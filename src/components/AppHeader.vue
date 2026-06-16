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

    <small>
    {{ owner || 'Pemilik Toko' }}
</small>

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

const owner = ref('')

onMounted(() => {

    const settings =
        settingsService.getSettings()

    if(settings.storeName){

        storeName.value =
            settings.storeName

    }

        if(settings.owner){

        owner.value =
            settings.owner

    }

})

</script>

<style scoped>


.header{

    display:flex;

    align-items:center;

    justify-content:center;

    margin-bottom:16px;

    padding:8px 0;

}

.header-left{

    display:flex;

    align-items:center;

    gap:12px;

    width:100%;

    min-width:0;

}

.menu-btn{

    display:none;

}

.mobile-store{

    display:block;

    flex:1;

    min-width:0;

}





/* HP */

@media(max-width:768px){

    .menu-btn{

        display:flex;

        align-items:center;

        justify-content:center;

        width:48px;

        height:48px;

        border:none;

        border-radius:14px;

        background:#111827;

        color:white;

        font-size:20px;

        cursor:pointer;

        flex-shrink:0;

        box-shadow:
            0 4px 12px rgba(0,0,0,.25);

    }

.mobile-store h3{

    margin:0;

    color:white;

    font-size:18px;

    font-weight:700;

    line-height:1.2;

    white-space:nowrap;

    overflow:hidden;

    text-overflow:ellipsis;

}

.mobile-store small{

    color:#94a3b8;

    font-size:11px;

}

}

/* TABLET & DESKTOP */

@media(min-width:769px){

    .header{

        display:none;

    }

}

</style>