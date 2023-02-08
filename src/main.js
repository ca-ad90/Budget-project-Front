import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import loop from "./components/loop.vue"
import { dbUrl } from "./db.config.js";

import './assets/main.css'

const app = createApp(App)
app.component("loop-component", loop)
app.use(createPinia())
app.use(router)
window.app = app
app.mount('#app')
