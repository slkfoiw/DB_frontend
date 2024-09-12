import './assets/css/main.css'
import './assets/css/preview.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia';
import piniaPersist from 'pinia-plugin-persistedstate';
import * as ElIcons from '@element-plus/icons-vue';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faUtensils } from '@fortawesome/free-solid-svg-icons';

const app = createApp(App)

for (const name in ElIcons) {
    app.component(name, ElIcons[name]);
}
library.add(faUtensils);
app.component('font-awesome-icon', FontAwesomeIcon);

app.use(router)
app.use(store)
app.use(ElementPlus)
const pinia = createPinia()
pinia.use(piniaPersist)

app.use(pinia)
app.mount('#app')
