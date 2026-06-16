<template>

    <div class="login-page">

        <div class="login-card">

            <h1>🔐 Login Kasir Modern</h1>

            <p>
                Masuk menggunakan akun administrator
            </p>

            <label>Username</label>

            <input
                v-model="username"
                type="text"
                placeholder="Masukkan username"
            >

            <label>Password</label>

            <input
                v-model="password"
                type="password"
                placeholder="Masukkan password"
            >

            <button
                @click="login"
            >
                Login
            </button>

            <p class="signup-text">

    Belum punya akun?

    <router-link to="/signup">

        Buat Akun

    </router-link>

</p>

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

const login = () => {

    const account = JSON.parse(
    localStorage.getItem('user_account')
)

if(!account){

    showError(
        'Akun belum tersedia, silakan daftar terlebih dahulu'
    )

    router.push('/signup')

    return
}

    if(

        username.value ===
        account.username &&

        password.value ===
        account.password

    ){

        localStorage.setItem(

            'isLoggedIn',

            'true'

        )

        router.push('/')

    }

    else{

        showError(
            'Username atau password salah'
        )

    }

}



</script>

<style scoped>

.signup-text{

    text-align:center;

    margin-top:15px;

    opacity:.8;

}

.signup-text a{

    color:#60a5fa;

    text-decoration:none;

    font-weight:600;

}

.signup-text a:hover{

    text-decoration:underline;

}

.login-page{

    min-height:100vh;

    display:flex;

    justify-content:center;

    align-items:center;

    background:#0f172a;

    padding:20px;

}

.login-card{

    width:100%;

    max-width:400px;

    background:#111827;

    padding:30px;

    border-radius:20px;

    display:flex;

    flex-direction:column;

    gap:15px;

}

h1{

    margin:0;

}

p{

    opacity:.7;

    margin-bottom:10px;

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

    border:none;

    padding:14px;

    border-radius:12px;

    color:white;

    font-weight:bold;

    cursor:pointer;

}

button:hover{

    opacity:.9;

}


</style>