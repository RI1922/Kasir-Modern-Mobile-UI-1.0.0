<template>

<header
    v-if="!mobileMenu"
    class="header"
>

    <div class="header-left">

<button
    v-if="!mobileMenu"
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

defineProps({

    mobileMenu:Boolean

})

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

    width:100%;

    min-height:52px;

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

        position:flex;
        top:8px;
        left:2px;

        width:74px;
        height:74px;

        border:none;
        border-radius:8px;

        background:rgba(0, 0, 0, 0.32);
        color:white;

        font-size:32px;

        cursor:pointer;

        z-index:900;

        box-shadow:
            0 6px 20px rgba(31, 31, 31, 0);

    }

    .mobile-store{

        padding-left:62px;
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

        padding-left:2px;

    }

    .mobile-store small{

        color:#94a3b8;

        font-size:13px;

        padding-left:2px;
    }

.header{
    position:sticky;
    top:0;
    z-index:9999;

    background:#050816;

    padding:6px 0;

    margin-bottom:16px;

    min-height:60px;
}

.header-left{

    display:flex;

    align-items:center;

    width:100%;

    min-height:52px;

}

    .menu-btn{

        position:flex;

        top:20px;
        left:26px;

        width:34px;
        height:34px;

        z-index:900;

        display:flex;
        align-items:center;
        justify-content:center;
    }

    .mobile-store{

        padding-left:1px;
    }

}

/* TABLET & DESKTOP */

@media(min-width:769px){

    .header{

        display:none;

    }

}

</style>