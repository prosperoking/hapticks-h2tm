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

          <input placeholder="Search"
            class="flex w-full py-2 pl-8 pr-6 text-sm text-gray-700 placeholder-gray-400 bg-white border border-b border-gray-400 rounded appearance-none focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none" />
        </div>
      </div>
      <div class="space-x-2">
        <button @click="open = true"
          class="px-6 py-2 mt-3 font-medium tracking-wide text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none">
          Add Terminal
        </button>

        <router-link :to="{ name: 'bulk-upload' }">
          upload csv
        </router-link>

      </div>
    </div>

    <div class="px-4 py-4 -mx-4 overflow-x-auto sm:-mx-8 sm:px-8">
      <div class="inline-block min-w-full overflow-hidden rounded-lg shadow">
        <table class="min-w-full leading-normal">
          <thead>
            <tr>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">
                TerminalID
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">
                Serial No
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
            <template v-if="state.count">

              <tr v-for="(terminal) in state.data" :key="terminal._id">
                <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                  <div class="flex items-center">
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
                  <!-- <span
                    :class="`relative inline-block px-3 py-1 font-semibold text-${terminal?.statusColor}-900 leading-tight`">
                    <span aria-hidden
                      :class="`absolute inset-0 bg-${terminal?.statusColor}-200 opacity-50 rounded-full`"></span>
                    <span class="relative">{{ terminal?.status }}</span>
                  </span> -->
                  <button @click="editTerminal(terminal)">
                    edit
                  </button>
                </td>
              </tr>
            </template>
            <template v-else>
              <tr>
                <td class="px-5 py-5 text-sm bg-white border-b border-gray-200" colspan="5">
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
        <div v-if="state.count > state.perPage"
          class="flex flex-col items-center px-5 py-5 bg-white border-t xs:flex-row xs:justify-between">
          <span class="text-xs text-gray-900 xs:text-sm">Showing 1 to 4 of 50 Entries</span>

          <div class="inline-flex mt-2 xs:mt-0">
            <button class="px-4 py-2 text-sm font-semibold text-gray-800 bg-gray-300 rounded-l hover:bg-gray-400">
              Prev
            </button>
            <button class="px-4 py-2 text-sm font-semibold text-gray-800 bg-gray-300 rounded-r hover:bg-gray-400">
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
            class="p-3 px-6 py-3 mr-2 text-indigo-500 bg-transparent rounded-lg disabled:pointer-events-none hover:bg-gray-100 hover:text-indigo-400 focus:outline-none">
            Close
          </button>
          <button :disabled="loading || $v.$invalid" @click="saveProfileForm"
            class="px-6 py-3 font-medium tracking-wide text-white bg-indigo-600 rounded-md disabled:opacity-25 disabled:pointer-events-none hover:bg-indigo-500 focus:outline-none">
            save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, inject, onMounted, ref, watch, computed } from 'vue';
import { Axios } from 'axios';
import Input from '../../components/Input.vue'
import useVuelidate from "@vuelidate/core";
import { notify } from "@kyvg/vue3-notification"
import { required, ipAddress, numeric, minLength, maxLength, requiredIf } from "@vuelidate/validators"
import { parse, format } from "date-fns"

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
}

interface State {
  data: Terminal[],
  count: number,
  perPage: number
}


// @ts-ignore: Unreachable code error
const $axios: Axios = inject('$axios')

let state = ref<State>({ data: [], count: 0, perPage: 15 })
let profiles = ref<Profile[]>([])
const loading = ref(false)
const defualtState: TerminalForm = {
  serialNo: '',
  terminalId: '',
  profileId: '',
  iswTid: null,
  iswUniqueId: null,
}
let form = ref<TerminalForm>({ ...defualtState })
const open = ref(false);

const rules = computed(() => ({
  _id: {},
  serialNo: { required },
  terminalId: { required, minLength: minLength(8), maxLength: maxLength(8), },
  profileId: { required },
  iswTid: { minLength: minLength(8) },
  iswUniqueId: { requiredIf: requiredIf(() => form.value.iswTid !== null || (form.value.iswTid || '')?.length > 0) },
}))

const $v = useVuelidate<TerminalForm>(rules, form, { $autoDirty: true, })

const fetchData = async () => {
  try {
    const { data } = await $axios.get('/dashboard/terminals')
    state.value = { ...state, ...data };
  } catch (error) {
    console.log(error)
  }
}

const editTerminal = (terminal: Terminal) => {
  form.value = {
    profileId: terminal.profileId,
    serialNo: terminal.serialNo,
    terminalId: terminal.terminalId,
    iswTid: terminal.iswTid,
    iswUniqueId: terminal.iswUniqueId,
    _id: terminal._id,
  }
  open.value = true;
}

const fetchProfilesData = async () => {
  try {
    const { data } = await $axios.get('/dashboard/profiles')
    profiles.value = data.data;
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


const formatExchangeTime = (value: string) => {
  const parsed = parse(value, 'yyyyLLddHHmmss', new Date);
  return format(parsed, 'hh:mm a eee do LLL yyyy')
}

watch(open, (value, prevValue) => {
  if (value) return;
  form.value = { ...defualtState };
})

onMounted(() => {
  fetchData();
  fetchProfilesData();
})
</script>