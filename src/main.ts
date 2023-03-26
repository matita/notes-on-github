import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'vue-toast-notification/dist/theme-sugar.css';
import './assets/main.css'
import { useSettings } from './stores/settings'
import { pinia } from './stores'
import { useFilesStore } from './stores/files'

window.global = window;

const app = createApp(App)

app.use(pinia)
app.use(router)

const settings = useSettings(pinia);
settings.load();

const files = useFilesStore(pinia);
files.fetchAllFiles();

window.files = files;

app.mount('#app')
