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

        <input placeholder="Search"
          class="flex w-full py-2 pl-8 pr-6 text-sm text-gray-700 placeholder-gray-400 bg-white border border-b border-gray-400 rounded appearance-none focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none" />
      </div>
      </div>
      <div>
        <button
        @click="open = true"
        class="px-6 py-3 mt-3 font-medium tracking-wide text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none"
      >
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
            <template v-if="state.count">

              <tr v-for="(profile) in state.data" :key="profile._id">
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
                  <p class="text-gray-900 whitespace-nowrap">Host: {{ profile.isoHost }}:{{profile.isoPort}}</p>
                  <p class="text-gray-900 whitespace-nowrap">Is SSL: {{ profile?.isSSL? "Yes":"No" }}</p>
                  <p class="text-gray-900 whitespace-nowrap">
                    Switch Amount: {{  !Boolean(profile.iswSwitchAmount) ? 'None': currencyFormatter(profile.iswSwitchAmount) }}
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
                  <button @click="editProfile(profile)">
                    edit
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
  <div
      :class="`modal ${
        !open && 'opacity-0 pointer-events-none'
      } z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center`"
    >
      <div
        class="absolute w-full h-full bg-gray-900 opacity-50 modal-overlay"
      ></div>

      <div
        class="z-50 w-11/12 mx-auto overflow-y-auto bg-white rounded shadow-lg modal-container md:max-w-md"
      >
        <div
         @click="open = false"
          class="absolute top-0 right-0 z-50 flex flex-col items-center mt-4 mr-4 text-sm text-white cursor-pointer modal-close"
        >
          <svg
            class="text-white fill-current"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
          >
            <path
              d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"
            />
          </svg>
          <span class="text-sm">(Esc)</span>
        </div>

        <!-- Add margin if you want to see some of the overlay behind the modal-->
        <div class="px-6 py-4 text-left modal-content">
          <!--Title-->
          <div class="flex items-center justify-between pb-3">
            <p class="text-2xl font-bold">Add Profile</p>
            <div class="z-50 cursor-pointer modal-close" @click="open = false">
              <svg
                class="text-black fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
              >
                <path
                  d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"
                />
              </svg>
            </div>
          </div>

          <!--Body-->
          <div class="flex flex-col">
            <div>
              <Input title="Title" v-model:value="form.title" />
            </div>
            <div>
              <Input title="Component Key 1" v-model:value="form.componentKey1" />
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
            <div>
              <Input title="ISW Switch Amount" v-model:value="form.iswSwitchAmount" type="number" />
            </div>
            <div>
              <Input title="ISW MID" v-model:value="form.iswMid" type="text" />
            </div>
            <div>
              <Input title="ISW Destination Institution Code" v-model:value="form.iswInstitutionCode" type="number" />
            </div>

            <div>
              <Input title="ISW Destination Account" v-model:value="form.iswDestinationAccount" type="number" />
            </div>
          </div>
          <div>
            <p v-for="error of $v.$errors" :key="error.$uid">
              {{ error.$message }}
            </p>
          </div>

          <!--Footer-->
          <div class="flex justify-end pt-2">
            <button
            :disabled="loading"
              @click="open = false"
              class="p-3 px-6 py-3 mr-2 text-indigo-500 bg-transparent rounded-lg disabled:pointer-events-none hover:bg-gray-100 hover:text-indigo-400 focus:outline-none"
            >
              Close
            </button>
            <button
              :disabled="loading || $v.$invalid"
              @click="saveProfileForm"
              class="px-6 py-3 font-medium tracking-wide text-white bg-indigo-600 rounded-md disabled:opacity-25 disabled:pointer-events-none hover:bg-indigo-500 focus:outline-none"
            >
              save
            </button>
          </div>
        </div>
      </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive, inject, onMounted, ref, watch,computed } from 'vue';
import {notify} from "@kyvg/vue3-notification"
import {Axios} from 'axios';
import Input from '../../components/Input.vue'
import { currencyFormatter, dateFormatter } from '../../utils/Formatters';
import useVuelidate from "@vuelidate/core";
import {required, ipAddress, numeric, minValue, requiredIf} from "@vuelidate/validators"

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
}

interface State {
  data: Profile[],
  count: number,
  perPage: number
}


// @ts-ignore: Unreachable code error
const $axios:Axios = inject('$axios')

let state = ref<State>({ data: [], count: 0, perPage: 15 })
const loading = ref(false)
const defualtState = {
  title: '',
  isoHost: '',
  isoPort: '',
  isSSL: false,
  componentKey1: '',
  componentKey2: '',
  iswSwitchAmount: 0,
  iswInstitutionCode: '',
  iswDestinationAccount: '',
  iswMid: null,
}
let form = ref<Profile>({...defualtState})
const open = ref(false);
const rules = computed(()=>({
  title: {required},
  isoHost: {required, ipAddress},
  isoPort: {required, numeric},
  isSSL: {required},
  componentKey1: {required},
  // componentKey2: {required},
  iswSwitchAmount: {minValue: minValue(0)},
  iswMid: { requiredIf: requiredIf(()=>Boolean(form.value.iswSwitchAmount) ) }
}))
const $v = useVuelidate<Profile>(rules, form, { $autoDirty: true,  })

const fetchData = async () =>{
  try {
    const {data} =await $axios.get('/dashboard/profiles')
    console.log(data,state.value.count)
    state.value = {...state, ...data};
  } catch (error: any) {
    console.log(error)
    notify({
      title: "Error",
      type: "error",
      text: error?.message
    })
  }
}

const editProfile = (value: Profile)=>{
  open.value = true;
  form.value = {
    ...form.value ,
    ... value,
    _id: value._id,
  }
}

const saveProfileForm =async () => {
  // @ts-ignore: Unreachable code error
  if(!await $v?.$valid)
  loading.value = true;
  try {
    console.log(form.value._id)
    const {data} = await( 
      !form.value._id?.length? $axios.post('/dashboard/profiles',form.value):
                               $axios.put(
                                `/dashboard/profiles/${form.value._id}`,
                                form.value
                              )
    );
    open.value = false;
    fetchData()
  } catch (error:any) {
    notify({
      title: "Error",
      type: "error",
      text: error?.response.data.message || error.message
    })
  }finally {
    loading.value = false;
    
  }
}

watch(open,(value, prevValue)=>{
  if(value) return;
  form.value = {...defualtState};
})

onMounted(()=>{
  fetchData()
})
</script>