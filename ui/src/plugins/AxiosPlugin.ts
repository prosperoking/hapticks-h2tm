import { App } from "vue";
import Axios from 'axios';
import { AxiosError } from 'axios';
import { notify } from '@kyvg/vue3-notification';
import router from '../../../intellifin-rerouting/src/routes/admin.dashboard.route';
import { useRouter, Router } from 'vue-router';
import { Pinia } from "pinia";
import { useUserStore } from '../stores/user.store';

export const appHttp = Axios.create({
    baseURL: '/api/v1',
    withCredentials: true,
})

interface Options {
    pinia: Pinia,
    router: Router
}
export default {
    install: (app: App<Element>, options:Options) => {

        appHttp.interceptors.response.use(response=>response, async (error: AxiosError)=>{
            const {response} = error;
            const {router, pinia} = options;
            const auth = useUserStore(pinia)
            
            if(response?.status === 401 && auth.user) {
                
                notify({
                    title: "Authentication Error",
                    text: "Not Authenticated /Session timeout"
                })
                auth.clearState();
                return await router.push({
                    name: "Login"
                });
            }
            return Promise.reject(error);
        })
        app.config.globalProperties.$axios = appHttp;
        app.config.globalProperties.$request = appHttp;
        app.provide('$axios',appHttp);
        app.provide('$request',appHttp);
    }
}