<template>
  <div class="mt-8">
    <h3 class="text-3xl font-medium text-gray-700">Terminals</h3>

    <div class="flex items-center justify-between mt-6">
      <div class="w-5/12">
        <div class="relative block w-full mt-2 sm:mt-0">
          <span class="absolute inset-y-0 left-0 flex items-center pl-2">
            <svg viewBox="0 0 24 24" class="w-4 h-4 text-gray-500 fill-current">
              <path
                d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z" />
            </svg>
          </span>

          <input placeholder="Search" v-model="search"
            class="flex w-full py-2 pl-8 pr-6 text-sm text-gray-700 placeholder-gray-400 bg-white border border-b border-gray-400 rounded appearance-none focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none" />
        </div>
      </div>
      <div>
        <OrganisactionSelect v-model="organisation" />
      </div>
      <div class="space-x-2">

        <button @click="open = true"
          class="text-sm px-2 py-2 mt-3 font-medium tracking-wide text-white bg-red-600 rounded-md hover:bg-red-500 focus:outline-none">
          Add Terminal
        </button>

        <button
        @click="exportTerminals"
        class="text-sm px-2 py-2 font-medium tracking-wide text-white bg-gray-600 rounded-md hover:bg-gray-500 focus:outline-none">
        export
      </button>

        <router-link :to="{ name: 'bulk-upload' }">
          upload csv
        </router-link>

      </div>
    </div>

    <div class="px-4 py-4 -mx-4 overflow-x-auto sm:-mx-8 sm:px-8">
      <div :class="{ 'opacity-20 relative': loading }" class="inline-block min-w-full overflow-hidden rounded-lg shadow">
        <div v-show="loading" class="fixed bg-gray-900 rounded top-1/2 left-1/2">
          <svg version="1.1" id="L9" class="w-10 h-10 animate-spin " xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100"
            enable-background="new 0 0 0 0" xml:space="preserve">
            <path fill="#fff"
              d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
              <animateTransform attributeName="transform" attributeType="XML" type="rotate" dur="1s" from="0 50 50"
                to="360 50 50" repeatCount="indefinite" />
            </path>
          </svg>
        </div>
        <table class="min-w-full leading-normal">
          <thead>
            <tr>
              <th
                class="flex items-center px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">
                <Input v-model:value="selected" type="checkbox" class="inline-flex mr-2" /> TerminalID
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">
                Serial No
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">
                Device Info
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">
                Profile
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">
                Info
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-if="state.data.totalDocs">

              <tr v-for="(terminal) in state.data.docs" :key="terminal._id">
                <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                  <div class="flex items-center">
                    <Input type="checkbox" :checked="false" :value="terminal.terminalId" class="inline-flex mr-2" />
                    <div class="ml-3">
                      <p class="text-gray-900 whitespace-nowrap">
                        {{ terminal.terminalId }}
                      </p>
                    </div>
                  </div>
                </td>
                <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                  <p class="text-gray-900 whitespace-nowrap">{{ terminal.serialNo }}</p>
                  <!-- <p class="text-gray-900 whitespace-nowrap">Is SSL: {{ profile?.isSSL? "Yes":"No" }}</p>
                  <p class="text-gray-900 whitespace-nowrap">
                    Switch Amount: {{ profile.iswSwitchAmount>0 || profile.iswSwitchAmount === null? 'None': profile.iswSwitchAmount }}
                  </p> -->
                </td>
                <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                  <p class="text-gray-900 whitespace-nowrap">Brand: <span class="text-xs text-gray-700">{{
                      terminal?.brand
                  }}</span> </p>
                  <p class="text-gray-900 whitespace-nowrap">Model: <span class="text-xs text-gray-700">{{
                      terminal?.deviceModel
                  }}</span></p>
                  <p class="text-gray-900 whitespace-nowrap">
                    App version: <span class="text-xs text-gray-700">{{ terminal.appVersion }}</span>
                  </p>
                </td>
                <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                  <p class="text-gray-900 whitespace-nowrap">
                    {{ terminal.profile?.title }}
                  </p>
                </td>
                <td class="px-5 py-5 text-sm text-gray-600 bg-white border-b border-gray-200">
                  <template v-if="terminal.parsedParams != null">
                    <p class=" whitespace-nowrap">
                      MID: <span class="font-bold">{{ terminal?.parsedParams?.mid }}</span>
                    </p>
                    <p class="whitespace-nowrap">
                      Name: <span class="font-bold">{{ terminal?.parsedParams?.merchantNameLocation }}</span>
                    </p>
                    <p>
                      Last Key Exchange: <span class="font-bold">{{ formatExchangeTime(
                          terminal?.parsedParams.exchangeTime)
                      }}</span>
                    </p>


                  </template>
                  <p v-if="terminal?.organisation">
                    Organisation: <span class="font-bold">
                      {{ terminal?.organisation.name }}
                    </span>
                  </p>
                  <template v-if="terminal?.profile?.iswSwitchAmount">
                    <p class=" whitespace-nowrap">
                      ISW TID: <span class="font-bold">{{ terminal.iswTid }}</span>
                    </p>
                    <p class="whitespace-nowrap">
                      ISW UNIQUEID: <span class="font-bold">{{ terminal.iswUniqueId }}</span>
                    </p>
                  </template>
                </td>
                <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                  <button 
                  :title='terminal?.parsedParams?.exchangeTime.length ? "Refresh Keys" : "Perform keyExchange" ' 
                  class="text-green-500 hover:text-green-600" 
                  :class="{'animate animate-pulse': busyIds.includes(terminal._id!)}"
                  @click="performKeyExchange(terminal._id!)">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" view-box="0 0 24 24" stroke-width='1.5'
                      stroke="currentColor" class="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                    </svg>
                    
                  </button>
                  <button class="text-gray-500 hover:text-gray-600" @click="editTerminal(terminal)">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                      stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                    </svg>
                  </button>
                  <button class="text-red-500 hover:text-red-600" @click="confirmTerminalDelete(terminal)">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                      stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </td>
              </tr>
            </template>
            <template v-else>
              <tr>
                <td class="px-5 py-5 text-sm bg-white border-b border-gray-200" colspan="6">
                  <div class="flex items-center">
                    <div class="ml-3">
                      <p class="text-center text-gray-900 whitespace-nowrap">
                        No data currently
                      </p>
                    </div>
                  </div>
                </td>
              </tr>

            </template>
          </tbody>
        </table>
        <div v-if="state.data.totalPages > 1"
          class="flex flex-col items-center px-5 py-5 bg-white border-t xs:flex-row xs:justify-between">
          <div class="space-x-10">
            <span class="text-xs text-gray-900 xs:text-sm">
              Page {{ state.data.page }} of {{ state.data.totalPages }}
            </span>
            <span class="text-xs text-gray-900 xs:text-sm">Showing 1 to {{ state.data.limit }} of {{
                state.data.totalDocs
            }}
              terminals</span>
          </div>
          <div class="inline-flex mt-2 xs:mt-0">
            <button :disabled="!state.data.hasPrevPage" @click="() => gotoPage(state.data?.prevPage || 1)"
              class="px-4 py-2 text-sm font-semibold text-gray-800 bg-gray-300 rounded-l disabled:opacity-30 hover:bg-gray-400">
              Prev
            </button>
            <button :disabled="!state.data.hasNextPage" @click="() => gotoPage(state.data.nextPage || 1)"
              class="px-4 py-2 text-sm font-semibold text-gray-800 bg-gray-300 rounded-r disabled:opacity-20 hover:bg-gray-400">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="open" :class="`modal ${!open && 'opacity-0 pointer-events-none'
  } z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center`">
    <div class="absolute w-full h-full bg-gray-900 opacity-50 modal-overlay"></div>

    <div class="z-50 w-11/12 mx-auto overflow-y-auto bg-white rounded shadow-lg modal-container md:max-w-md">
      <div @click="open = false"
        class="absolute top-0 right-0 z-50 flex flex-col items-center mt-4 mr-4 text-sm text-white cursor-pointer modal-close">
        <svg class="text-white fill-current" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
          viewBox="0 0 18 18">
          <path
            d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z" />
        </svg>
        <span class="text-sm">(Esc)</span>
      </div>

      <!-- Add margin if you want to see some of the overlay behind the modal-->
      <div class="px-6 py-4 text-left modal-content">
        <!--Title-->
        <div class="flex items-center justify-between pb-3">
          <p class="text-2xl font-bold">{{ form._id ? 'Update' : 'Add' }} Terminal</p>
          <div class="z-50 cursor-pointer modal-close" @click="open = false">
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
            <div class="flex items-baseline mb-2 space-x-2">
              <label class="w-1/5 text-sm font-bold text-gray-700" for="emailAddress">Profile:</label>
              <select
                class="w-4/5 p-1 mt-2 border border-gray-200 rounded-md focus:outline-none focus:border-none focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                v-model="form.profileId">
                <option value="">Select</option>
                <option v-for="profile in profiles" :value="profile._id" :key="profile._id">{{ profile.title }}</option>
              </select>
            </div>
          </div>
          <div>
            <div class="flex items-baseline mb-2 space-x-2">
              <label class="w-1/5 text-sm font-bold text-gray-700" for="emailAddress">Organisation:</label>
              <OrganisactionSelect v-model="form.organisationId" />
            </div>
          </div>
          <div>
            <div v-if="!brandCustom" class="flex items-baseline mb-2 space-x-2">
              <label class="w-1/5 text-sm font-bold text-gray-700" for="emailAddress">Brand:</label>
              <select
                class="w-4/5 p-1 mt-2 border border-gray-200 rounded-md focus:outline-none focus:border-none focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                v-model="form.brand">
                <option :value="null">Select Brand</option>
                <option v-for="(brand, index) in terminalBrands" :value="brand" :key="index">{{ brand }}</option>
              </select>

            </div>

            <Input v-else title="Brand" placeholder="Enter brand name" v-model:value="form.brand" />
            <div>
              <button class="text-xs text-gray-400 hover:underline hover:text:text-gray-500"
                @click="brandCustom = !brandCustom">
                {{ brandCustom ? 'Pick from options' : 'enter another' }}
              </button>
            </div>
          </div>
          <div>
            <Input title="Device Model" v-model:value="form.deviceModel" />
          </div>
          <div>
            <Input title="Serial Number" v-model:value="form.serialNo" />
          </div>
          <div>
            <Input title="Terminal Id" v-model:value="form.terminalId" />
          </div>
          <div>
            <Input title="ISW Terminal Id" v-model:value="form.iswTid" />
          </div>
          <div>
            <Input title="ISW Unique ID" v-model:value="form.iswUniqueId" />
          </div>



        </div>
        <div>
          <p v-for="error of $v.$errors" :key="error.$uid">
            {{ error.$message }}
          </p>
        </div>

        <!--Footer-->
        <div class="flex justify-end pt-2">
          <button :disabled="loading" @click="open = false"
            class="p-3 px-6 py-3 mr-2 text-red-500 bg-transparent rounded-lg disabled:pointer-events-none hover:bg-gray-100 hover:text-red-400 focus:outline-none">
            Close
          </button>
          <button :disabled="loading || $v.$invalid" @click="saveProfileForm"
            class="px-6 py-3 font-medium tracking-wide text-white bg-red-600 rounded-md disabled:opacity-25 disabled:pointer-events-none hover:bg-red-500 focus:outline-none">
            save
          </button>
        </div>
      </div>
    </div>
  </div>

  <ConfirmDialog v-model:value="confirmDelete.open" :title="confirmDelete.title" :confirm="confirmDelete.value"
    :message="confirmDelete.message" @accepted="deleteTerminal" />
</template>

<script lang="ts" setup>
import { reactive, inject, onMounted, ref, watch, computed } from 'vue';
import { Axios } from 'axios';
// @ts-ignore
import Input from '../../components/Input.vue'
// @ts-ignore
import ConfirmDialog from '../../components/ConfirmDialog.vue'
// @ts-ignore
import OrganisactionSelect from '../../components/OrganisactionSelect.vue'
import useVuelidate from "@vuelidate/core";
import { notify } from "@kyvg/vue3-notification"
import { required, ipAddress, numeric, minLength, maxLength, requiredIf } from "@vuelidate/validators"
import { parse, format } from "date-fns"
import { Organisation, PaginatedData } from '../../@types/types';
import useDebouncedRef from '../../utils/DebounceRef';
import { keyExchange } from '../../../../intellifin-rerouting/src/queue/queue';

interface Profile {
  _id?: string,
  title: string,
  isoHost: string,
  isoPort: string,
  isSSL: boolean,
  componentKey1: string,
  componentKey2: string,
  iswSwitchAmount: number,
  terminals_count?: number,

}



interface Terminal {
  _id?: string,
  serialNo: string,
  terminalId: string,
  clrmasterkey?: string,
  encmasterkey?: string,
  encsesskey?: string,
  clrsesskey?: string,
  encpinkey?: string,
  clrpinkey?: string,
  profileId: string,
  createdAt?: Date,
  updatedAt?: Date,
  profile?: Profile,
  iswTid?: string,
  iswUniqueId?: string,
  organisationId?: string,
  organisation?: Organisation,
  brand?: string,
  deviceModel?: string,
  appVersion?: string,
  parsedParams?: {
    callHomeTimeout: string,
    countryCode: string,
    currencyCode: string,
    exchangeTime: string,
    mechantCategoryCode: string,
    merchantNameLocation: string,
    mid: string,
    timeout: string,
  }
}

interface TerminalForm {
  _id?: string,
  serialNo: string,
  terminalId: string,
  profileId: string,
  iswTid?: string | null,
  iswUniqueId?: string | null,
  brand?: string | null,
  deviceModel?: string | null,
  organisationId?: string | null,
}

interface State {
  data: PaginatedData<Terminal>,
  count: number,
  perPage: number
}

const terminalBrands = ['HORIZONPAY', 'PAX', 'NEXGO', 'MOREFUN', 'MPOS', "AISINO"].sort();

// @ts-ignore: Unreachable code error
const $axios: Axios = inject('$axios')
const busyIds = ref<string[]>([])

let state = ref<State>({
  data: {
    docs: [],
    totalDocs: 0,
    limit: 30,
    page: 1,
    totalPages: 1,
  }, count: 0, perPage: 15
})
let page = ref<number>(1);
let defaultDeleteState: { [key: string]: any, id: string | null } = {
  open: false,
  title: "Do you really want to delete this TID?",
  value: '',
  id: null,
}
let profiles = ref<Profile[]>([])
let organisations = ref<Organisation[]>([])
let selected = ref<string[]>([]);
const loading = ref(false)
const confirmDelete = ref(defaultDeleteState)
const defualtState: TerminalForm = {
  serialNo: '',
  terminalId: '',
  profileId: '',
  iswTid: null,
  iswUniqueId: null,
  brand: null,
  deviceModel: null,
  organisationId: null,
}
let form = ref<TerminalForm>({ ...defualtState })
const open = ref(false);
const brandCustom = ref<boolean>(false);
const search = useDebouncedRef<string>('', 500);
const organisation = ref(null);

const rules = computed(() => ({
  _id: {},
  serialNo: { required },
  terminalId: { required, minLength: minLength(8), maxLength: maxLength(8), },
  profileId: { required },
  iswTid: { minLength: minLength(8) },
  iswUniqueId: { requiredIf: requiredIf(() => form.value.iswTid !== null || (form.value.iswTid || '')?.length > 0) },
  brand: { required },
  deviceModel: { required },
}))

const $v = useVuelidate<TerminalForm>(rules, form, { $autoDirty: true, });
const fetchData = async () => {
  try {
    loading.value = true;
    const { limit } = state.value.data;
    const params = {
      page: page.value,
      limit,
      q: search.value,
      organisation: organisation.value
    }
    const { data } = await $axios.get('/dashboard/terminals', {
      params
    })
    state.value = { ...state.value, data: data.data as PaginatedData<Terminal> };
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false;
  }
}

const exportTerminals = async () => {
  try {
    loading.value = true;
    const { limit } = state.value.data;
    const params: {[key:string]: any} = {
      page: page.value,
      limit,
      q: search.value,
      organisation: organisation.value
    }
    const url= new URL($axios?.defaults.baseURL!+'/dashboard/terminals/export', window.origin);
    Object.keys(params).forEach(key => {
      if(![undefined, null].includes(params[key]))
       url.searchParams.append(key, params[key])
    });
    window.open(url, '_blank');
  } catch (error: any) {
    let message = error.message
    if (error.isAxiosError) {
      message = error.response.data.message;
    }
    notify({
      title: "Error",
      type: "error",
      text: message,
    });
  } finally {
    loading.value = false;
  }
}

const editTerminal = (terminal: Terminal) => {
  form.value = {
    profileId: terminal.profileId,
    serialNo: terminal.serialNo,
    terminalId: terminal.terminalId,
    iswTid: terminal.iswTid,
    iswUniqueId: terminal.iswUniqueId,
    brand: terminal.brand || null,
    organisationId: terminal.organisationId,
    deviceModel: terminal.deviceModel,
    _id: terminal._id,
  }
  open.value = true;
  brandCustom.value = terminal.brand?.length ? !terminalBrands.includes(terminal.brand) : false;
}



const deleteTerminal = async (confirm: boolean) => {
  if (!confirm) {
    confirmDelete.value = { ...confirmDelete.value, ...defaultDeleteState }
    return;
  };
  try {
    const { data } = await $axios.delete('/dashboard/terminals/' + confirmDelete.value.id)
    notify({
      text: "terminal Deleted",
      title: "Item Deleted",
      type: "success"
    })
    fetchData();
  } catch (error) {
    console.log(error)
  }
}

const gotoPage = (target: number) => {
  page.value = target;
  fetchData()
}



const confirmTerminalDelete = (terminal: Terminal) => {
  confirmDelete.value = {
    ...confirmDelete.value,
    open: true,
    value: terminal.terminalId,
    id: terminal._id || null,
    message: `To delete this terminal confirm by typing: ${terminal.terminalId}`
  }
}

const fetchProfilesData = async () => {
  try {
    const { data } = await $axios.get<PaginatedData<Profile>>('/dashboard/profiles', {
      params: {
        limit: 500,
      }
    })
    profiles.value = data.docs;
  } catch (error) {
    console.log(error)
  }
}



const saveProfileForm = async () => {
  loading.value = true;
  try {
    const { data } = await (
      form.value._id?.length ? $axios.put(`/dashboard/terminals/${form.value._id}`, form.value) :
        $axios.post('/dashboard/terminals', form.value)
    );
    open.value = false;
    fetchData()
  } catch (error: any) {
    notify({
      title: "Error",
      type: "error",
      text: error?.response.data.message || error.message
    })

  } finally {
    loading.value = false;
  }
}

const performKeyExchange = async (id: string) => {
  loading.value = true;
  busyIds.value = [...busyIds.value, id];
  try {
    const { data } = await $axios.get(`/dashboard/terminals/trigger-keyexchange/${id}`);
    open.value = false;
    notify({
      title: "Success",
      type: "success",
      text: "Key Exchange request dispached"
    })
  } catch (error: any) {
    notify({
      title: "Error",
      type: "error",
      text: error?.response.data.message || error.message
    })

  } finally {
    loading.value = false;
    busyIds.value = busyIds.value.filter((i) => i !== id);
  }
}


const formatExchangeTime = (value: string) => {
  const parsed = parse(value, 'yyyyLLddHHmmss', new Date);
  return format(parsed, 'hh:mm a eee do LLL yyyy')
}

watch(open, (value, prevValue) => {
  if (value) return;
  form.value = { ...defualtState };
})

watch(search, (value, prevValue) => {
  if (value === prevValue) return;
  fetchData();
})

watch(organisation, (value, prevValue) => {
  if (value === prevValue) return;
  fetchData();
})

onMounted(() => {
  fetchData();
  fetchProfilesData();
})
</script>