<template>

  <h3 class="space-x-3 text-3xl font-medium text-gray-700">
   <span class="text-gray-800">Organisations: {{ state.organisations.totalDocs }}</span>
    <small class="text-sm text-blue-500" v-if="state.loading">Loading ...</small>
  </h3>
  <div class="flex items-center justify-between mt-6">
    <div class="flex w-6/12 space-x-4">
      <div class="relative block w-full mt-2 sm:mt-0">
        <span class="absolute inset-y-0 left-0 flex items-center pl-2">
          <svg viewBox="0 0 24 24" class="w-4 h-4 text-gray-500 fill-current">
            <path
              d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z" />
          </svg>
        </span>

        <input placeholder="Search"
          v-model="state.q"
          @change="()=>state.q.length > 3 ? debounce(getOrganisations, 400): null"
          class="flex w-full py-2 pl-8 pr-6 text-sm text-gray-700 placeholder-gray-400 bg-white border border-b border-gray-400 rounded appearance-none focus:bg-white focus:placeholder-gray-800 focus:text-gray-700 focus:outline-none" />
      </div>
      <div class="space-x-2">
        <button @click="getOrganisations"
          class="px-3 py-2 font-medium tracking-wide text-white bg-gray-800 rounded-md hover:bg-gray-500 focus:outline-none">
          search
        </button>
      </div>
    </div>
    <div class="space-x-2">
      <button @click="open = true"
        class="px-6 py-2 font-medium tracking-wide text-white bg-gray-800 rounded-md hover:bg-gray-500 focus:outline-none">
        Add an Organisation
      </button>
    </div>
  </div>
  <div class="flex flex-col mt-8">
    <p class="my-2 text-sm text-gray-700">
      Page {{ state.organisations.page }} of {{ state.organisations.totalPages }}
    </p>
    <div class="py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div class="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg">
        <table class="min-w-full">
          <thead>
            <tr>

              <th
                class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                Name
              </th>

              <th
                class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                Users
              </th>
              <th
                class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                Transactions
              </th>

              <th
                class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                Terminals
              </th>
              <th class="px-6 py-3 border-b border-gray-200 bg-gray-50"></th>
            </tr>
          </thead>

          <tbody class="bg-white">
            <template v-if="state.organisations?.totalDocs">
              <tr v-for="(u, index) in state.organisations.docs" :key="index">

                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="ml-2">
                      <div class="text-sm font-medium leading-5 text-gray-500">

                         <span
                    class="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                    {{ u.name}}</span>
                      </div>

                    </div>
                  </div>
                </td>


                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    {{ u.users_count }}
                  </div>

                </td>

                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                  {{ u.transactions_count }}
                </td>

                <td class="px-6 py-4 text-sm leading-5 text-gray-500 border-b border-gray-200 whitespace-nowrap">
                  {{u.terminals_count}}
                </td>

                <td
                  class="px-6 py-4 text-sm font-medium leading-5 text-right border-b border-gray-200 whitespace-nowrap">
                  <button
                    @click="createApiKey(u._id)"
                    :title="u.hasApiKey?'recreate api key':'create api key'"
                    :disabled="creatingkey.includes(u._id)"
                    class="text-xs text-blue-500 disabled:text-blue-200 hover:text-blue-700 flex space-x-2" v-can="['organisations.create-api-key']">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
                    </svg>
                  </button>
                </td>
              </tr>
            </template>
            <template v-else>
              <tr>
                <td colspan="7" class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                  <div class="text-sm font-medium leading-5 text-gray-800">
                    No organisation added yet
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
         <div
              v-if="state.organisations?.totalPages > 1"
              class="flex flex-col items-center px-5 py-5 bg-white border-t xs:flex-row xs:justify-between"
            >
           <div class="space-x-10">
             <span class="text-xs text-gray-900 xs:text-sm">
                Page {{ state.organisations.page }} of {{ state.organisations.totalPages }}
            </span>
              <span class="text-xs text-gray-900 xs:text-sm"
                >Showing 1 to {{state.organisations.limit}} of {{state.organisations.totalDocs}} transactions</span
              >
           </div>

              <div class="inline-flex mt-2 xs:mt-0">
                <button
                  :disabled="!state.organisations.hasPrevPage"
                  @click="()=>gotoPage(state.organisations?.prevPage || 1)"
                  class="px-4 py-2 text-sm font-semibold text-gray-800 bg-gray-300 rounded-l disabled:opacity-30 hover:bg-gray-400"
                >
                  Prev
                </button>
                <button
                  :disabled="!state.organisations.hasNextPage"
                  @click="()=>gotoPage(state.organisations.nextPage || 1)"
                  class="px-4 py-2 text-sm font-semibold text-gray-800 bg-gray-300 rounded-r disabled:opacity-20 hover:bg-gray-400"
                >
                  Next
                </button>
              </div>
            </div>
      </div>
    </div>
  </div>

    <div :class="`modal ${!open && 'opacity-0 pointer-events-none'} z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center`">
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
          <p class="text-2xl font-bold">Add Organisation</p>
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
            <Input title="Name" v-model:value="form.name" />
          </div>

        </div>
        <div>
          <p v-for="error of $v.$errors" :key="error.$uid">
            {{ error.$message }}
          </p>
        </div>

        <!--Footer-->
        <div class="flex justify-end pt-2">
          <button :disabled="state.loading" @click="open = false"
            class="p-3 px-6 py-3 mr-2 text-gray-500 bg-transparent rounded-lg disabled:pointer-events-none hover:bg-gray-100 hover:text-gray-400 focus:outline-none">
            Close
          </button>
          <button :disabled="state.loading || $v.$invalid" @click="saveOrganisation"
            class="px-6 py-3 font-medium tracking-wide text-white bg-gray-800 rounded-md disabled:opacity-25 disabled:pointer-events-none hover:bg-gray-500 focus:outline-none">
            save
          </button>
        </div>
      </div>
    </div>
    </div>
    <div :class="`modal ${!showApiKey && 'opacity-0 pointer-events-none'} z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center`">
      <div class="absolute w-full h-full bg-gray-900 opacity-50 modal-overlay"></div>

      <div class="z-50 w-11/12 mx-auto overflow-y-auto bg-white rounded shadow-lg modal-container md:max-w-md">
      <div @click="showApiKey = false"
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
          <p class="text-2xl font-bold">Organisation Api Key</p>
          <div class="z-50 cursor-pointer modal-close" @click="showApiKey = false">
            <svg class="text-black fill-current" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
              viewBox="0 0 18 18">
              <path
                d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z" />
            </svg>
          </div>
        </div>

        <!--Body-->
        <div class="flex flex-col">
          <div class="w-2/3 flex space-x-2">
            <input disabled :value="apiKey"/>
            <button
                    @click="copyText(`${apiKey}`)"
                    v-can="'organisations.view-secret'"
                    class="hover:text-gray-700"
                    title="copy api key">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                    </svg>
                  </button>
          </div>
        </div>

        <!--Footer-->
        <div class="flex justify-end pt-2">
          <button :disabled="state.loading" @click="showApiKey = false"
            class="p-3 px-6 py-3 mr-2 text-gray-500 bg-transparent rounded-lg disabled:pointer-events-none hover:bg-gray-100 hover:text-gray-400 focus:outline-none">
            Close
          </button>
        </div>
      </div>
    </div>
    </div>

    <ConfirmDialog v-model:value="confirmDelete.open" :title="confirmDelete.title" :confirm="confirmDelete.value"
    :message="confirmDelete.message" @accepted="deleteOrganisation" />

</template>

<script setup lang="ts">
import { ref, inject, reactive, onMounted, computed } from "vue";
// @ts-ignore
import Input from '../components/Input.vue'

import axios, { AxiosError, AxiosInstance } from "axios"
import { Transaction, PaginatedData, Organisation } from '../@types/types';
import { currencyFormatter, dateFormatter } from '../utils/Formatters';
import debounce from 'lodash/debounce'
import useVuelidate from "@vuelidate/core";
import { required, ipAddress, numeric, minLength, maxLength, requiredIf } from "@vuelidate/validators"
import { notify } from "@kyvg/vue3-notification";
import ConfirmDialog from '../components/ConfirmDialog.vue'
import { copyText } from "../utils/helpers";

interface OrganisationState {
  loading: boolean,
  q: string,
  organisations: PaginatedData<Organisation>
}

interface User {
  name: string;
  email: string;
  title: string;
  title2: string;
  status: string;
  role: string;
}

interface Form  {
  name?: string | null,
  _id?: string,
}

const request: AxiosInstance | undefined = inject('$axios');
const state: OrganisationState = reactive<OrganisationState>({
  loading: false,
  q: '',
  organisations: {
    docs: [],
    totalDocs: 0,
    limit: 30,
    page: 1,
    totalPages: 1,
  },
})



const open = ref<boolean>(false);
const showApiKey = ref<boolean>(false);
const apiKey = ref<String>();
const creatingkey = ref<String[]>([])

const form = ref<Form>({
  _id: undefined,
  name: null,
})

const rules = computed(() => ({
  _id: {},
  name: { required, minLength: minLength(5), },
}))

let defaultDeleteState: { [key: string]: any, id: string | null } = {
  open: false,
  title: "Do you really want to delete his TID?",
  value: '',
  id: null,
}

const confirmDelete = ref(defaultDeleteState)

const $v = useVuelidate<Form>(rules, form, { $autoDirty: true, })


const gotoPage = (page: number)=>{
  state.organisations.page = page;
  getOrganisations();
}

const getOrganisations = async () => {
  try {
    state.loading = true;
    const { page, limit } = state.organisations;
    const params = { page, limit, q: state.q }
    // @ts-ignore: Unreachable code error
    const { data } = await request?.get('/dashboard/organisations', {
      params
    });
    state.organisations = data;
  } catch (error: any) {

    if (error.isAxiosError) {

    }
  } finally {
    state.loading = false;
  }
}

const saveOrganisation = async () => {
  try {
    const {data} = form.value?._id?.length? await request!.put<Organisation>('/dashboard/organisations',form.value): await request!.post<Organisation>('/dashboard/organisations',form.value);
    getOrganisations();
    notify({
      title: "Success",
      type: "success",
      text: "Organisation Saved successful!",
    });
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
    state.loading = false;
  }
}

const editOrganisation = (organisation: Organisation) => {
  form.value = {
    name: organisation.name,
    _id: organisation._id,
  }
  open.value = true;
}



const deleteOrganisation = async (confirm: boolean) => {
  if (!confirm) {
    confirmDelete.value = { ...confirmDelete.value, ...defaultDeleteState }
    return;
  };
  state.loading = true;
  try {
    const { data } = await request!.delete('/dashboard/organisations/' + confirmDelete.value.id)
    notify({
      text: "Orgnainsation Deleted",
      title: "Item Deleted",
      type: "success"
    })
    getOrganisations();
  } catch (error:any) {
    let message = error.message;
    if(error.isAxiosError) {
      message = error.response.data.message;
    }
  }finally {
    state.loading = false;
  }
}


const createApiKey = async (id: string) => {
  state.loading = true;
  creatingkey.value = [...creatingkey.value, id]
  try {
    const { data } = await request!.get('/dashboard/organisations/generate-api-key/' + id)
    notify({
      text: "Api Key generated",
      title: "API",
      type: "success"
    })
    apiKey.value = data.data.apiKey;
    showApiKey.value = true
    getOrganisations();
  } catch (error:any) {
    let message = error.message;
    if(error.isAxiosError) {
      message = error.response.data.message;
    }
  }finally {
    state.loading = false;
    creatingkey.value = creatingkey.value.filter(item=>item !== id)
  }
}




const confirmOrganisationDelete = (organisation: Organisation) => {
  confirmDelete.value = {
    ...confirmDelete.value,
    open: true,
    value: organisation._id,
    id: organisation._id || null,
    message: `To delete this Organisation confirm by typing: ${organisation.name}. N/B This will fail if organisation has performed a transaction.`
  }
}

onMounted(() => {
  getOrganisations()
})
</script>