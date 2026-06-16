<template>

    <div class="auth-page">

        <div class="auth-card">

            <h1>
                📝 Buat Akun Admin
            </h1>

            <p>
                Buat akun pertama untuk menggunakan aplikasi
            </p>

            <label>Username</label>

            <input
                v-model="username"
                type="text"
            >

            <label>Password</label>

            <input
                v-model="password"
                type="password"
            >

            <label>Konfirmasi Password</label>

            <input
                v-model="confirmPassword"
                type="password"
            >

            <button
                @click="register"
            >

                Buat Akun

            </button>

        </div>

    </div>

</template>

<script setup>


import { showSuccess }
from '../utils/toast'


import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const username = ref('')
const password = ref('')
const confirmPassword = ref('')

const register = () => {

    if(

        !username.value ||

        !password.value

    ){

        showError(
            'Semua field wajib diisi'
        )

        return

    }

    if(

        password.value !==

        confirmPassword.value

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
                username.value,

            password:
                password.value,

            role:'admin',

            createdAt:
                new Date().toISOString()

        })

    )

    router.push('/login')

}

</script>

<style scoped>

.auth-page{

    min-height:100vh;

    display:flex;

    justify-content:center;

    align-items:center;

    background:#020617;

}

.auth-card{

    width:400px;

    background:#111827;

    padding:30px;

    border-radius:20px;

    display:flex;

    flex-direction:column;

    gap:15px;

}

input{

    background:#1f2937;

    border:none;

    padding:14px;

    border-radius:12px;

    color:white;

}

button{

    background:#2563eb;

    color:white;

    border:none;

    padding:14px;

    border-radius:12px;

    cursor:pointer;

    font-weight:bold;

}

</style>