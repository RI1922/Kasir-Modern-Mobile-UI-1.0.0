<template>
  <MainLayout>

    <div class="dashboard">

      <div class="card omzet">
        <h3>💰 Omzet</h3>
        <h1>
    Rp {{ formatRupiah(totalOmzet) }}
</h1>
      </div>

      <div class="card profit">
        <h3>📈 Profit</h3>
        <h1>
    Rp {{ formatRupiah(totalProfit) }}
</h1>
      </div>

      <div
    class="card"
    :class="marginClass"
>

    <h3>
        🎯 Margin Profit
    </h3>

    <h1>

{{ marginProfit.toFixed(1) }}%

</h1>

<h3>

{{

marginProfit >= 50

? 'Sangat Baik'

: marginProfit >= 30

? 'Baik'

: marginProfit >= 20

? 'Cukup'

: 'Perlu Ditingkatkan'

}}

</h3>

</div>

      <div class="card stock-card">

    <h3>
        📦 Kondisi Stok
    </h3>

    <div class="stock-item">

        <h3>
            ✅ Aman
        </h3>

        <strong>
            {{ stokAman }}
        </strong>

    </div>

    <div class="stock-item">

        <h3>
            ⚠️ Restok
        </h3>
            

        <strong>
            {{ stokRestok }}
        </strong>

    </div>

    <div class="stock-item">

        <h3>
            ❌ Habis
        </h3>

        <strong>
            {{ stokHabis }}
        </strong>

    </div>

</div>

    </div>

    <div class="bottom-section">

    <div class="top-products">

    <h2>
        🏆 Produk Terlaris
    </h2>

    <div
        v-if="topProducts.length"
    >

        <div
    v-for="(item,index) in topProducts"
    :key="item.name"
    class="top-item"
>

    <div class="top-left">

        {{ index === 0 ? '🥇' :
   index === 1 ? '🥈' :
   index === 2 ? '🥉' :
   '🏅' }}
        {{ item.name }}

    </div>

    <div class="top-right">

        {{ item.total }}
        terjual

    </div>

</div>

    </div>

    <p
        v-else
    >

        Belum ada transaksi

    </p>

</div>

<div class="sales-chart">

    <h2>
        📊 Penjualan & Profit Bulanan
    </h2>

    <div class="chart-scroll">

    <div class="chart-container">

        <canvas ref="salesCanvas"></canvas>

    </div>

</div>

</div>

</div>

  </MainLayout>
</template>

<script setup>

import {
    ref,
    computed,
    onMounted,
    nextTick
} from 'vue'

import MainLayout from '../layouts/MainLayout.vue'

import { productService }
from '../services/productService'

import { transactionService }
from '../services/transactionService'

import Chart from 'chart.js/auto'

const totalProduk = ref(0)

const stokAman = ref(0)

const stokRestok = ref(0)

const stokHabis = ref(0)

const totalTransaksi = ref(0)

const totalOmzet = ref(0)

const totalProfit = ref(0)

const marginProfit = ref(0)

const topProducts = ref([])

const salesCanvas = ref(null)

let salesChart = null

const formatRupiah = (value) => {

    return new Intl.NumberFormat(
        'id-ID'
    ).format(value || 0)

}

const marginClass = computed(() => {

    if(marginProfit.value >= 50){

        return 'margin-good'

    }

    if(marginProfit.value >= 30){

        return 'margin-normal'

    }

    if(marginProfit.value >= 20){

        return 'margin-warning'

    }

    return 'margin-danger'

})

const loadData = async () => {

    const products =
        await productService.getAll()

    const transactions =
        await transactionService.getAll()

    totalProduk.value =
        products.length

stokAman.value =

    products.filter(

        item => item.stock > 20

    ).length

stokRestok.value =

    products.filter(

        item =>

            item.stock > 0

            &&

            item.stock <= 20

    ).length

stokHabis.value =

    products.filter(

        item => item.stock <= 0

    ).length


    totalTransaksi.value =
        transactions.length

    totalOmzet.value =
        transactions.reduce(

            (sum,item) =>

                sum + Number(item.total || 0),

            0

        )

    totalProfit.value =
        transactions.reduce(

            (sum,item) =>

                sum + Number(item.profit || 0),

            0

        )

        marginProfit.value =

    totalOmzet.value > 0

    ?

    (

        totalProfit.value

        /

        totalOmzet.value

    ) * 100

    :

    0

        const soldProducts = {}

transactions.forEach(transaction => {

    transaction.items?.forEach(item => {

        if(!soldProducts[item.name]){

            soldProducts[item.name] = 0

        }

        soldProducts[item.name] += Number(item.qty)

    })

})

topProducts.value =

    Object.entries(soldProducts)

    .map(([name,total]) => ({

        name,

        total

    }))

    .sort((a,b) =>

        b.total - a.total

    )

    .slice(0,5)

await nextTick()

renderSalesChart(transactions)


}


const renderSalesChart = (transactions) => {

const today = new Date()

const year = today.getFullYear()

const month = today.getMonth()

const isMobile = window.innerWidth <= 768

const lastDay = new Date(
    year,
    month + 1,
    0
).getDate()

const labels = []

const salesData = []

const profitData = []

for(let day = 1; day <= lastDay; day++){

    labels.push(day)

    let totalSales = 0

let totalProfit = 0

    transactions.forEach(transaction => {

        const trxDate =
            new Date(transaction.createdAt)

        if(

            trxDate.getDate() === day &&

            trxDate.getMonth() === month &&

            trxDate.getFullYear() === year

        ){

            totalSales += Number(
    transaction.total || 0
)

totalProfit += Number(
    transaction.profit || 0
)

        }

    })

    salesData.push(totalSales)

profitData.push(totalProfit)

}

    if(salesChart){

        salesChart.destroy()

    }

    salesChart = new Chart(

        salesCanvas.value,

        {

            type:'line',

            data:{

                labels,

datasets:[

{

    label:'Omzet',

    data:salesData,

    borderColor:'#22c55e',

    backgroundColor:'rgba(34,197,94,0.15)',

    fill:true,

    tension:0.4,

    pointRadius:4,

    pointHoverRadius:7

},

{

    label:'Profit',

    data:profitData,

    borderColor:'#facc15',

    backgroundColor:'rgba(250,204,21,0.15)',

    fill:true,

    tension:0.4,

    pointRadius:4,

    pointHoverRadius:7

}

]

            },

            options:{

    responsive:true,

    maintainAspectRatio:false,

    interaction:{
        mode:'index',
        intersect:false
    },

    plugins:{

        tooltip:{
            enabled:true
        },

        legend:{
            labels:{
                color:'#ffffff'
            }
        }

    },

    scales:{

        x:{

            title:{
                display:true,
                text:'Tanggal',
                color:'#ffffff'
            },

        },

        y:{

    title:{
        display:false
    },

    ticks:{
        color:'rgba(255,255,255,0.5)',

        callback:function(value){

            if(value >= 1000000){

        return (value / 1000000) + 'JT'

    }

    if(value >= 1000){

        return (value / 1000) + 'K'

    }

    return value

}

    }

}
    }



            }

        }

    )

}

onMounted(loadData)

</script>

<style scoped>

.dashboard{

    display:grid;

    grid-template-columns:
        repeat(4,1fr);

    gap:20px;

    animation:
        fadeIn .5s ease;

}

.card{

    padding:25px;

    min-height:140px;

    border-radius:24px;
    
    color:white;

    position:relative;

    overflow:hidden;

    cursor:pointer;

    transition:.3s ease;

    box-shadow:
        0 10px 30px rgba(0,0,0,.25);

}

.card::before{

    content:'';

    position:absolute;

    top:0;

    left:-120%;

    width:80%;

    height:100%;

    background:
        linear-gradient(

            90deg,

            transparent,

            rgba(255,255,255,.15),

            transparent

        );

    transition:.6s;

}

.card:hover::before{

    left:120%;

}

.card:hover{

    transform:
        translateY(-8px);

    box-shadow:
        0 20px 50px rgba(0,0,0,.4);

}

.omzet{
    background:linear-gradient(135deg,#0f172a,#00ffb7);
}

.profit{
    background:linear-gradient(135deg,#0f172a,#0044ff);
}

.card h1{

    margin-top:18px;

    margin-bottom:8px;
    

}

.stock-card{

    background:
    linear-gradient(
        135deg,
        #581c87,
        #d946ef
    );

}

.stock-item{

    display:flex;

    justify-content:space-between;

    align-items:center;

    margin-top:8px;

    padding:10px 13px;

    background:
    rgba(255,255,255,.12);

    border-radius:12px;

    font-size:12px;

}

.stock-item strong{

    font-size:14px;

}

@keyframes fadeIn{

    from{

        opacity:0;

        transform:
            translateY(20px);

    }

    to{

        opacity:1;

        transform:
            translateY(0);

    }

}

.top-products{

    background:#111827;

    border-radius:24px;

    padding:30px;

    overflow:hidden;

}

.top-products h2{

    margin-bottom:25px;

}

.top-item{

    display:flex;

    justify-content:space-between;

    align-items:center;

    padding:16px 20px;

    margin-bottom:16px;

    background:#1f2937;

    border-radius:16px;

}

.top-left{

    font-weight:600;

    overflow:hidden;

    text-overflow:ellipsis;

    white-space:nowrap;

    max-width:75%;

}

.top-right{

    color:#22c55e;

    font-weight:bold;

}

.top-item:hover{

    transform:translateX(8px);

}

.top-item strong{

    color:#22c55e;

}

.bottom-section{

    display:flex;

    flex-direction:column;

    gap:20px;

    margin-top:20px;

    align-items:stretch;

}

.sales-chart{

    background:#111827;

    border-radius:24px;

    padding:25px;

}

.margin-good{

    background:
    linear-gradient(
        135deg,
        #145315,
        #00ff1e
    );

}

.margin-normal{

    background:
    linear-gradient(
        135deg,
        #83850e,
        #f6ff00
    );

}

.margin-warning{

    background:
    linear-gradient(
        135deg,
        #9a6112,
        #ffb700
    );

}

.margin-danger{

    background:
    linear-gradient(
        135deg,
        #7f1d1d,
        #ff0000
    );

}

.chart-container{

    position:relative;

    width:100%;

    height:420px;

}

.chart-scroll{

    width:100%;

    overflow-x:auto;

    overflow-y:hidden;

}

@media(max-width:768px){

    .chart-scroll{

    overflow-x:auto;

    -webkit-overflow-scrolling:touch;

}

.chart-container{

    width:650px;

    height:260px;

}

}

.chart-container canvas{

    width:100% !important;

    height:100% !important;

}


/* ==================================
   MOBILE
================================== */

@media(max-width:768px){

    .dashboard{

        grid-template-columns:
            repeat(2,1fr);

        gap:12px;

    }


    .card{

        min-height:110px;

        padding:15px;

        border-radius:14px;

    }

    .card h1{

        font-size:14px;

    }

    .card h3{

        font-size:14px;

    }


    .chart-container{

        height:260px;

    }


    .top-products{

        padding:16px;

    }

    .top-item{

        padding:10px 12px;

        margin-bottom:10px;

    }

    .stock-item{

        margin-top:5px;

        padding:5px 8px;

        border-radius:8px;

        font-size:12px;

    }

}


</style>