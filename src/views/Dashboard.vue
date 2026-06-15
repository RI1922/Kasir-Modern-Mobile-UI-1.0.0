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

<small>

{{

marginProfit >= 50

? 'Sangat Baik'

: marginProfit >= 30

? 'Baik'

: marginProfit >= 20

? 'Cukup'

: 'Perlu Ditingkatkan'

}}

</small>

</div>

      <div class="card stock-card">

    <h3>
        📦 Kondisi Stok
    </h3>

    <div class="stock-item">

        <span>
            ✅ Aman
        </span>

        <strong>
            {{ stokAman }}
        </strong>

    </div>

    <div class="stock-item">

        <span>
            ⚠️ Restok
        </span>

        <strong>
            {{ stokRestok }}
        </strong>

    </div>

    <div class="stock-item">

        <span>
            ❌ Habis
        </span>

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

    <div class="chart-container">

    <canvas
        ref="salesCanvas"
    ></canvas>

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

console.log(
    salesCanvas.value,
    salesCanvas.value?.offsetWidth,
    salesCanvas.value?.offsetHeight
)

const renderSalesChart = (transactions) => {

    const today = new Date()

const year = today.getFullYear()

const month = today.getMonth()

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

        ticks:{
            color:'#ffffff'
        }

    },

    y:{

        title:{

            display:true,

            text:'Omzet',

            color:'#ffffff'

        },

        ticks:{
            color:'#ffffff'
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
    grid-template-columns:repeat(auto-fit,minmax(250px,1fr));
    gap:20px;

    animation:
    fadeIn .5s ease;
}

.card{

    padding:25px;

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

.transaksi{
    background:linear-gradient(135deg,#0f172a,#bbff00);
}

.produk{
    background:linear-gradient(135deg,#0f172a,#ff00fb);
}

.card h1{

    margin-top:15px;

    font-size:30px;

    font-weight:700;

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

    margin-top:12px;

    padding:10px 12px;

    background:
    rgba(255,255,255,.12);

    border-radius:12px;

    font-size:15px;

}

.stock-item strong{

    font-size:18px;

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

    height:300px;

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

    gap:30px;

    margin-top:30px;

}

.bottom-section{

    align-items:stretch;

}

.sales-chart{

    background:#111827;

    border-radius:24px;

    padding:25px;

}

.chart-wrapper{

    position:relative;

    width:100%;

    height:400px;

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

    height:400px;

}

.chart-container canvas{

    width:100% !important;

    height:100% !important;

}



</style>