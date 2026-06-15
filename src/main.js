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

//import { seedTest } from './utils/testDb'

registerSW({
    immediate:true
})

//seedTest()

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

inject()
injectSpeedInsights()