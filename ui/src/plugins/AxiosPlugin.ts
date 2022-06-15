import { App } from "vue";
import Axios from 'axios';
export const appHttp = Axios.create({
    baseURL: '/api/v1',
    withCredentials: true,
})

appHttp.interceptors.response.use(response=>response,error=>{
    console.log(error)
    return Promise.reject(error);
})

export default {
    install: (app: App<Element>, options:object) => {
        app.config.globalProperties.$axios = appHttp;
        app.config.globalProperties.$request = appHttp;
        app.provide('$axios',appHttp);
        app.provide('$request',appHttp);
    }
}