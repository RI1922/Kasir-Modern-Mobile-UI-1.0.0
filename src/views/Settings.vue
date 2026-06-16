<template>

    <MainLayout>

        

        <div class="settings-layout">

            <!-- KIRI -->

            <div class="left-panel">

                <div class="settings-card">

                    <div class="form-grid">

                        <div class="form-group">

                            <label>Nama Toko</label>

                            <input
                                v-model="settings.storeName"
                                type="text"
                            >

                        </div>

                        <div class="form-group">

                            <label>WhatsApp</label>

                            <input
                                v-model="settings.phone"
                                type="text"
                            >

                        </div>

                        <div class="form-group">

                            <label>Nama Pemilik</label>

                            <input
                                v-model="settings.owner"
                                type="text"
                            >

                        </div>

                        <div class="form-group">

                            <label>Logo Toko</label>

                            <input
                                type="file"
                                accept="image/*"
                                @change="handleLogo"
                            >

                        </div>

                    </div>

                    <label>Alamat</label>

                    <textarea
                        v-model="settings.address"
                    ></textarea>



<div
    v-if="settings.logo"
    class="image-preview-wrapper"
>

    <img
        :src="settings.logo"
        class="logo-preview"
    >

    <button
        type="button"
        class="image-remove-btn"
        @click="removeImage"
    >
        ✕
    </button>

</div>

                    <button
                        @click="saveSettings"
                    >
                        💾 Simpan
                    </button>

                </div>

                <div class="settings-card">

    <h2>🔐 Akun Pengguna</h2>

<label>Username</label>

<div class="username-display">

    {{ user.username || 'Belum ada akun' }}

</div>

    <label>Password</label>

    <input
        v-model="user.password"
        type="password"
    >

    <label>Konfirmasi Password</label>

    <input
        v-model="user.confirmPassword"
        type="password"
    >

    <button
        @click="saveUser"
    >

        🔒 Simpan Akun

    </button>

    <div class="section-card">

    <h2>
        👤 Akun
    </h2>

<p>

    Login sebagai :

    <strong>

        {{ currentUser?.username }}

    </strong>

</p>

    <button
        class="logout-btn"
        @click="logout"
    >

        🚪 Logout

    </button>

</div>

</div>

</div>



            <!-- KANAN -->

            <div class="right-panel">

                

                <!-- Informasi -->

                <div class="section-card">

                    <h2>ℹ Informasi Sistem</h2>

                    <div class="info-grid">

                        <div>

                            <span>Produk</span>

                            <strong>
                                {{ totalProduk }}
                            </strong>

                        </div>

                        <div>

                            <span>Transaksi</span>

                            <strong>
                                {{ transactions.length }}
                            </strong>

                        </div>

                        <div>

                            <span>Versi</span>

                            <strong>
                                1.2.0
                            </strong>

                        </div>

                        <div>

                            <span>Status</span>

                            <strong class="online">
                                Aktif
                            </strong>

                        </div>

                    </div>

                </div>

                <!-- Backup -->

                <div class="section-card">

                    <h2>💾 Backup & Restore</h2>

                    <div class="button-group">

                        <button
                            class="backup-btn"
                            @click="backupData"
                        >
                            ⬇ Backup Data
                        </button>

                        <button
                            class="restore-btn"
                            @click="openRestoreFile"
                        >
                            ⬆ Restore Data
                        </button>

                        <input
                            ref="restoreFile"
                            type="file"
                            accept=".json"
                            hidden
                            @change="restoreData"
                        >
                     </div>

                     <div class="backup-info">

    <p>
        📅 Backup Terakhir :
        <strong>{{ lastBackup }}</strong>
    </p>

</div>

                </div>

                <!-- Reset -->

                <div class="section-card">

                    <h2>⚠ Reset Data</h2>

                    <p>
                        Hapus seluruh data produk,
                        kategori dan transaksi.
                    </p>

                    <button
                        class="danger-btn"
                        @click="resetData"
                    >
                        🗑 Reset Semua Data
                    </button>

                </div>

            </div>

        </div>

    </MainLayout>

</template>

<script setup>


import { showSuccess }
from '../utils/toast'


import {
    ref,
    onMounted
} from 'vue'

import {
    backupService
}
from '../services/backupService'

import { productService }
from '../services/productService'

import { transactionService }
from '../services/transactionService'

import MainLayout
from '../layouts/MainLayout.vue'

import { useRouter }
from 'vue-router'

const settings = ref({

    storeName:'',
    address:'',
    phone:'',
    owner:'',
    logo:''

})

const user = ref({

    username:'',

    password:'',

    confirmPassword:''

})

const totalProduk = ref(0)

const transactions = ref([])

const restoreFile = ref(null)

const router = useRouter()

const currentUser = ref(null)

const lastBackup = ref(

    localStorage.getItem(
        'last_backup'
    ) || 'Belum Pernah'

)

const openRestoreFile = () => {

    restoreFile.value.click()

}

const removeImage = () => {

    settings.value.logo = ''

}


onMounted(async () => {

    const userData = JSON.parse(

        localStorage.getItem(
            'user_account'
        )

    )

    currentUser.value = userData

    const saved = localStorage.getItem(
        'store_settings'
    )

    if(saved){

        settings.value =
            JSON.parse(saved)

    }

    const savedUser = localStorage.getItem(
        'user_account'
    )

    if(savedUser){

        const data = JSON.parse(
            savedUser
        )

        user.value.username =
            data.username

    }

    const products =
        await productService.getAll()

    transactions.value =
        await transactionService.getAll()

    totalProduk.value =
        products.length

})

const saveSettings = () => {

    localStorage.setItem(

        'store_settings',

        JSON.stringify(
            settings.value
        )

    )

    showSuccess(
        'Pengaturan berhasil disimpan'
    )

}

const saveUser = () => {

    if(

        !user.value.username ||

        !user.value.password

    ){

        showError(
            'Username dan password wajib diisi'
        )

        return

    }

    if(

        user.value.password !==

        user.value.confirmPassword

    ){

        showError(
            'Password tidak sama'
        )

        return

    }

    localStorage.setItem(

    'user_account',

    JSON.stringify({

        username:
            user.value.username,

        password:
            user.value.password,

        role:'admin',

        createdAt:
            new Date().toISOString()

    })

)

    showSuccess(
        'Akun berhasil disimpan'
    )

}

const backupData = async () => {

    const success =
        await backupService.backup()

    if(success){

        lastBackup.value =

            localStorage.getItem(
                'last_backup'
            )

        showSuccess(
    'Backup berhasil dibuat'
)

    }

}


const restoreData = async (event) => {

    await backupService.restore(
        event
    )

}

const resetData = async () => {

    await backupService.reset()

}





const handleLogo = (event) => {

    const file = event.target.files[0]

    if(!file) return

    const reader = new FileReader()

    reader.onload = () => {

        settings.value.logo = reader.result

    }

    reader.readAsDataURL(file)

}



const logout = () => {

    const confirmLogout = confirm(

        'Yakin ingin logout?'

    )

    if(!confirmLogout){

        return

    }

    localStorage.removeItem(

        'isLoggedIn'

    )

    router.push('/login')

}

</script>

<style scoped>

.logout-btn{

    width:100%;

    margin-top:15px;

    background:#f59e0b;

    color:white;

    border:none;

    padding:14px;

    border-radius:12px;

    cursor:pointer;

    font-weight:600;

}

.logout-btn:hover{

    background:#d97706;

}

.settings-card{

    background:#111827;

    padding:20px;

    border-radius:20px;

    display:flex;

    flex-direction:column;

    gap:15px;

    min-height:90px;

    margin-bottom:0;

}

input,
textarea{

    background:#1f2937;

    border:none;

    border-radius:12px;

    padding:12px;

    color:white;

}

textarea{

    min-height:90px;

}

button{

    background:#2563eb;

    border:none;

    padding:14px;

    color:white;

    border-radius:12px;

    cursor:pointer;

    font-weight:bold;

}

.logo-preview{

    width:120px;

    height:120px;

    object-fit:contain;

    margin-top:15px;

    background:#1f2937;

    padding:10px;

    border-radius:15px;

}

.section-card{

    background:#111827;

    padding:25px;

    border-radius:20px;

    margin:0;

}

.section-card h2{

    margin-top:0;

    margin-bottom:15px;

}

.button-group{

    display:flex;

    gap:15px;

    flex-wrap:wrap;

    margin-top:15px;

}

.backup-btn{

    background:#2563eb;

    color:white;

    border:none;

    padding:14px 20px;

    border-radius:12px;

    cursor:pointer;

    font-weight:600;

}

.restore-btn{

    background:#16a34a;

    color:white;

    border:none;

    padding:14px 20px;

    border-radius:12px;

    cursor:pointer;

    font-weight:600;

}

.info-grid span{

    display:block;

    opacity:.7;

    margin-bottom:8px;

}

.info-grid strong{

    font-size:20px;

}

.online{

    color:#22c55e;

}

.danger-btn{

    width:100%;

    margin-top:15px;

    background:#dc2626;

    color:white;

    border:none;

    padding:14px;

    border-radius:12px;

    cursor:pointer;

    font-weight:600;

}

.danger-btn:hover{

    background:#b91c1c;

}

.settings-layout{

    display:grid;

    grid-template-columns:1.8fr 1fr;

    gap:20px;

    align-items:start;

}


.right-panel{

    display:flex;

    flex-direction:column;

    gap:20px;

    position:sticky;

    top:20px;

    align-self:start;

}

.left-panel{

    display:flex;

    flex-direction:column;

    gap:20px;

}

.info-grid{

    display:grid;

    grid-template-columns:repeat(2,1fr);

    gap:15px;

}

.info-grid div{

    background:#1f2937;

    padding:18px;

    border-radius:14px;

    min-height:90px;

}

.settings-card,
.section-card{
    box-sizing:border-box;
}

.form-grid{

    display:grid;

    grid-template-columns:1fr 1fr;

    gap:20px;

}

.form-group{

    display:flex;

    flex-direction:column;

    gap:10px;

}

.username-display{

    background:#1f2937;

    padding:12px;

    border-radius:12px;

    color:#9ca3af;

    font-weight:600;

}

.disabled-input{

    opacity:.7;

    cursor:not-allowed;

}

.backup-info{

    margin-top:20px;

    padding-top:15px;

    border-top:1px solid
        rgba(255,255,255,.08);

}

.backup-info p{

    margin:8px 0;

    color:#d1d5db;

    font-size:14px;

}

.backup-info strong{

    color:white;

}

@media(max-width:767px){

    .settings-layout{

        grid-template-columns:1fr;

    }

    .right-panel{

        position:static;

        top:auto;

    }

    .form-grid{

        grid-template-columns:1fr;

    }

        .button-group{

        flex-direction:column;

    }




}

@media (min-width:768px) and (max-width:1024px){

    .settings-layout{

        grid-template-columns:1.4fr .9fr;

        gap:16px;

    }

    .settings-card{

        padding:16px;

    }

    .section-card{

        padding:16px;

    }

    .form-grid{

        grid-template-columns:1fr 1fr;

        gap:14px;

    }

    .info-grid{

        gap:10px;

    }

    .info-grid div{

        padding:14px;

        min-height:70px;

    }

    .right-panel{

        position:static;

    }

}

.image-preview-wrapper{

    position:relative;

    display:inline-block;

    width:120px;

    height:120px;

    margin-top:5px;      /* sebelumnya 15px */
    margin-bottom:25px;   /* tambah jarak ke tombol simpan */

}

.logo-preview{

    width:100%;

    height:100%;

    object-fit:contain;

    background:#1f2937;

    border-radius:15px;

    padding:10px;

}

.image-remove-btn{

    position:absolute;

    top:8px;

    right:-6px;

    width:22px;

    height:22px;

    border:none;

    border-radius:50%;

    background:#374151;

    color:white;

    font-size:12px;

    font-weight:bold;

    cursor:pointer;

    padding:0;

    display:flex;

    align-items:center;

    justify-content:center;

    z-index:10;

}

</style>