import { createApp } from 'vue'
import { createPinia } from 'pinia'


import App from './App.vue'
import router from './router'

import './assets/theme.css'
import './assets/responsive.css'

import { seedTest } from './utils/testDb'
import './assets/mobile.css'

seedTest()

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')