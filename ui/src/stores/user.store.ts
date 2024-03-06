import {defineStore} from 'pinia';
import { User } from '../@types/types';
import { appHttp } from '../plugins/AxiosPlugin';
import { useRouter, Router } from 'vue-router';

type User = {
    email: string,
    id: string,
    imageUrl: string,
    username: String,
    role: 'admin' | 'user'
    permissions: string[]
}

export  const useUserStore = defineStore('auth', {
    state: ():{user:User|null}=>{
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

        async logoutUser(irouter?: Router) {
            const router = irouter ?? useRouter();


            try {
                if(this.user) {
                    await appHttp?.post('/dashboard/auth/logout');
                }
                this.clearState();
            } catch (error) {
                console.log("failed",error);
            }finally{
                if(!router) {
                    return (window.location.href = "/")
                }
                router.replace({name: "Login"})
            }
        }
    },
    getters:{
        isLoggedIn({user}): boolean {
            return user !== null;
        },
        imageUrl({user}): string {
            return (user as any)?.imageUrl;
        },
        permissions({user}): string[] | undefined{
             const permission = user?.permissions || [];
            return Array.isArray(permission) ? [...new Set([ ...permission])] : ([] as string[ ]);
        },
    }
})

export default useUserStore;