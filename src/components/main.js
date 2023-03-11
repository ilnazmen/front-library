import '@/components/bootstrap';
import { createApp } from 'vue'
import app from './books/App.vue'
import 'bootstrap/dist/css/bootstrap.css'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
// import './assets/main.css'



import router from "../components/router";

createApp(app)
    .use(router)
    .use(VueDatePicker)
    .mount('#app')

