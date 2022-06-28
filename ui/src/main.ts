import { createApp } from 'vue';
import {createPinia} from 'pinia'
import App from './App.vue';
import router from './router';
import AxiosPlugin from './plugins/AxiosPlugin';
import Notifications from "@kyvg/vue3-notification";

import './assets/main.css';

import DashboardLayout from './components/DashboardLayout.vue';
import EmptyLayout from './components/EmptyLayout.vue';

const app = createApp(App);

app.use(Notifications)

app.component('default-layout', DashboardLayout);
app.component('empty-layout', EmptyLayout);

app.use(router);
app.use(AxiosPlugin)
app.use(createPinia())
app.mount('#app');
