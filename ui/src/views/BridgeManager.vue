<template>
    <h3 class="space-x-2 text-3xl font-medium text-gray-700">
        <span>Bridge Status</span>
        <small class="text-sm text-blue-500" v-if="state.busy">Loading ...</small>
    </h3>
    <div class="flex items-center justify-between my-6">


    </div>
    <div class="flex space-x-5">
        <section class="w-full">
            <div class="inline-block w-full overflow-hidden bg-white rounded-lg shadow p-4 space-y-3">
                <div class="flex items-center space-x-4">
                    <span>Status:</span>
                    <span :class="{ 'bg-red-500': !state.online, 'bg-green-500': state.online }"
                        class="h-5 w-5 inline-block border rounded-full animiate animate-pulse"></span>
                    <button v-if="state.online" @click="(e) => showConfirmKill()">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                    </button>
                </div>
                <div class="" v-if="state.online">
                    <div class="font-bold">Connections</div>
                    <div class="flex flex-col">

                        <div v-for="con in knownConnections" class="flex justify-between item-center">
                            <div>
                                {{con.title}}: {{ state.connections[con.key]?.connections.length }}
                            </div>
                            <div class="flex flex-col space-y-2 w-2/3 text-xs">
                                 <div v-for="c in state.connections[con.key]?.connections" :key="c.ID"
                                 class="items-center space-x-3 text-center flex">
                                    <span :class="{'bg-green-500': !c.markedForPurge ,'bg-yellow-500': c.markedForPurge}" class="rounded-full inline-block h-4 w-4"></span>
                                    <span :title="c.ID">{{ c.ID.split('/')[0] }}</span>
                                    <span>Marked for Purge:{{c.markedForPurge? "Yes": "NO"}}</span>
                                 </div>
                            </div>
                            <button class="text-red-500 hover:text-red-700" @click="() => showConfirmClearConnection(con.key)" title="Clear Connections">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>

                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </section>

        <ConfirmDialog v-model:value="confirmKill.show" title="Do you want to kill the bridge service?"
            :message="confirmKill.message" @accepted="killServer" />

        <ConfirmDialog v-model:value="confirmClearConnection.show" title="Do you really want to purge ?"
            :message="confirmClearConnection.message"
            @accepted="() => closeConnections(confirmClearConnection.connection)" />
    </div>
</template>
<script setup lang="ts">

import { AxiosInstance } from "axios";
import { ref, reactive, watch, onMounted, inject, computed } from "vue";
import { onBeforeRouteLeave } from "vue-router"
import { PaginatedData, WebhookRequest } from "../@types/types";
import useDebouncedRef from "../utils/DebounceRef";
// @ts-ignore
import ConfirmDialog from '../components/ConfirmDialog.vue'
import { notify } from '@kyvg/vue3-notification';
import { dateFormatter } from '../utils/Formatters';
import { useInterval, useIntervalFn } from "@vueuse/core"


type Connection = {
    connections: [
        { ID: string, markedForPurge: boolean, processor: string }
    ]
}
interface State {
    busy: boolean,
    online: boolean,
    connections: {
        isw: Connection | null,
        habari: Connection | null,
        hydrogen: Connection | null,
    }
}


type IConntionIds = 'isw' | 'habari' | 'hydrogen'
const request: AxiosInstance = inject('$axios')!;
const state: State = reactive<State>({
    busy: false,
    online: false,
    connections: {
        isw: null,
        habari: null,
        hydrogen: null
    },
})

const { pause, resume, isActive } = useIntervalFn(() => {
    pingServer();
    fetchConnections();
}, 10000, {
    immediate: true
})
const knownConnections: {key: IConntionIds, title: string}[] = [
    {key: "isw", title: "ISW"},
    {key: "hydrogen", title: "Hydrogen"},
    {key: "habari", title: "Habari"},
];
const confirmKill = ref<{
    show: boolean,
    id?: string,
    message?: string,
    title?: string
}>({
    show: false,
    message: "Do you really want to Kill the bridge service ?",
    title: "Kill Bridge",
    id: '',
})

const confirmClearConnection = ref<{
    show: boolean,
    connection: 'isw' | 'habari' | 'hydrogen' | null,
    title: string,
    message: string,
}>({
    show: false,
    connection: null,
    title: `Purge all Connections?`,
    message: "You will kill and remove all the stale and active connections"
})

const showConfirmKill = (title: string | null = null, message: string | null = null) => {
    confirmKill.value = {
        ...confirmKill.value,
        show: true,
        title: title ?? confirmKill.value.title,
        message: message ?? confirmKill.value.message
    }
}

const showConfirmClearConnection = (connection: 'isw' | 'hydrogen' | 'habari' | null, title?: string) => {
    if (connection === null) return;
    confirmClearConnection.value = {
        ...confirmClearConnection.value,
        connection,
        show: true,
        message: "N/B this will remove even active connections.",
        title: title ?? `Purge ${connection} Connections?`,
    }
}

const fetchConnections = async () => {
    if (!state.online) return;
    try {
        state.busy = true;
        // @ts-ignore: Unreachable code error
        const { data } = await request?.get('/dashboard/bridge/connections');
        state.connections = data;
    } catch (error: any) {

        if (error.isAxiosError) {

        }


    } finally {
        state.busy = false;
    }
}

const pingServer = async () => {
    try {
        state.busy = true;
        // @ts-ignore: Unreachable code error
        const { data } = await request?.get('/dashboard/bridge/status');
        state.online = data.data.message === "pong";
    } catch (error: any) {

        if (error.isAxiosError && state.online) {
            notify({
                type: "danger",
                title: "Bridge Offline",
                text: "The Bridge is currently down. Please try again later",
            })
        }

        state.online = false;
    } finally {
        state.busy = false;
    }
}

const killServer = async () => {
    try {
        state.busy = true;
        // @ts-ignore: Unreachable code error
        const { data } = await request?.get('/dashboard/bridge/kill');
    } catch (error: any) {

        if (error.isAxiosError) {

        }
    } finally {
        state.busy = false;
    }
}

const closeConnections = async (connection: 'isw' | 'hydrogen' | 'habari' | null) => {
    if (connection === null) return;
    try {
        state.busy = true;
        // @ts-ignore: Unreachable code error
        const { data } = await request?.post('/dashboard/bridge/clear-connections', { connection });
        notify({
            title: "Action Dispatched",
            text: "Dispatched clear connections request",
        })
    } catch (error: any) {

        if (error.isAxiosError) {

        }
    } finally {
        state.busy = false;
    }
}


onMounted(() => {
    if (!isActive) {
        resume()
    }
    pingServer();
    fetchConnections()
});

onBeforeRouteLeave(() => {
    if (isActive) pause();
})
</script>