import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

// bootstrap css and scripts
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import './styles.css' // small custom styles

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
