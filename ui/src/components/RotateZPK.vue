<template>
<div class="inline">
    <slot :show="openModal" :close="closeModal" :toggleModal="toggleModal">
        <button @click="openModal">
            show
        </button>
    </slot>
    <div :class="`modal ${!show && 'opacity-0 pointer-events-none'
    } z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center`">
        <div class="absolute w-full h-full bg-gray-900 opacity-50 modal-overlay"></div>

        <div class="z-50 w-11/12 mx-auto overflow-y-auto bg-white rounded shadow-lg modal-container md:max-w-md">
            <div @click="show = false"
                class="absolute top-0 right-0 z-50 flex flex-col items-center mt-4 mr-4 text-sm text-white cursor-pointer modal-close">
                <svg class="text-white fill-current" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                    viewBox="0 0 18 18">
                    <path
                        d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z" />
                </svg>
                <span class="text-sm">(Esc)</span>
            </div>

            <!-- Add margin if you want to see some of the overlay behind the modal-->
            <div class="px-6 py-4 space-y-3 text-left modal-content">
                <!--Title-->
                <div class="flex items-center justify-between pb-3">
                    <div class="text-lg font-bold text-center text-gray-800">
                        Rotate ZPK for provider
                    </div>
                    <div class="z-50 cursor-pointer modal-close" @click="closeModal">
                        <svg class="text-black fill-current" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                            viewBox="0 0 18 18">
                            <path
                                d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z" />
                        </svg>
                    </div>
                </div>

                <!--Body-->
                <div class="grid grid-cols-3 gap-3">
                   <button
                        :disabled="rotating.has('isw')"
                        @click="rotateKPK('isw')"
                        class="text-red-600 px-3 py-2 border border-red-100  rounded shadow bg-white hover:shadow-sm disabled:bg-gray-200">ISW ZPK</button>
                   <button
                        :disabled="rotating.has('hydrogen')"
                        @click="rotateKPK('hydrogen')"
                        class="text-orange-600 px-3 py-2 border border-orange-100  rounded shadow bg-white hover:shadow-sm disabled:bg-gray-200">Hydrogen ZPK</button>
                </div>
                <!--Footer-->
                <div class="flex justify-end pt-2">
                    <button @click="closeModal"
                        class="p-3 px-6 py-3 mr-2 text-gray-500 bg-transparent rounded-lg disabled:pointer-events-none hover:bg-gray-100 hover:text-gray-400 focus:outline-none">
                        Close
                    </button>

                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script setup lang="ts">
import { inject, ref } from "vue";
// @ts-ignore
import Input from './Input.vue'
import { Profile } from "../views/profiles/Profiles.vue";
import { notify } from "@kyvg/vue3-notification";
import { Axios } from "axios";
type Props  = {
    profile: Profile
}
const {profile} = defineProps<Props>()
const rotating = ref<Set<'isw'|'hydrogen'>>(new Set());
const show = ref<boolean>(false);
const emmitter = defineEmits(['update:value', 'accepted']);
const $axios: Axios = inject('$axios')

const toggleModal = (state: boolean) => {
    show.value = state
}

const rotateKPK = async (type: 'isw'| 'hydrogen')=> {
    try {
        rotating.value.add(type)
        const {data} = await $axios.post(`/dashboard/profiles/${profile._id}/rotate-keys`,{
            type
        })
    } catch (error) {
        notify({
            title: "Error",
            type: "error",
            text: error?.response?.data?.message ?? error?.message
        })
    }finally {
        rotating.value.delete(type)
    }
}

const closeModal = () => {
    show.value = false
}

const openModal = () =>{
    console.log("open modal")
    show.value = true
}
</script>