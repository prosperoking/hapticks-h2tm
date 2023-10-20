<template>
    <div :class="`modal ${!value && 'opacity-0 pointer-events-none'
    } z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center`">
        <div class="absolute w-full h-full bg-gray-900 opacity-50 modal-overlay"></div>

        <div class="z-50 w-11/12 mx-auto overflow-y-auto bg-white rounded shadow-lg modal-container md:max-w-md">
            <div @click="value = false"
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
                        <p v-if="title === undefined">Confirm Action</p>
                        <p v-else>{{ title }}</p>
                    </div>
                    <div class="z-50 cursor-pointer modal-close" @click="value = false">
                        <svg class="text-black fill-current" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                            viewBox="0 0 18 18">
                            <path
                                d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z" />
                        </svg>
                    </div>
                </div>

                <!--Body-->
                <div class="flex flex-col">
                    <div>
                        {{message}}
                    </div>

                    <div v-if="confirm?.length">
                        <Input title="confirm" v-model:value="confirmation" />
                    </div>
                </div>
                <!--Footer-->
                <div class="flex justify-end pt-2">
                    <button @click="closeModal"
                        class="p-3 px-6 py-3 mr-2 text-gray-500 bg-transparent rounded-lg disabled:pointer-events-none hover:bg-gray-100 hover:text-gray-400 focus:outline-none">
                        Close
                    </button>
                    <button :disabled="Boolean(confirm?.length) && confirmation !== confirm" @click="confirmModal"
                        class="px-6 py-3 font-medium tracking-wide text-white bg-gray-800 rounded-md disabled:opacity-25 disabled:pointer-events-none hover:bg-gray-500 focus:outline-none">
                        save
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
// @ts-ignore
import Input from './Input.vue'


interface Props {
    message?: string,
    confirm?: string | null,
    value: boolean,
    title?: string,
}

const { value, confirm, title } = defineProps<Props>()
const confirmation = ref<string | null>(null);
const emmitter = defineEmits(['update:value', 'accepted']);

const toggleModal = (state: boolean) => {
    emmitter("update:value", state || !value);
}

const closeModal = () => {
    emmitter("update:value", false);
}

const confirmModal = () => {
    if ( confirm?.length && confirmation.value !== confirm) return;
    confirmation.value = null;
    emmitter("accepted", true)
    closeModal();
}
</script>