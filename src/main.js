import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { registerSW } from 'virtual:pwa-register'
import { inject } from '@vercel/analytics'
import { injectSpeedInsights } from '@vercel/speed-insights'



import App from './App.vue'
import router from './router'

import './assets/theme.css'
import './assets/responsive.css'
import './assets/mobile.css'

import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'



//import { seedTest } from './utils/testDb'

registerSW({
    immediate:true
})

//seedTest()

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(Vue3Toastify)

app.mount('#app')

inject()
injectSpeedInsights()

import db from './db/database'

window.db = db

db.open()
.then(() => {

    console.log(
        'DB OK :',
        db.tables.map(
            t => t.name
        )
    )

})

.catch(err => {

    console.error(
        'DB ERROR :',
        err
    )

})

window.onerror = function(
    msg,
    url,
    line,
    col,
    error
){

    console.error(
        'GLOBAL ERROR:',
        msg,
        error
    )

    alert(
        msg +
        '\nLine: ' +
        line
    )

}