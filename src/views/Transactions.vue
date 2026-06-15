<template>

<MainLayout>


    <div class="table-container">

        <table>

            <thead>

                <tr>

                    <th>Invoice</th>
                    <th>Tanggal</th>
                    <th>Total</th>

                </tr>

            </thead>

            <tbody>

                <tr
                    v-for="item in transactions"
                    :key="item.id"
                    @click="selectedTransaction = item"
                    style="cursor:pointer"
                >

                    <td>{{ item.invoice }}</td>

                    <td>
                        {{ formatDate(item.createdAt) }}
                    </td>

                    <td>
                        Rp {{ formatRupiah(item.total) }}
                    </td>

                </tr>

            </tbody>

        </table>

    </div>

    <div
        v-if="selectedTransaction"
        class="detail-box"
    >

        <h2>Detail Transaksi</h2>

        <p>
            Invoice:
            {{ selectedTransaction.invoice }}
        </p>

        <hr>

        <div
            v-for="product in selectedTransaction.items"
            :key="product.id"
        >

            <p>

                {{ product.name }}

                x {{ product.qty }}

            </p>

        </div>

    </div>

</MainLayout>

</template>

<script setup>

import {
    ref,
    onMounted
}
from 'vue'

import MainLayout
from '../layouts/MainLayout.vue'

import { transactionService }
from '../services/transactionService'

const transactions = ref([])

const selectedTransaction = ref(null)

const loadData = async () => {

    transactions.value =
        await transactionService.getAll()

    transactions.value.reverse()

}

onMounted(loadData)

const formatDate = (date) => {

    return new Date(date)
        .toLocaleString('id-ID')

}

const formatRupiah = (value) => {

    return new Intl.NumberFormat(
        'id-ID'
    ).format(value || 0)

}

</script>

<style scoped>

.table-container{

    background:#111827;

    border-radius:20px;

    overflow:hidden;

}

table{

    width:100%;

    border-collapse:collapse;

}

th{

    background:#1f2937;

    padding:15px;

}

td{

    padding:15px;

    border-top:1px solid #374151;

}

.detail-box{

    margin-top:20px;

    background:#111827;

    padding:20px;

    border-radius:20px;

}

</style>