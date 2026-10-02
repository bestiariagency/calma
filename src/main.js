import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './router/index.js'
import { startContentRefresh } from './composables/useSiteContent.js'
import reveal from './directives/reveal.js'

// Landing pública: la petición del contenido arranca antes de montar (el panel no la necesita).
if (!location.pathname.startsWith('/admin')) startContentRefresh()

createApp(App).use(router).use(reveal).mount('#app')
