<template>
    <MainLayout>

<div class="filter-box">

    <div class="filter-item">
        <input
            type="date"
            v-model="startDate"
        >
    </div>

    <div class="filter-item">
        <input
            type="date"
            v-model="endDate"
        >
    </div>

    <button
        class="btn-print"
        @click="printReport"
    >
        🖨 Cetak
    </button>

</div>


<div class="summary-card">

<div class="omzet-card">

    <h4>Omzet</h4>

    <h2>
        Rp {{ formatRupiah(periodOmzet) }}
    </h2>

</div>

    <div class="modal-card">

    <h4>Modal</h4>

    <h2>

        Rp {{ formatRupiah(periodModal) }}

    </h2>

</div>

    <div class="profit-card">

    <h4>Profit</h4>

        <h2>
            Rp {{ formatRupiah(periodProfit) }}
        </h2>

    </div>

<div class="margin-card">

    <h4>
        Margin Profit
    </h4>

    <h2>

        {{ periodMargin.toFixed(1) }}%

    </h2>

</div>

    <div class="transaksi-card">

    <h4>Transaksi</h4>

        <h2>
            {{ filteredTransactions.length }}
        </h2>

    </div>
    <div class="terjual-card">

    <h4>Produk Terjual</h4>

    <h2>

        {{ totalProdukTerjual }}

    </h2>

</div>

<div class="aktif-card">

    <h4>Produk Aktif</h4>

    <h2>

        {{ totalProduk }}

    </h2>

</div>

<div class="restock-card">

    <h4>Perlu Restock</h4>

    <h2>

        {{ totalRestock }}

    </h2>

</div>



</div>



<div class="report-section">

    <h2>🏆 Produk Terlaris</h2>

    <table>

        <thead>

            <tr>

                <th>No</th>
                <th>Produk</th>
                <th>Terjual</th>

            </tr>

        </thead>

        <tbody>

            <tr
                v-for="(item,index) in topProducts.slice(0,5)"
                :key="item.name"
            >

                <td>

{{

index === 0 ? '🥇' :

index === 1 ? '🥈' :

index === 2 ? '🥉' :

index + 1

}}

</td>

                <td>{{ item.name }}</td>

                <td>{{ item.total }}</td>

            </tr>

        </tbody>

    </table>

</div>

<div class="report-section">

    <h2>📦 Kondisi Stok</h2>

    <table>

        <thead>

            <tr>

                <th>Produk</th>
                <th>Stok</th>
                <th>Status</th>

            </tr>

        </thead>

        <tbody>

            <tr
                v-for="item in stockStatus"
                :key="item.id"
            >

                <td>{{ item.name }}</td>

                <td>{{ item.stock }}</td>

                <td>

<span
    :class="{

        danger:
        item.status === 'HABIS',

        warning:
        item.status === 'PERLU RESTOCK',

        success:
        item.status === 'AMAN'

    }"
>

{{ item.status }}

</span>

</td>

            </tr>

        </tbody>

    </table>

</div>

    </MainLayout>
</template>

<script setup>

import {
    ref,
    computed,
    onMounted
} from 'vue'

import MainLayout
from '../layouts/MainLayout.vue'

import { transactionService }
from '../services/transactionService'

import { productService }
from '../services/productService'

import {
    settingsService
}
from '../services/settingsService'

const storeName = ref(
    'Kasir Modern'
)

onMounted(() => {

    const settings =
        settingsService.getSettings()

    if(settings.storeName){

        storeName.value =
            settings.storeName

    }

})

const startDate = ref('')

const endDate = ref('')

const transactions = ref([])

const products = ref([])

const loadData = async () => {

    transactions.value =
        await transactionService.getAll()

    transactions.value.reverse()

    products.value =
        await productService.getAll()

}

onMounted(loadData)

const formatRupiah = (value) => {

    return new Intl.NumberFormat(
        'id-ID'
    ).format(value || 0)

}

const filteredTransactions = computed(() => {

    return transactions.value.filter(item => {

        const transactionDate =
            new Date(item.createdAt)

        const start =
            startDate.value
            ?
            new Date(startDate.value)
            :
            null

        const end =
            endDate.value
            ?
            new Date(endDate.value)
            :
            null

        if(start && transactionDate < start){

            return false

        }

        if(end){

            end.setHours(
                23,
                59,
                59,
                999
            )

            if(transactionDate > end){

                return false

            }

        }

        return true

    })

})

const periodOmzet = computed(() => {

    return filteredTransactions.value.reduce(

        (sum,item) =>

            sum + Number(item.total || 0),

        0

    )

})

const periodProfit = computed(() => {

    return filteredTransactions.value.reduce(

        (sum,item) =>

            sum + Number(item.profit || 0),

        0

    )

})

const topProducts = computed(() => {

    const soldProducts = {}

    filteredTransactions.value.forEach(transaction => {

        transaction.items?.forEach(item => {

            if(!soldProducts[item.name]){

                soldProducts[item.name] = 0

            }

            soldProducts[item.name] += item.qty

        })

    })

    return Object.entries(soldProducts)

        .map(([name,total]) => ({

            name,

            total

        }))

        .sort((a,b) =>

            b.total - a.total

        )

})

const periodMargin = computed(() => {

    if(periodOmzet.value <= 0){

        return 0

    }

    return (

        periodProfit.value

        /

        periodOmzet.value

    ) * 100

})

const periodModal = computed(() => {

    return periodOmzet.value

        -

        periodProfit.value

})

const totalProdukTerjual = computed(() => {

    let total = 0

    filteredTransactions.value.forEach(transaction => {

        transaction.items?.forEach(item => {

            total += Number(item.qty)

        })

    })

    return total

})

const stockStatus = computed(() => {

    return products.value.map(item => ({

        ...item,

        status:

            item.stock <= 0

            ? 'HABIS'

            : item.stock <= 20

            ? 'PERLU RESTOCK'

            : 'AMAN'

    }))

})

const totalProduk = computed(() => {

    return products.value.length

})

const totalRestock = computed(() => {

    return products.value.filter(

        item =>

            item.stock > 0 &&

            item.stock <= 20

    ).length

})


const printReport = () => {

    const printWindow =
        window.open('', '_blank')

    printWindow.document.write(`

<html>

<head>

<title>Laporan Penjualan</title>

<style>

body{

    font-family:Arial,sans-serif;

    padding:30px;

}

h1,h2{

    text-align:center;

}

table{

    width:100%;

    border-collapse:collapse;

    margin-top:15px;

}

th,
td{

    border:1px solid #ddd;

    padding:10px;

}

th{

    background:#f3f4f6;

    text-align:center;

}

.no{

    width:60px;

    text-align:center;

}

.qty{

    width:120px;

    text-align:right;

    padding-right:15px;

}

.stock{

    width:120px;

    text-align:right;

    padding-right:15px;

}

.status{

    width:180px;

    text-align:center;

}

.text-left{

    text-align:left;

}

.section{

    margin-top:30px;

}

</style>

</head>

<body>

<h2>
Laporan Penjualan ${storeName.value}
</h2>


<p>

Periode :

${startDate.value || '-'}

s/d

${endDate.value || '-'}

</p>

<p>

Dicetak oleh Kasir Modern :

${new Date().toLocaleString('id-ID')}

</p>


<div class="section">

<h3>Ringkasan</h3>

<table>

<tr>
<td>Omzet</td>
<td>Rp ${formatRupiah(periodOmzet.value)}</td>
</tr>

<tr>
<td>Modal</td>
<td>Rp ${formatRupiah(periodModal.value)}</td>
</tr>

<tr>
<td>Profit</td>
<td>Rp ${formatRupiah(periodProfit.value)}</td>
</tr>



<tr>
<td>Total Transaksi</td>
<td>${filteredTransactions.value.length}</td>
</tr>

<tr>
<td>Produk Terjual</td>
<td>${totalProdukTerjual.value}</td>
</tr>

</table>

</div>

<div class="section">

<h3>Analisis Kinerja</h3>

<table>

<tr>
<td>Margin Profit</td>
<td>${periodMargin.value.toFixed(1)}%</td>
</tr>

<tr>
<td>Status Profit</td>
<td>

${
    periodMargin.value >= 50
    ? 'Sangat Baik'
    : periodMargin.value >= 30
    ? 'Baik'
    : periodMargin.value >= 20
    ? 'Cukup'
    : 'Perlu Evaluasi'
}

</td>
</tr>

</table>

</div>

<div class="section">

<h3>Top 5 Produk Terlaris</h3>

<table>

<tr>

<th class="no">No</th>
<th>Nama Produk</th>
<th class="qty">Terjual</th>

</tr>

${topProducts.value.map((item,index) => `

<tr>

<td class="no">
${
    index === 0 ? '🥇' :
    index === 1 ? '🥈' :
    index === 2 ? '🥉' :
    index + 1
}
</td>

<td class="text-left">
${item.name}
</td>

<td class="qty">
${item.total}
</td>

</tr>

`).join('')}

</table>

</div>





<div class="section">

<h3>Persediaan Produk</h3>

<table>

<tr>

<th class="no">No</th>
<th>Nama Produk</th>
<th class="stock">Stok</th>
<th class="status">Status</th>

</tr>

${stockStatus.value.map((item,index) => `

<tr>

<td class="no">
${index + 1}
</td>

<td class="text-left">
${item.name}
</td>

<td class="stock">
${item.stock}
</td>

<td class="status">
${item.status}
</td>

</tr>

`).join('')}

</table>

</div>

</body>

</html>

`)

    printWindow.document.close()

    printWindow.print()

}

</script>

<style scoped>

input[type="date"]::-webkit-calendar-picker-indicator{

    filter: invert(1);

    cursor: pointer;

}

.table-container{

    background:#111827;

    border-radius:20px;

    overflow:hidden;

    margin-top:20px;
}

table{

    width:100%;

    border-collapse:collapse;
}

th{

    background:#1f2937;

    padding:10px 12px;

    text-align:left;

    font-size:18px;

    font-weight:600;

}

@media(max-width:768px){

    th{

        font-size:15px;

        padding:8px;

    }

    td{

        font-size:12px;

        padding:8px;

    }

}

td{

    padding:15px;

    border-top:1px solid #374151;
}


.summary-card{

    display:grid;

    grid-template-columns:
    repeat(4,1fr);

    gap:20px;

    margin-bottom:20px;

}

.summary-card div:hover{

    transform:
        translateY(-5px);

}

.summary-card div{

    background:#111827;

    padding:20px;

    border-radius:20px;

    transition:.3s;

    cursor:pointer;

    color:white;

    min-height:110px;

    display:flex;

    flex-direction:column;

    justify-content:center;

}

.summary-card div:hover{

    transform:
        translateY(-5px);

    box-shadow:
        0 10px 25px rgba(0,0,0,.3);

}


.margin-card{

    background:
    linear-gradient(
        135deg,
        #92400e,
        #f59e0b
    ) !important;

}

.action-bar{

    margin-bottom:20px;

}

.btn-print{

    background:#2563eb;

    color:white;

    border:none;

    padding:10px 14px;

    font-size:13px;

    border-radius:12px;

    cursor:pointer;

    font-weight:bold;

}

.btn-print:hover{

    opacity:.9;

}

.report-section{

    background:#111827;

    border-radius:20px;

    padding:20px;

    margin-top:20px;

}

.report-section h2{

    margin-bottom:20px;

}

.success{

    color:#22c55e;

    font-weight:600;

    font-size:12px;

}

.warning{

    color:#f59e0b;

    font-weight:600;

    font-size:12px;

}

.danger{

    color:#ef4444;

    font-weight:600;

    font-size:12px;

}

.subtitle{

    opacity:.7;

    margin-bottom:20px;

}

.filter-box{

    display:flex;

    gap:20px;

    margin:0px 0;

    flex-wrap:wrap;

    align-items:end;

}

.filter-box div{

    display:flex;

    flex-direction:column;

    gap:8px;

}

.filter-box label{

    font-size:14px;

    font-weight:600;

    color:#d1d5db;

}

.filter-box input{

    width:140px;

    height:40px;

    font-size:13px;

    padding:14px 16px;

    border:none;

    border-radius:14px;

    background:#111827;

    color:white;


    outline:none;

}

.filter-box input:focus{

    box-shadow:
        0 0 0 2px #2563eb;

}

.omzet-card{

    background:
    linear-gradient(
        135deg,
        #065f46,
        #14b8a6
    ) !important;

}

.modal-card{

    background:
    linear-gradient(
        135deg,
        #1e3a8a,
        #3b82f6
    ) !important;

}

.profit-card{

    background:
    linear-gradient(
        135deg,
        #166534,
        #22c55e
    ) !important;

}

.transaksi-card{

    background:
    linear-gradient(
        135deg,
        #581c87,
        #a855f7
    ) !important;

}

.terjual-card{

    background:
    linear-gradient(
        135deg,
        #9d174d,
        #ec4899
    ) !important;

}

.aktif-card{

    background:
    linear-gradient(
        135deg,
        #155e75,
        #06b6d4
    ) !important;

}

.restock-card{

    background:
    linear-gradient(
        135deg,
        #9a3412,
        #f97316
    ) !important;

}




.filter-box{

    display:flex;

    align-items:flex-end;

    gap:16px;

    margin-bottom:10px;

    flex-wrap:wrap;

}

.filter-item{

    display:flex;

    flex-direction:column;

    gap:8px;

}

.filter-item label{

    font-size:14px;

    font-weight:600;

    color:white;

}

.filter-item input{

    width:200px;

    height:48px;

    padding:0 14px;

    border:none;

    border-radius:14px;

    background:#111827;

    color:white;

}

.btn-print{

    height:48px;

    padding:0 24px;

    border:none;

    border-radius:14px;

    background:#2563eb;

    color:white;

    font-weight:600;

    cursor:pointer;

    white-space:nowrap;

}

@media(max-width:768px){

    .filter-item input{

    width:100px;

    height:48px;

    padding:0 14px;

    border:none;

    border-radius:14px;

    background:#111827;

    color:white;

}

.product-grid{

        grid-template-columns:
            repeat(3,1fr);

        gap:12px;

   


    .filter-box{

        display:grid;

        gap:10px;

         }

    .btn-print{

        display:grid;

        height:10px;

   
     }
    }


    .filter-item label{

        font-size:11px !important;

    }

    .filter-item input{

        height:2px;

        padding:1px 1px;

        font-size:11px;

    }

    .btn-print{

        height:30px;

        padding:0 8px;

        font-size:11px;

        white-space:nowrap;

    }



    .summary-card{

        grid-template-columns:
            repeat(2,1fr);

        gap:10px;

    }

    .summary-card div{

        padding:12px !important;

        min-height:70px;

    }

    .summary-card h2{
    font-size:18px;}

}


@media (max-width: 900px) and (orientation: landscape){

.filter-item input{

    width:100px;

    height:48px;

    padding:0 14px;

    border:none;

    border-radius:14px;

    background:#111827;

    color:white;

}

.product-grid{

        grid-template-columns:
            repeat(3,1fr);

        gap:12px;

   


    .filter-box{

        display:grid;

        gap:10px;

         }

    .btn-print{

        display:grid;

        height:10px;

   
     }
    }


    .filter-item label{

        font-size:11px !important;

    }

    .filter-item input{

        height:2px;

        padding:1px 1px;

        font-size:11px;

    }

    .btn-print{

        height:30px;

        padding:0 8px;

        font-size:11px;

        white-space:nowrap;

    }



    .summary-card{

        grid-template-columns:
            repeat(2,1fr);

        gap:10px;

    }

    .summary-card div{

        padding:12px !important;

        min-height:70px;

    }

    .summary-card h2{
    font-size:18px;}

}


</style>