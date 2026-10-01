import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import reveal from './directives/reveal.js'

createApp(App).use(reveal).mount('#app')
