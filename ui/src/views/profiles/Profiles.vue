<template>
  <div class="mt-8">
    <h3 class="text-3xl font-medium text-gray-700">Profiles</h3>

    <div class="flex items-center justify-between mt-6">
      <div class="w-5/12">
        <div class="relative block w-full mt-2 sm:mt-0">
          <span class="absolute inset-y-0 left-0 flex items-center pl-2">
            <svg viewBox="0 0 24 24" class="w-4 h-4 text-gray-500 fill-current">
              <path
                d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z" />
            </svg>
          </span>

          <input v-model="query" placeholder="Search"
            class="flex w-full py-2 pl-8 pr-6 text-sm text-gray-700 placeholder-gray-400 bg-white border border-b border-gray-400 rounded appearance-none focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none" />
        </div>
      </div>
      <div>
        <button @click="open = true"
          class="px-6 py-3 mt-3 font-medium tracking-wide text-white bg-red-600 rounded-md hover:bg-red-500 focus:outline-none">
          Add profile
        </button>
      </div>
    </div>

    <div class="px-4 py-4 -mx-4 overflow-x-auto sm:-mx-8 sm:px-8">
      <div class="inline-block min-w-full overflow-hidden rounded-lg shadow">
        <table class="min-w-full leading-normal">
          <thead>
            <tr>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">
                Title
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">
                Type
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">
                Details
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">
                Terminals
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-if="state.totalDocs">

              <tr v-for="(profile) in state.docs" :key="profile._id">
                <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                  <div class="flex items-center">
                    <div class="ml-3">
                      <p class="text-gray-900 whitespace-nowrap">
                        {{ profile.title }}
                      </p>
                    </div>
                  </div>
                </td>
                <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                  <div class="flex items-center justify-start">
                    <div class="ml-3">
                      <span 
                      :class="{
                        'bg-green-100 text-green-800': profile.type === 'generic',
                        'bg-blue-100 text-blue-800': profile.type === 'intelliffin',
                      }"
                      class="p-1 text-sm rounded-lg whitespace-nowrap">
                        {{ profile.type }}
                      </span>
                    </div>
                  </div>
                </td>
                <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                  <template v-if="profile.type === 'generic'">
                    <p class="text-gray-900 whitespace-nowrap">Host: {{ profile.isoHost }}:{{ profile.isoPort }}</p>
                    <p class="text-gray-900 whitespace-nowrap">Is SSL: {{ profile?.isSSL ? "Yes" : "No" }}</p>
                  
                  </template>
                  <p class="text-gray-900 whitespace-nowrap">
                    Switch Amount: {{ !Boolean(profile.iswSwitchAmount) ? 'None' :
                        currencyFormatter(profile.iswSwitchAmount)
                    }}
                  </p>
                  <p class="text-gray-900 whitespace-nowrap">
                    Can Override Processor: {{ profile.allowProcessorOverride? 'Yes': 'No' }}
                  </p>
                  <p v-if="profile?.webhook" class="text-gray-900 whitespace-nowrap">
                    Webhook: {{ profile.webhook?.name }}
                  </p>
                </td>
                <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                  <p class="text-gray-900 whitespace-nowrap">
                    {{ profile.terminals_count }}
                  </p>
                </td>
                <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                  <!-- <span
                    :class="`relative inline-block px-3 py-1 font-semibold text-${profile?.statusColor}-900 leading-tight`">
                    <span aria-hidden
                      :class="`absolute inset-0 bg-${profile?.statusColor}-200 opacity-50 rounded-full`"></span>
                    <span class="relative">{{ profile?.status }}</span>
                  </span> -->
                  <button 
                    class="text-gray-500 hover:text-gray-600" 
                    @click="editProfile(profile)">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                      stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                    </svg>
                  </button>
                  <button class="text-red-500 hover:text-red-600" @click="confirmProfileDelete(profile)">
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
                <td class="px-5 py-5 text-sm bg-white border-b border-gray-200" colspan="4">
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
        <div v-if="state.totalPages > 1"
          class="flex flex-col items-center px-5 py-5 bg-white border-t xs:flex-row xs:justify-between">
          <span class="text-xs text-gray-900 xs:text-sm">Showing 1 to 4 of 50 Entries</span>

          <div class="inline-flex mt-2 xs:mt-0">
            <button @click="gotoPage(state.prevPage)"
              class="px-4 py-2 text-sm font-semibold text-gray-800 bg-gray-300 rounded-l hover:bg-gray-400">
              Prev
            </button>
            <button @click="gotoPage(state.nextPage)"
              class="px-4 py-2 text-sm font-semibold text-gray-800 bg-gray-300 rounded-r hover:bg-gray-400">
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
          <p class="text-2xl font-bold">Add Profile</p>
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
            <Input title="Title" v-model:value="form.title" />
          </div>
          <div>

            <div class="flex items-baseline mb-2 space-x-2">

              <label class="w-1/5 text-sm font-bold text-gray-700" for="type">Type: </label>
              <select
                v-model="form.type"
                class="w-4/5 p-1 mt-2 border border-gray-200 rounded-md focus:outline-none focus:border-none focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                name="typ" id="type">
                <option value="generic">Generic</option>
                <option value="3line">3Line</option>
                <option value="intelliffin">Intelliffin</option>
              </select>

            </div>
          </div>
         
         <template v-if="['generic', '3line'].includes(form.type)">
          <div>
            <Input title="Component Key" v-model:value="form.componentKey1" />
          </div>
            <div>
              <Input title="Host IP" v-model:value="form.isoHost" />
            </div>
            <div>
              <Input title="Host PORT" v-model:value="form.isoPort" />
            </div>
            <div>
              <Input title="Is SSL" v-model:value="form.isSSL" type="checkbox" />
            </div>
         </template>
         <div>
            <div class="flex items-baseline mb-2 space-x-2">

              <label class="w-1/5 text-sm font-bold text-gray-700" for="type">Allow Processor Override: </label>
              <select
                v-model="form.allowProcessorOverride"
                class="w-4/5 p-1 mt-2 border border-gray-200 rounded-md focus:outline-none focus:border-none focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                name="typ" id="type">
                <option :value="false">No</option>
                <option :value="true">Yes</option>
              </select>

            </div>
          </div>
          <div>
            <Input title="ISW Switch Amount" v-model:value="form.iswSwitchAmount" type="number" />
          </div>
          <div>
            <Input title="ISW MID" v-model:value="form.iswMid" type="text" />
          </div>
          <div>
            <!-- <Input title="ISW Destination Institution Code" v-model:value="form.iswInstitutionCode" type="number" /> -->
            <label class="w-1/5 text-sm font-bold text-gray-700" for="type">ISW Bank: </label>
            <select
                v-model="form.iswInstitutionCode"
                class="w-2/5 p-1 mt-2 border border-gray-200 rounded-md focus:outline-none focus:border-none focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                name="typ" id="type">
                <option v-for="(institution, index) of institutionCodes" :key="index" :value="institution.value">{{ institution.title }}</option>
              </select>
          </div>

          <div>
            <Input title="ISW Destination Account" v-model:value="form.iswDestinationAccount" type="number" />
          </div>

          <div class="flex space-x-4">
            <div class="w-1/2">
              <WebhookSelect placeholder="Pick Webhook" v-model="form.webhookId" />
            </div>

            <div class="w-1/2">
              <OrganisactionSelect placeholder="Pick organisation" v-model="form.organisationId" />
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
    :message="confirmDelete.message" @accepted="deleteProfile" />
</template>

<script lang="ts" setup>
import { reactive, inject, onMounted, ref, watch, computed } from 'vue';
import { notify } from "@kyvg/vue3-notification"
import { Axios } from 'axios';
import ConfirmDialog from '../../components/ConfirmDialog.vue'
// @ts-ignore
import Input from '../../components/Input.vue'
import { currencyFormatter, dateFormatter } from '../../utils/Formatters';
import useVuelidate from "@vuelidate/core";
import { required, ipAddress, numeric, minValue, requiredIf } from "@vuelidate/validators"
import { Organisation, PaginatedData, Webhook } from '../../@types/types';
import useDebouncedRef from '../../utils/DebounceRef';
// @ts-ignore
import WebhookSelect from '../../components/WebhookSelect.vue';
// @ts-ignore
import OrganisactionSelect from '../../components/OrganisactionSelect.vue';

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
  iswInstitutionCode?: string,
  iswDestinationAccount?: string,
  iswMid?: string | null,
  webhookId: string | null,
  allowProcessorOverride: boolean,
  organisationId: string | null,
  webhook?: Webhook,
  type: string
  organisation?: Organisation,
}




// @ts-ignore: Unreachable code error
const $axios: Axios = inject('$axios')

let state = ref<PaginatedData<Profile>>({
  docs: [],
  totalDocs: 0,
  limit: 30,
  page: 1,
  totalPages: 1,
})
let organisations = ref<Organisation[]>([]);
const loading = ref(false)
let defaultDeleteState: { [key: string]: any, id: string | null } = {
  open: false,
  title: "Do you really want to delete this Profile?",
  value: '',
  id: null,
}
const confirmDelete = ref(defaultDeleteState)
const defualtState = {
  title: '',
  isoHost: '',
  isoPort: '',
  isSSL: false,
  componentKey1: '',
  type: 'generic',
  componentKey2: '',
  iswSwitchAmount: 0,
  iswInstitutionCode: '',
  iswDestinationAccount: '',
  allowProcessorOverride: false,
  iswMid: null,
  webhookId: null,
  organisationId: null,
}

const institutionCodes = [
    {title: "UBA", value: 627480},
    {title: "Fidelity", value: 639138},
    {title: "Polari", value: 636092},
    {title: "Unity bank", value: 639609},
    {title: "Zenith", value:627629},
    {title: "Providus", value:506146},
]

const confirmType = (value: string) => ['generic', 'intelliffin'].includes(value) || 'Invalid type'

let form = ref<Profile>({ ...defualtState })
const open = ref(false);
const query = useDebouncedRef<string>('', 300);
const rules = computed(() => ({
  title: { required },
  isoHost: { requiredIf: requiredIf(() =>  ['generic', '3line'].includes(form.value.type)), ipAddress },
  isoPort: { requiredIf: requiredIf(() => ['generic', '3line'].includes(form.value.type)), numeric },
  isSSL: { requiredIf: requiredIf(() => ['generic', '3line'].includes(form.value.type))},
  componentKey1: { requiredIf: requiredIf(() => ['generic', '3line'].includes(form.value.type)) },
  type: { confirmType },
  iswSwitchAmount: { minValue: minValue(0) },
  iswMid: { requiredIf: requiredIf(() => Boolean(form.value.iswSwitchAmount)) }
}))
const $v = useVuelidate<Profile>(rules, form, { $autoDirty: true, })

const fetchData = async () => {
  try {
    const { limit, page } = state.value;
    const { data } = await $axios.get('/dashboard/profiles', {
      params: {
        limit,
        page,
        q: query.value,
      }
    })
    state.value = { ...data };
  } catch (error: any) {
    console.log(error)
    notify({
      title: "Error",
      type: "error",
      text: error?.message
    })
  }
}

const fetchOrganisations = async () => {
  try {
    const { data } = await $axios.get<Organisation[]>('/dashboard/organisations/all')
    organisations.value = data;
  } catch (error: any) {
    console.log(error)
    notify({
      title: "Error",
      type: "error",
      text: error?.message
    })
  }
}

const gotoPage = (page?: number) => {
  state.value.page = page!;
  fetchData();
}
const editProfile = (value: Profile) => {
  open.value = true;
  form.value = {
    ...form.value,
    ...value,
    organisationId: value.organisationId,
    webhookId: value.webhookId,
    _id: value._id,
  }
}

const confirmProfileDelete = (profile: Profile) => {
  confirmDelete.value = {
    ...confirmDelete.value,
    open: true,
    value: profile.title,
    id: profile._id || null,
    message: `To delete this profile confirm by typing: ${profile.title}`
  }
}

const deleteProfile = async (confirm: boolean)  => {
  if (!confirm) {
    confirmDelete.value = { ...confirmDelete.value, ...defaultDeleteState }
    return;
  };
  try {
    const { data } = await $axios.delete('/dashboard/profiles/' + confirmDelete.value.id)
    notify({
      text: "Profile Deleted",
      title: "Item Deleted",
      type: "success"
    })
    fetchData();
  } catch (error) {
    console.log(error)
  }
}

const saveProfileForm = async () => {
  // @ts-ignore: Unreachable code error
  if (!await $v?.$valid)
    loading.value = true;
  try {
    console.log(form.value._id)
    const { data } = await (
      !form.value._id?.length ? $axios.post('/dashboard/profiles', form.value) :
        $axios.put(
          `/dashboard/profiles/${form.value._id}`,
          form.value
        )
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

watch(open, (value, prevValue) => {
  if (value) return;
  form.value = { ...defualtState };
})

watch(query, (value, prev) => {
  fetchData();
})

onMounted(() => {
  fetchData();
})
</script>