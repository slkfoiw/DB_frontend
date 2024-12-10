import './assets/css/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia';
import piniaPersist from 'pinia-plugin-persistedstate';
import * as ElIcons from '@element-plus/icons-vue';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faUtensils } from '@fortawesome/free-solid-svg-icons';
// ≤‡±ﬂ¿∏√¿ªØ
import VueSidebarMenu from 'vue-sidebar-menu'
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'

const app = createApp(App)

for (const name in ElIcons) {
    app.component(name, ElIcons[name]);
}
library.add(faUtensils);
app.component('font-awesome-icon', FontAwesomeIcon);

app.use(router)
app.use(store)
app.use(ElementPlus, { locale: zhCn })
const pinia = createPinia()
pinia.use(piniaPersist)

app.use(pinia)
app.use(VueSidebarMenu)
app.mount('#app')
