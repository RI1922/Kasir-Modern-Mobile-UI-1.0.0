<template>

<header
    v-if="!mobileMenu"
    class="header"
>

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

    position:sticky;

    top:0;

    z-index:9999;

    background:#050816;

    padding:12px 16px;

    min-height:80px;

    margin-bottom:16px;

}

.header-left{

    display:flex;

    align-items:center;

    justify-content:flex-start;

    width:100%;

    gap:12px;

}

.mobile-store{

    display:block;

    flex:1;

    min-width:0;

}





/* HP */


@media(max-width:767px){

    .header{

        position:sticky;
        top:0;
        z-index:9999;

        background:#050816;

        padding:12px 16px;

        min-height:70px;

        margin-bottom:16px;
    }

    .header-left{

        display:flex;

        align-items:center;

        justify-content:flex-start;

        gap:12px;

        width:100%;

        min-height:52px;
    }

    .menu-btn{

        width:48px;
        height:48px;

        min-width:48px;
        min-height:48px;

        font-size:28px;

        border:none;
        border-radius:14px;

        background:rgba(0,0,0,.32);

        color:white;

        display:flex;
        align-items:center;
        justify-content:center;

        flex-shrink:0;
    }

    .mobile-store{

        margin-left:0;

        flex:1;
    }

    .mobile-store h3{

        margin:0;

        color:white;

        font-size:18px;

        font-weight:700;

        line-height:1.2;
    }

    .mobile-store small{

        color:#94a3b8;

        font-size:13px;
    }

}






/* TABLET PORTRAIT */

@media (min-width:768px) and (max-width:1024px) and (orientation:portrait){

    .header{

        position:sticky;
        top:0;
        z-index:9999;

        background:#050816;

        padding:24px 28px;

        min-height:120px;

        margin-bottom:20px;
    }

    .header-left{

        display:flex;
        align-items:center;
        width:100%;
    }

    .menu-btn{

        display:flex;

        align-items:center;
        justify-content:center;

        width:72px;
        height:72px;

        font-size:36px;

        border:none;
        border-radius:18px;

        background:rgba(0, 0, 0, 0.32);
        color:white;

        flex-shrink:0;
    }

    .mobile-store{

        margin-left:0px;
    }

    .mobile-store h3{

        margin:0;

        color:white;

        font-size:32px;

        font-weight:700;

        line-height:1.2;
    }

    .mobile-store small{

        display:block;

        margin-top:4px;

        color:#94a3b8;

        font-size:20px;
    }

}

/* DESKTOP */

@media (min-width:1025px){

    .header{
        display:none;
    }

}

</style>