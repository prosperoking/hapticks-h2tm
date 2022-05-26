import { App } from "vue";
import Axios from 'axios';

export default {
    install: (app: App<Element>, options:object) => {
        const axios = Axios.create({
            baseURL: '/api/v1',
            withCredentials: true,
        })

        axios.interceptors.response.use(response=>response,error=>{
            console.log(error)
            Promise.reject(error);
        } )

        app.config.globalProperties.$axios = axios;
        app.config.globalProperties.$request = axios;
        app.provide('$axios',axios);
        app.provide('$request',axios);
    }
}