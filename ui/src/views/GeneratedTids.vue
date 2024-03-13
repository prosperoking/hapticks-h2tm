<template>

  <h3 class="space-x-3 text-3xl font-medium text-gray-700">
   <span class="text-gray-800">Generated TIDS: {{ state.tableData.totalDocs }}</span>
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
          @change="()=>state.q.length > 3 ? debounce(getTids, 400): null"
          class="flex w-full py-2 pl-8 pr-6 text-sm text-gray-700 placeholder-gray-400 bg-white border border-b border-gray-400 rounded appearance-none focus:bg-white focus:placeholder-gray-800 focus:text-gray-700 focus:outline-none" />
      </div>
      <div class="space-x-2">
        <button @click="getTids"
          class="px-3 py-2 font-medium tracking-wide text-white bg-gray-800 rounded-md hover:bg-gray-500 focus:outline-none">
          search
        </button>
      </div>
    </div>
    <div class="space-x-2">
      <button v-can="['generated-tids.generate']" @click="open = true"
        class="px-6 py-2 font-medium tracking-wide text-white bg-gray-800 rounded-md hover:bg-gray-500 focus:outline-none">
        Generate Tids
      </button>
    </div>
  </div>
  <div class="flex flex-col mt-8">
    <p class="my-2 text-sm text-gray-700">
      Page {{ state.tableData.page }} of {{ state.tableData.totalPages }}
    </p>
    <div class="py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div class="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg">
        <table class="min-w-full">
          <thead>
            <tr>

              <th
                class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                TID
              </th>

              <th
                class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                Type
              </th>
              <th
                class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                Range Generated
              </th>

              <th
                class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
               Linked Terminal
              </th>
              <!-- <th class="px-6 py-3 border-b border-gray-200 bg-gray-50"></th> -->
            </tr>
          </thead>
          <tbody class="bg-white">
            <template v-if="state.tableData?.totalDocs">
              <tr v-for="(u, index) in state.tableData.docs" :key="index">

                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="ml-2">
                      <div class="text-sm font-medium leading-5 text-gray-500">

                         <span
                    class="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                    {{ u.tid}}</span>
                      </div>
                    </div>
                  </div>
                </td>


                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    {{ u.type }}
                  </div>

                </td>

                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                  {{ u.rangeGenerated }}
                </td>

                <td class="px-6 py-4 text-sm leading-5 text-gray-500 border-b border-gray-200 whitespace-nowrap">
                 <template v-if="u.terminal">
                    <div>
                        Serial: {{u.terminal?.serialNo}} <br />
                        Model:  {{u.terminal?.deviceModel}} <br />
                        Brand:  {{u.terminal?.brand}} <br />
                    </div>
                 </template>
                </td>

                <!-- <td
                  class="px-6 py-4 text-sm font-medium leading-5 text-right border-b border-gray-200 whitespace-nowrap">

                </td> -->
              </tr>
            </template>
            <template v-else>
              <tr>
                <td colspan="7" class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                  <div class="text-sm font-medium leading-5 text-gray-800">
                    No Terminal IDs generated yet
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
         <div
              v-if="state.tableData?.totalPages > 1"
              class="flex flex-col items-center px-5 py-5 bg-white border-t xs:flex-row xs:justify-between"
            >
           <div class="space-x-10">
             <span class="text-xs text-gray-900 xs:text-sm">
                Page {{ state.tableData.page }} of {{ state.tableData.totalPages }}
            </span>
              <span class="text-xs text-gray-900 xs:text-sm"
                >Showing 1 to {{state.tableData.limit}} of {{state.tableData.totalDocs}} Terminal Ids</span
              >
           </div>

              <div class="inline-flex mt-2 xs:mt-0">
                <button
                  :disabled="!state.tableData.hasPrevPage"
                  @click="()=>gotoPage(state.tableData?.prevPage || 1)"
                  class="px-4 py-2 text-sm font-semibold text-gray-800 bg-gray-300 rounded-l disabled:opacity-30 hover:bg-gray-400"
                >
                  Prev
                </button>
                <button
                  :disabled="!state.tableData.hasNextPage"
                  @click="()=>gotoPage(state.tableData.nextPage || 1)"
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
            <Input maxlength="4" minlength="4" placeholder="0000" title="Start" v-model:value="form.start" />
          </div>
          <div>
            <Input maxlength="4" minlength="4" placeholder="9999" title="End" v-model:value="form.end" />
          </div>
          <!-- <div>
            <Input maxlength="4" minlength="4" placeholder="2ISW" title="Isw Prefix" v-model:value="form.iswPrefix" />
          </div>
          <div>
            <Input maxlength="4" minlength="4" placeholder="2HYD" title="Hydrogen Prefix" v-model:value="form.hydrogenPrefix" />
          </div> -->
        </div>
        <div>
          <p class="text-xs text-red-400" v-for="error of $v.$errors" :key="error.$uid">
            <span class="font-bold uppercase"> {{error.$property }}</span>: <span>{{ error.$message }}</span>
          </p>
          <p class="text-xs text-grey-400" v-if="totalPossibleTids !== null">Total number of TID to be generated: {{totalPossibleTids}}</p>
        </div>

        <!--Footer-->
        <div class="flex justify-end pt-2">
          <button :disabled="state.loading" @click="open = false"
            class="p-3 px-6 py-3 mr-2 text-gray-500 bg-transparent rounded-lg disabled:pointer-events-none hover:bg-gray-100 hover:text-gray-400 focus:outline-none">
            Close
          </button>
          <button :disabled="state.loading || $v.$invalid" @click="generateTidRange"
            class="px-6 py-3 font-medium tracking-wide text-white bg-gray-800 rounded-md disabled:opacity-25 disabled:pointer-events-none hover:bg-gray-500 focus:outline-none">
            save
          </button>
        </div>
      </div>
    </div>
    </div>


    <ConfirmDialog v-model:value="confirmDelete.open" :title="confirmDelete.title" :confirm="confirmDelete.value"
    :message="confirmDelete.message" @accepted="deleteTid" />

</template>

<script setup lang="ts">
import { ref, inject, reactive, onMounted, computed } from "vue";
// @ts-ignore
import Input from '../components/Input.vue'

import axios, { AxiosError, AxiosInstance } from "axios"
import { Transaction, PaginatedData, GeneratedTid } from '../@types/types';
import { currencyFormatter, dateFormatter } from '../utils/Formatters';
import debounce from 'lodash/debounce'
import useVuelidate from "@vuelidate/core";
import { required, ipAddress, numeric, minLength, maxLength, requiredIf } from "@vuelidate/validators"
import { notify } from "@kyvg/vue3-notification";
import ConfirmDialog from '../components/ConfirmDialog.vue'
import { copyText, totalPossibleGeneration } from "../utils/helpers";

interface PageState {
  loading: boolean,
  q: string,
  tableData: PaginatedData<GeneratedTid>
  stats: {}
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
  start: string,
  end: string,
//   iswPrefix: string,
//   hydrogenPrefix: string,
}

const request: AxiosInstance | undefined = inject('$axios');
const state: PageState = reactive<PageState>({
  loading: false,
  q: '',
  tableData: {
    docs: [],
    totalDocs: 0,
    limit: 30,
    page: 1,
    totalPages: 1,
  },
  stats: {}
})



const open = ref<boolean>(false);
const showApiKey = ref<boolean>(false);
const apiKey = ref<String>();
const creatingkey = ref<String[]>([])

const form = ref<Form>({
  start: '',
  end: '',
//   iswPrefix: '',
//   hydrogenPrefix: ''
})

const rules = computed(() => ({
  _id: {},
  start: { required, minLength: minLength(4),maxLength:maxLength(4) },
  end: { required, minLength: minLength(4),maxLength:maxLength(4) },
//   iswPrefix: { required, minLength: minLength(4), maxLength: maxLength(4)},
//   hydrogenPrefix: { required, minLength: minLength(4), maxLength: maxLength(4)},
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
  state.tableData.page = page;
  getTids();
}

const getTids = async () => {
  try {
    state.loading = true;
    const { page, limit } = state.tableData;
    const params = { page, limit, q: state.q }
    // @ts-ignore: Unreachable code error
    const { data } = await request?.get('/dashboard/generated-tids', {
      params
    });
    state.tableData = data.data;
  } catch (error: any) {

    if (error.isAxiosError) {

    }
  } finally {
    state.loading = false;
  }
}

const generateTidRange = async () => {
  try {
    const {data} = await request!.post<Form>('/dashboard/generate-tids',form.value);
    getTids();
    notify({
      title: "Success",
      type: "success",
      text: `Tids generated. Total: ${data.data.totalGenerated} `,
    });
    resetForm();
    open.value = false;
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

const getStats = async () => {
  try {
    const {data} = await request.get('/dashboard/generated-tids/stats');

    state.stats = data.data;
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

const resetForm = ()=> {
    form.value = {
        start: '',
        end: ''
    }
}


const deleteTid = async (confirm: boolean) => {
  if (!confirm) {
    confirmDelete.value = { ...confirmDelete.value, ...defaultDeleteState }
    return;
  };
  state.loading = true;
  try {
    // const { data } = await request!.delete('/dashboard/organisations/' + confirmDelete.value.id)
    notify({
      text: "Orgnainsation Deleted",
      title: "Item Deleted",
      type: "success"
    })
    getTids();
  } catch (error:any) {
    let message = error.message;
    if(error.isAxiosError) {
      message = error.response.data.message;
    }
  }finally {
    state.loading = false;
  }
}


const confirmOrganisationDelete = (organisation: GeneratedTid) => {
  confirmDelete.value = {
    ...confirmDelete.value,
    open: true,
    value: organisation._id,
    id: organisation._id || null,
    message: `To delete this Organisation confirm by typing: ${organisation.name}. N/B This will fail if organisation has performed a transaction.`
  }
}

const totalPossibleTids = computed(() => {
  if(form.value.start.length != 4 || form.value.end.length != 4) return null;
  return totalPossibleGeneration(form.value.start, form.value.end) *2
});

onMounted(() => {
  getTids()
  getStats()
})
</script>