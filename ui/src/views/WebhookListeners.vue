<template>

  <h3 class="space-x-3 text-3xl font-medium text-gray-700">
   <span class="text-gray-800">Listeners: {{ state.webhooks.totalDocs }}</span>
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
          @change="()=>state.q.length > 3 ? debounce(getWebhooks, 400): null"
          class="flex w-full py-2 pl-8 pr-6 text-sm text-gray-700 placeholder-gray-400 bg-white border border-b border-gray-400 rounded appearance-none focus:bg-white focus:placeholder-gray-800 focus:text-gray-700 focus:outline-none" />
      </div>
      <div class="space-x-2">
        <button @click="getWebhooks"
          class="px-3 py-2 font-medium tracking-wide text-white bg-gray-800 rounded-md hover:bg-gray-500 focus:outline-none">
          search
        </button>
      </div>
    </div>
    <div class="space-x-2">
      <button v-can="'organisations.create'" @click="open = true"
        class="px-6 py-2 font-medium tracking-wide text-white bg-gray-800 rounded-md hover:bg-gray-500 focus:outline-none">
        Add WebHook
      </button>
    </div>
  </div>
  <div class="flex flex-col mt-8">
    <p class="my-2 text-sm text-gray-700">
      Page {{ state.webhooks.page }} of {{ state.webhooks.totalPages }}
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
                URl
              </th>
              <th
                class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                Organisation
              </th>

              <th
                class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                Request Count
              </th>
              <th
                class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                Secret
              </th>
              <th class="px-6 py-3 border-b border-gray-200 bg-gray-50">Actions</th>
            </tr>
          </thead>

          <tbody class="bg-white">
            <template v-if="state.webhooks?.totalDocs">
              <tr v-for="(u, index) in state.webhooks.docs" :key="index">

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
                  <div v-for="(url,key) of u.dest_urls " :key="key" :title="url" class="text-xs w-36 overflow-hidden text-ellipsis leading-5 text-gray-900">
                    {{ url }}
                  </div>

                </td>
                <td  class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                  {{ u.organisation?.name }}
                </td>

                <td class="px-6 py-4 text-sm leading-5 text-gray-500 border-b border-gray-200 whitespace-nowrap">
                  <router-link class="text-blue-400 hover:text-blue-500" :to="{
                    name: 'webhooks',
                    params:{
                      id: u._id
                    }
                  }" >
                    {{u.request_count}}
                  </router-link>
                </td>

                <td class="px-6 flex flex-col space-y-2 py-4 text-sm leading-5 text-gray-500 border-b border-gray-200 whitespace-nowrap">
                  <div class="flex items-center space-x-2 ">
                    <span>
                    {{maskSecret(u.secret)}}
                  </span>
                  <button
                    @click="copySecret(u.secret)"
                    v-can="'organisations.view-secret'"
                    class="hover:text-gray-700"
                    title="copy secret for webhook verification">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                    </svg>
                  </button>
                  </div>
                  <button v-can="'organisations.rotate-secret'" @click="resetSecret(u)" class="flex space-x-1 text-xs">
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none" viewBox="0 0 24 24"
                    stroke-width="1.5" stroke="currentColor"
                    class="w-4 h-4"
                    :class="{'animate animate-spin': resetingId === u._id}"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    <span>regenrate secret</span>
                  </button>
                </td>

                <td
                  class="px-6 py-4 text-xs font-medium leading-5 text-right border-b border-gray-200 whitespace-nowrap">
                  <div class="flex space-x-2">
                    <button v-can="'organisations.update'" @click="editWebHook(u)" class="text-blue-400 hover:text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                    </svg>
                  </button>
                  <button v-can="'organisations.delete'" class="text-gray-400 hover:text-gray-800">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                  </div>
                </td>
              </tr>
            </template>
            <template v-else>
              <tr>
                <td colspan="7" class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                  <div class="text-sm text-center font-medium leading-5 text-gray-800">
                    No Listeners  added yet
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
         <div
              v-if="state.webhooks?.totalPages > 1"
              class="flex flex-col items-center px-5 py-5 bg-white border-t xs:flex-row xs:justify-between"
            >
           <div class="space-x-10">
             <span class="text-xs text-gray-900 xs:text-sm">
                Page {{ state.webhooks.page }} of {{ state.webhooks.totalPages }}
            </span>
              <span class="text-xs text-gray-900 xs:text-sm"
                >Showing 1 to {{state.webhooks.limit}} of {{state.webhooks.totalDocs}} transactions</span
              >
           </div>

              <div class="inline-flex mt-2 xs:mt-0">
                <button
                  :disabled="!state.webhooks.hasPrevPage"
                  @click="()=>gotoPage(state.webhooks?.prevPage || 1)"
                  class="px-4 py-2 text-sm font-semibold text-gray-800 bg-gray-300 rounded-l disabled:opacity-30 hover:bg-gray-400"
                >
                  Prev
                </button>
                <button
                  :disabled="!state.webhooks.hasNextPage"
                  @click="()=>gotoPage(state.webhooks.nextPage || 1)"
                  class="px-4 py-2 text-sm font-semibold text-gray-800 bg-gray-300 rounded-r disabled:opacity-20 hover:bg-gray-400"
                >
                  Next
                </button>
              </div>
            </div>
      </div>
    </div>
  </div>

    <div :class="`modal ${!open && 'opacity-0 pointer-events-none'
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
          <p class="text-2xl font-bold">{{form._id? 'Update':'Add'}} Webhook</p>
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
            <Input title="Name" type="text" v-model:value="form.name" />
          </div>

          <div v-if="!form._id?.length" class="flex items-center space-x-2">
            <label for="">Organisation</label>
            <OrganisactionSelect v-model="form.organisationId" />
          </div>
          <div class="flex flex-col">
            <div class="flex flex-row justify-between items-center my-4">
              <span class="text-gray-400  text-sm">Add Desitnation URL</span>
              <button @click.prevent="addUrlToForm" class="text-sm p-1 px-2 rounded text-white bg-blue-600">+</button>
            </div>
            <div class="flex flex-row justify-between items-center space-x-2" v-for="(url,key) of form.urls" :key="key">
              <Input :title="`Url (${key+1})`" v-model:value="form.urls[key]" />
              <button @click.prevent="removeURLFromForm(key)" class="text-sm px-2 p-1 rounded text-white bg-red-400"> - </button>
            </div>
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

</template>

<script setup lang="ts">
import { ref, inject, reactive, onMounted, computed, watch } from "vue";
import {useClipboard} from 'vue-reactive-clipboard';
// @ts-ignore
import Input from '../components/Input.vue'

import axios, { AxiosInstance } from "axios"
import { PaginatedData,Webhook } from '../@types/types';
import { currencyFormatter, dateFormatter } from '../utils/Formatters';
import debounce from 'lodash/debounce'
import useVuelidate from "@vuelidate/core";
import { required, ipAddress, numeric, minLength, maxLength, requiredIf, url,   } from "@vuelidate/validators"
import { notify } from "@kyvg/vue3-notification";
// @ts-ignore
import OrganisactionSelect from "../components/OrganisactionSelect.vue";


interface OrganisationState {
  loading: boolean,
  q: string,
  webhooks: PaginatedData<Webhook>
}

interface Form  {
  _id?:string,
  name: string | null,
  url?:string | null,
  urls: string[],
  organisationId: string | null,
}

const {text, copyText} = useClipboard();

const request: AxiosInstance = inject('$axios')!;
const state: OrganisationState = reactive<OrganisationState>({
  loading: false,
  q: '',
  webhooks: {
    docs: [],
    totalDocs: 0,
    limit: 30,
    page: 1,
    totalPages: 1,
  },
})



const open = ref<boolean>(false);
const resetingId = ref<string|null>(null);
const form = ref<Form>({
  name: null,
  urls: [""],
  organisationId: null,
})

const $v = useVuelidate({
  name:{
    required,
  },
  urls:{
    required,
    minLength: minLength(1),
    $each:{
      url
    }
  },
},form)



const gotoPage = (page: number)=>{
  state.webhooks.page = page;
  getWebhooks();
}
const getWebhooks = async () => {
  try {
    state.loading = true;
    const { page, limit } = state.webhooks;
    const params = { page, limit, q: state.q }
    // @ts-ignore: Unreachable code error
    const { data } = await request?.get('/dashboard/webhook', {
      params
    });
    state.webhooks = data;
  } catch (error: any) {

    if (error.isAxiosError) {

    }
  } finally {
    state.loading = false;
  }
}

const maskSecret = (val:string)=>{
  return val.slice(0,10) + "********" + val.slice(-10);
}

const copySecret = async (val:string) =>{
  try {
    // @ts-ignore
    ! await navigator.permissions.query({name:'clipboard-write'})
    await navigator.clipboard.writeText(val);
  } catch (error) {
    const input = document.createElement('input')
    input.value = val
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
  } finally{
    notify({
      title: "Success",
      text: "Copied"
    })
  }
}

const editWebHook = (hook: Webhook)=>{
  form.value = {
    _id: hook._id,
    name: hook.name,
    urls: (hook.dest_urls ?? []).filter(url=>url?.length),
    organisationId: hook.orgnaisationId,
  }

  open.value = true;
}

const resetSecret = async (item: Webhook) =>{
  try {
    resetingId.value = item._id!;
    const {data} = await request!.post<Webhook>(`/dashboard/webhook/reset-secret/${item._id}`);
    state.webhooks.docs = state.webhooks.docs.map(hook=>item._id == hook._id? data:item)
    notify({
      title: "Success",
      type: "success",
      text: "Webhook secret updated Saved successful!",
    });
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
    state.loading = false;
    resetingId.value = null;
  }
}

const saveOrganisation = async () => {
  try {
    state.loading = true;
    const {data} = form.value?._id?.length?
      await request!.put<Webhook>(`/dashboard/webhook/${form.value?._id}`,form.value):
      await request!.post<Webhook>('/dashboard/webhook',form.value);
    getWebhooks();
    notify({
      title: "Success",
      type: "success",
      text: "Webhook Saved successful!",
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
    open.value = false;
  }
}

const addUrlToForm = () => {
  form.value.urls = [...form.value?.urls?? [],""]
}

const removeURLFromForm = (index:number)=>{
  form.value.urls = form.value.urls?.filter((url,i)=>index!= i)
}

watch(open,(value)=>{
  if(value) return;
  form.value = {
    name: null,
    urls: [""],
    organisationId: null,
  }
})

onMounted(() => {
  getWebhooks()
})
</script>