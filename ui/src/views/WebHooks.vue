<template>
    <h3 class="text-gray-700 text-3xl font-medium space-x-2">
        <span>WebHook Requests</span>
        <small class="text-sm text-blue-500" v-if="state.busy">Loading ...</small>
    </h3>
    <div class="flex items-center justify-between my-6">
        <div class="flex w-6/12 space-x-4">
            <div class="relative block w-full mt-2 sm:mt-0">
                <span class="absolute inset-y-0 left-0 flex items-center pl-2">
                    <svg viewBox="0 0 24 24" class="w-4 h-4 text-gray-500 fill-current">
                        <path
                            d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z" />
                    </svg>
                </span>

                <input placeholder="Search by tid or merchant name" v-model="query"
                    class="flex w-full py-2 pl-8 pr-6 text-sm text-gray-700 placeholder-gray-400 bg-white border border-b border-gray-400 rounded appearance-none focus:bg-white focus:placeholder-gray-800 focus:text-gray-700 focus:outline-none" />
            </div>
            <div class="space-x-2">
                <button @click="fetchData"
                    class="px-3 py-2 font-medium tracking-wide text-white bg-gray-800 rounded-md hover:bg-gray-500 focus:outline-none">
                    search
                </button>
            </div>
        </div>

    </div>
    <div class="flex space-x-5">
        <section class="w-full">
            <div class="inline-block w-full overflow-hidden rounded-lg shadow bg-white">
                <table class="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th
                                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-800 uppercase bg-gray-100 border-b-2 border-gray-200">
                                TID
                            </th>
                            <th
                                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-800 uppercase bg-gray-100 border-b-2 border-gray-200">
                                Info
                            </th>
                            <th
                                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-800 uppercase bg-gray-100 border-b-2 border-gray-200">
                                Status
                            </th>
                            <th
                                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-800 uppercase bg-gray-100 border-b-2 border-gray-200">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="(u) in state.webhooks.docs" :key="u._id">
                            <tr>
                                <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                                    <div class="flex items-center">
                                        <!-- <div class="flex-shrink-0 w-10 h-10">
                        <img
                          class="w-full h-full rounded-full"
                          :src="u.terminalId"
                          alt="profile pic"
                        />
                      </div> -->
                                        <svg v-if="u.isRetry" xmlns="http://www.w3.org/2000/svg" fill="none"
                                            viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                            class="w-6 h-6 text-green-400">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" />
                                        </svg>

                                        <div class="ml-3">
                                            <p class="text-gray-900 text-xs whitespace-nowrap">
                                                {{ u.terminalId }}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-5 py-5 text-xs bg-white border-b border-gray-200">
                                    <p
                                        class="text-gray-900 whitespace-nowrap w-24 lg:w-44 overflow-hidden text-ellipsis">
                                        {{ u.payload.merchantName }}
                                    </p>
                                    <p class="text-gray-900 whitespace-nowrap">
                                        {{ dateFormatter(u.createdAt ?? '') }}
                                    </p>
                                    <p :title="u.url" v-if="u.url?.length" class="text-blue-400 my-1 text-xs whitespace-nowrap overflow-hidden text-ellipsis">
                                        {{ u.url }}
                                    </p>
                                    <p class="text-gray-700 whitespace-nowrap text-xs"><span class="font-bold">HTTP CODE:</span> {{ u.responseCode }}</p>
                                </td>
                                <td class="px-5 py-5 text-xs bg-white border-b border-gray-200">
                                    <span
                                        :class="`relative inline-block px-3 py-1  ${u.status === 'success' ? 'bg-green-600' : 'bg-gray-800'} text-white rounded-full border  leading-tight`">
                                        <span aria-hidden :class="`absolute inset-0 opacity-50 rounded-full`"></span>
                                        <span class="relative">{{ u.status }}</span>
                                    </span>
                                </td>
                                <td class="px-5 py-5 space-x-2 text-sm bg-white border-b border-gray-200">
                                    <button @click="selected = selected === u? null : u" title="view"
                                        class="text-blue-500 hover:text-blue-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                            stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </button>
                                    <button :disabled="state.busy"
                                        @click="confirmResend = { ...confirmResend, show: true, id: u._id }"
                                        class="text-green-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                            stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                            <tr v-if="selected?._id === u._id">
                                <td class="bg-gray-300" colspan="5">
                                    <section class="py-4 px-2 rounded space-y-3">

                                        <div class="flex justify-end">
                                            <button class="text-gray-500" @click="selected = null">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                    stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        d="M6 18L18 6M6 6l12 12" />
                                                </svg>


                                            </button>
                                        </div>
                                        <Disclosure as="div" class="bg-white p-2 rounded">
                                            <DisclosureButton class="flex w-full">
                                                Payload
                                            </DisclosureButton>
                                            <DisclosurePanel class="text-gray-500">
                                                <HighLightJS lang="json" :code="selectedData.payload ?? ''" />
                                            </DisclosurePanel>
                                        </Disclosure>
                                        <Disclosure as="div" class="bg-white p-2 rounded">
                                            <DisclosureButton class="flex w-full">
                                                Headers
                                            </DisclosureButton>
                                            <DisclosurePanel class="text-gray-500">
                                                <HighLightJS lang="json" :code="selectedData.headers ?? ''" />
                                            </DisclosurePanel>
                                        </Disclosure>
                                        <Disclosure as="div" class="bg-white p-2 rounded">
                                            <DisclosureButton class="flex w-full">
                                                Response
                                            </DisclosureButton>
                                            <DisclosurePanel class="text-gray-500 max-h-96 overflow-y-auto">
                                                <HighLightJS :lang="selectedData.responseLang"
                                                    :code="selectedData.responseBody ?? ''" />
                                            </DisclosurePanel>
                                        </Disclosure>


                                    </section>
                                </td>
                            </tr>
                        </template>

                        <tr v-if="state.webhooks.docs.length < 1">
                            <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                                <div class="flex items-center text-center text-gray-400">
                                    No request here
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div v-if="state.webhooks?.totalPages > 1"
                    class="flex flex-col items-center px-5 py-5 bg-white border-t xs:flex-row xs:justify-between">
                    <div class="space-x-10">
                        <span class="text-xs text-gray-900 xs:text-sm">
                            Page {{ state.webhooks.page }} of {{ state.webhooks.totalPages }}
                        </span>
                        <span class="text-xs text-gray-900 xs:text-sm">Showing 1 to {{ state.webhooks.limit }} of
                            {{ state.webhooks.totalDocs }} requests</span>
                    </div>

                    <div class="inline-flex mt-2 xs:mt-0">
                        <button :disabled="!state.webhooks.hasPrevPage"
                            @click="() => gotoPage(state.webhooks?.prevPage || 1)"
                            class="px-4 py-2 text-sm font-semibold text-gray-800 bg-gray-300 rounded-l disabled:opacity-30 hover:bg-gray-400">
                            Prev
                        </button>
                        <button :disabled="!state.webhooks.hasNextPage"
                            @click="() => gotoPage(state.webhooks.nextPage || 1)"
                            class=" disabled:text-gray-400 px-4 py-2 text-sm font-semibold text-gray-800 bg-gray-300 rounded-r disabled:opacity-20 hover:bg-gray-400">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </section>


    </div>
    <ConfirmDialog v-model:value="confirmResend.show" title="Do you want to resend this Request?"
        :message="confirmResend.message" @accepted="handleConfirmDialog" />
</template>
<script setup lang="ts">

import { AxiosInstance } from "axios";
import { ref, reactive, watch, onMounted, inject, computed } from "vue";
import { PaginatedData, WebhookRequest } from "../@types/types";
import useDebouncedRef from "../utils/DebounceRef";
import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/github-dark-dimmed.css';
import JSONHljs from 'highlight.js/lib/languages/json';
import XMLHljs from 'highlight.js/lib/languages/xml';
import hljsVuePlugin from '@highlightjs/vue-plugin';
import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
} from '@headlessui/vue'
// @ts-ignore
import ConfirmDialog from '../components/ConfirmDialog.vue'
import { notify } from '@kyvg/vue3-notification';
import { dateFormatter } from '../utils/Formatters';

hljs.registerLanguage('json', JSONHljs);
hljs.registerLanguage('xml', XMLHljs);

interface State {
    busy: boolean,
    webhooks: PaginatedData<WebhookRequest>
}

const request: AxiosInstance = inject('$axios')!;
const HighLightJS = hljsVuePlugin.component;
const state: State = reactive<State>({
    busy: false,
    webhooks: {
        docs: [],
        totalDocs: 0,
        limit: 30,
        page: 1,
        totalPages: 1,
    },
})


const query = useDebouncedRef('', 400);
const webhookId = ref();
const confirmResend = ref<{
    show: boolean,
    id?: string,
    message?: string,
    title?: string
}>({
    show: false,
    message: "Resend Webhook Request ?",
    title: "Confirm Repush",
    id: '',

})

const selected = ref<WebhookRequest | null>(null);
const handleConfirmDialog = (result: boolean) => {
    if (!result) return;
    resendRequest(confirmResend.value.id);
}
const fetchData = async () => {
    try {
        state.busy = true;
        const { page, limit } = state.webhooks;
        const params = { page, limit, q: query.value, webhookId: webhookId.value }
        // @ts-ignore: Unreachable code error
        const { data } = await request?.get('/dashboard/webhook-requests', {
            params
        });
        state.webhooks = data;
    } catch (error: any) {

        if (error.isAxiosError) {

        }
    } finally {
        state.busy = false;
    }
}



const resendRequest = async (id?: string | null) => {
    try {
        state.busy = true;
        const { page, limit } = state.webhooks;
        const params = { page, limit, q: query.value, webhookId: webhookId.value }
        // @ts-ignore: Unreachable code error
        const { data } = await request?.get(`/dashboard/webhook-requests/retry/${id}`);
        state.webhooks = data;
        notify({
            title: "Request Dispatched",
            type: "success",
            text: "Your request to resend webhook has being sent"
        })
        fetchData();
    } catch (error: any) {
        let message = error.message
        if (error.isAxiosError) {
            message = error.response.data.message;
        }
        notify({
            title: "Error",
            type: "danger",
            text: message,
        });
    } finally {
        state.busy = false;
    }
}

const gotoPage = (page: number) => {
    state.webhooks.page = page;
    fetchData();
}

const selectedData = computed(() => {
    const data = selected.value!
    if (!data) return {}
    return {
        payload: JSON.stringify(data.payload, null, 1),
        headers: JSON.stringify({
            'x-verify-string': data.verifyString,
            'x-signature': data.verifySignature,
        }, null, 1),
        responseLang: data.responseType === 'application/json' ? 'json' : 'xml',
        responseBody: data.responseType === 'application/json' ?
            JSON.stringify(JSON.parse(data.responseBody), null, 1) :
            data.responseBody,
    }
})

watch(query, (value, prev) => {
    if (value === prev) return;
    fetchData()
})

watch(webhookId, (value, prev) => {
    fetchData()
})



onMounted(() => {

    fetchData()
});
</script>