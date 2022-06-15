import {defineStore} from 'pinia';
import { User } from '../@types/types';
import { appHttp } from '../plugins/AxiosPlugin';
import { useRouter } from 'vue-router';



export const useUserStore = defineStore('auth', {
    state: ()=>{
        return {
            user: null,
        }
    },
    actions:{
        clearState() {
            this.$reset();
        },
        setUser(user: any) {
            this.user = user;
        },
        async getUser() {
            if (this.user) return;
            try {
                const response = await appHttp?.get('/dashboard/auth/user');
                this.setUser(response?.data);
            } catch (error) {
                console.log("failed",error);
            }
        },

        async logoutUser() {
            const router = useRouter();
            console.log(router);
            if(!this.user) {
                return router.replace({name: "Login"})
            }

            try {
                await appHttp?.get('/dashboard/auth/logout');
                router.replace({name: "Login"})
            } catch (error) {
                console.log("failed",error);
            }
        }
    },
    getters:{
        isLoggedIn({user}): boolean {
            return user !== null;
        },
        imageUrl({user}): string {
            return (user as any)?.imageUrl;
        }
    }
})