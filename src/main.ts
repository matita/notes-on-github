import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './assets/main.css'
import { useGithubSettings } from './stores/githubSettings'
import { pinia } from './stores'

window.global = window;

const app = createApp(App)

app.use(pinia)
app.use(router)

const settings = useGithubSettings(pinia);
settings.load();

app.mount('#app')
