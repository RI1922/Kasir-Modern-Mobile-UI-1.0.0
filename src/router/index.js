import { createRouter, createWebHashHistory } from 'vue-router'

import Dashboard from '../views/Dashboard.vue'
import Categories from '../views/Categories.vue'
import Brands from '../views/Brands.vue'
import Products from '../views/Products.vue'
import Cashier from '../views/Cashier.vue'
import Reports from '../views/Reports.vue'
import Transactions from '../views/Transactions.vue'
import Settings from '../views/Settings.vue'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'
import Backup from '../views/Backup.vue'
import MenuMobile from '../views/MenuMobile.vue'

const routes = [

    {
        path:'/login',
        component:Login
    },

    {
    path:'/signup',
    component:Signup
},

    {
        path:'/',
        component:Dashboard
    },

    {
        path:'/kategori',
        component:Categories
    },

    {
        path:'/brand',
        component:Brands
    },

    {
        path:'/produk',
        component:Products
    },

    {
        path:'/kasir',
        component:Cashier
    },

    {
    path:'/laporan',
    component:Reports
},

{
    path:'/reports',
    component:Transactions
},

{
    path:'/settings',
    component:Settings
}

]

const router = createRouter({

    history:createWebHashHistory(),

    routes

})



router.beforeEach((to, from, next) => {

    const isLoggedIn =

        localStorage.getItem(
            'isLoggedIn'
        ) === 'true'

    const hasAccount =

        localStorage.getItem(
            'user_account'
        )

    if(

        !hasAccount &&

        to.path !== '/signup'

    ){

        next('/signup')

        return

    }

    if(

        hasAccount &&

        !isLoggedIn &&

        to.path !== '/login' &&

        to.path !== '/signup'

    ){

        next('/login')

        return

    }

    next()

})

export default router