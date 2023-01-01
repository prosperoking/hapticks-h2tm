<template>
  <div class="mt-8">
    <h3 class="text-3xl font-medium text-gray-700">Users</h3>

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
          class="px-6 py-2 mt-3 font-medium tracking-wide text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none">
          Add User
        </button>
      </div>
    </div>

    <div class="px-4 py-4 -mx-4 overflow-x-auto sm:-mx-8 sm:px-8">
      <div :class="{ 'opacity-20 relative': loading }"
        class="inline-block min-w-full overflow-hidden rounded-lg shadow">
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
              <!-- <th
                class="flex items-center px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">
                <Input v-model:value="selected" type="checkbox" class="inline-flex mr-2" />
              </th> -->
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">
                Name
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">
                Organisation
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">
                Role
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">
                Permissions
              </th>
              <th
                class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-if="state.data.totalDocs">
              <tr v-for="(user) in state.data.docs" :key="user._id">
                <!-- <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                  <div class="flex items-center">
                    <Input type="checkbox" :checked="false" :value="user._id" class="inline-flex mr-2" />
                  </div>
                </td> -->
                <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                  <div class="flex items-center">
                    <div class="ml-3">
                      <p class="text-gray-900 whitespace-nowrap">
                        {{ user.fullname }}
                      </p>
                      <p class="text-gray-600 whitespace-nowrap">
                        {{ user.username }}
                      </p>
                      <p class="text-blue-900 whitespace-nowrap">
                        <a :href="`mailto:${user.email}`">{{ user.email }}</a>
                      </p>
                    </div>
                  </div>
                </td>
                <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                  <p class="text-gray-900 whitespace-nowrap">
                    {{ user.organisation?.name }}
                  </p>
                </td>
                <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                  <p class="text-gray-900 whitespace-nowrap">
                    {{ user.role }}
                  </p>
                </td>

                <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                  <p class="text-gray-900 whitespace-nowrap">
                    {{ user.permissions }}
                  </p>
                </td>

                <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                  <button class="text-gray-500 hover:text-gray-600" @click="editUser(user)">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                      stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                    </svg>
                  </button>
                  <button class="text-red-500 hover:text-red-600" @click="confirmUserDelete(user)">
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
      <div class=" text-left modal-content">
        <!--Title-->
        <div class="flex px-6 py-4 items-center justify-between pb-3 border-b mb-4">
          <p class="text-2xl text-gray-600">{{ form._id ? 'Update' : 'Add' }} User</p>
          <div class="z-50 cursor-pointer modal-close" @click="open = false">
            <svg class="text-black fill-current" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
              viewBox="0 0 18 18">
              <path
                d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z" />
            </svg>
          </div>
        </div>

        <!--Body-->
        <div class="flex flex-col px-6 py-4">

          <div>
            <div class="flex items-baseline mb-2 space-x-2">
              <label class="w-1/5 text-sm font-bold text-gray-700" for="emailAddress">Organisation:</label>
              <OrganisactionSelect v-model="form.organisation_id" />
            </div>
          </div>
          <div>
            <Input title="Full name" v-model:value="form.fullname" />
          </div>
          <div>
            <Input title="Username" v-model:value="form.username" />
          </div>
          <div>
            <Input title="Email" type="email" v-model:value="form.email" />
          </div>
          <template v-if="!form._id">
            <div>
              <Input title="Password" type="password" v-model:value="form.password" />
            </div>
            <div>
              <Input title="Confirim Password" type="password" v-model:value="form.password_confirm" />
            </div>

          </template>

          <div class="flex flex-col w-full justify-start space-y-2">
            <h3 class="h-3 mb-3 font-bold text-blue-500">Permissions</h3>
            <Disclosure
              as="div"
              class="border border-gray-200 rounded"
              v-for="(permission, title) of permissions" :key="title">
              <DisclosureButton class="p-2 text-left flex w-full bg-blue-200 text-blue-600 uppercase">
                {{ title }}
              </DisclosureButton>
              <DisclosurePanel class="text-gray-500 p-2">
                <table class="w-full">
                  <tr v-for="(item, index) in permission" :key="index">
                    <td class="text-sm bg-white">
                      <p class="text-gray-900 whitespace-nowrap">
                        {{ item }}
                      </p>
                    </td>
                    
                    <td class="text-sm bg-white">
                      <div class="flex items-center">
                        <input
        :value="`${title}.${item}`"
                        v-model="form.permissions"
        class="p-1 mt-2 border border-gray-200 rounded-md focus:outline-none focus:border-none focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
        type="checkbox"  />
                    </div>
                      
                    </td>
                  </tr>
                </table>
              </DisclosurePanel>
            </Disclosure>
          </div>


        </div>
        <div class="px-6 py-4">
          <p v-for="error of $v.$errors" :key="error.$uid">
            {{ error.$message }}
          </p>
        </div>
        {{}}
        <!--Footer-->
        <div class="flex justify-end px-6 py-4">
          <button :disabled="loading" @click="open = false"
            class="p-3 px-6 py-3 mr-2 text-indigo-500 bg-transparent rounded-lg disabled:pointer-events-none hover:bg-gray-100 hover:text-indigo-400 focus:outline-none">
            Close
          </button>
          <button :disabled="loading || $v.$invalid" @click="saveUserForm"
            class="px-6 py-3 font-medium tracking-wide text-white bg-indigo-600 rounded-md disabled:opacity-25 disabled:pointer-events-none hover:bg-indigo-500 focus:outline-none">
            save
          </button>
        </div>
      </div>
    </div>
  </div>

  <ConfirmDialog v-model:value="confirmDelete.open" :title="confirmDelete.title" :confirm="confirmDelete.value"
    :message="confirmDelete.message" @accepted="deleteUser" />
</template>
  
<script lang="ts" setup>
import { reactive, inject, onMounted, ref, watch, computed } from 'vue';
import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
  } from '@headlessui/vue'
import { Axios } from 'axios';
// @ts-ignore
import Input from '../components/Input.vue'
// @ts-ignore
import ConfirmDialog from '../components/ConfirmDialog.vue'
// @ts-ignore
import OrganisactionSelect from '../components/OrganisactionSelect.vue'
import useVuelidate from "@vuelidate/core";
import { notify } from "@kyvg/vue3-notification"
import { required, requiredIf } from "@vuelidate/validators"
import { parse, format } from "date-fns"
import { Organisation, PaginatedData, User } from '../@types/types';
import useDebouncedRef from '../utils/DebounceRef';

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





interface UserForm {
  _id?: string,
  fullname: string,
  username: string,
  email: string,
  password?: string,
  password_confirm?: string,
  role?: string | null,
  permissions?: string[],
  organisation_id?: string | null,
}

interface State {
  data: PaginatedData<User>,
  count: number,
  perPage: number
}

type Permissions = {
  [key: string]: string[]
}

// @ts-ignore: Unreachable code error
const $axios: Axios = inject('$axios')

let state = ref<State>({
  data: {
    docs: [],
    totalDocs: 0,
    limit: 30,
    page: 1,
    totalPages: 1,
  },
  count: 0,
  perPage: 15,
})
let page = ref<number>(1);
let defaultDeleteState: { [key: string]: any, id: string | null } = {
  open: false,
  title: "Do you really want to delete this TID?",
  value: '',
  id: null,
}
let organisations = ref<Organisation[]>([])
let selected = ref<string[]>([]);
let permissions = ref<Permissions>({});
const loading = ref(false)
const confirmDelete = ref(defaultDeleteState)
const defualtState: UserForm = {
  _id: '',
  fullname: '',
  username: '',
  email: '',
  password: '',
  role: null,
  permissions: [],
  organisation_id: null,
}
let form = ref<UserForm>({ ...defualtState })
const open = ref(false);
const brandCustom = ref<boolean>(false);
const search = useDebouncedRef<string>('', 500);
const organisation = ref(null);

const parsedPermissions = computed<Permissions>(() => {
  return Object.keys(permissions.value).reduce((acc, key) => {
    return {
      ...acc,
      [key]: permissions.value[key].map((p: string) => `${key}.${p}`)
    }
  }, {})
})
const rules = computed(() => ({
  _id: {},
  fullname: { required },
  username: { required },
  organisationId: {},
  email: { email: true, required },
  password: { requiredIf: requiredIf(() => !form.value._id), confirmed: (value: string) => value === form.value.password_confirm },
  permissions: {},
}))


const $v = useVuelidate<UserForm>(rules, form, { $autoDirty: true, });
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
    const { data } = await $axios.get('/dashboard/users', {
      params
    })
    state.value = { ...state.value, data: data as PaginatedData<User> };
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false;
  }
}

const fetchPermissons = async () => {
  try {
    const { data } = await $axios.get('/dashboard/users/permissions')
    permissions.value = data.data as Permissions;
  } catch (error) {
    console.log(error)
  }
}

const editUser = (user: User) => {
  form.value = {
    _id: user._id,
    fullname: user.fullname,
    username: user.username,
    email: user.email,
    permissions: user.permissions,
    organisation_id: user.organisation_id,
  }
  open.value = true;
}



const deleteUser = async (confirm: boolean) => {
  if (!confirm) {
    confirmDelete.value = { ...confirmDelete.value, ...defaultDeleteState }
    return;
  };
  try {
    const { data } = await $axios.delete('/dashboard/users/' + confirmDelete.value.id)
    notify({
      text: "User Deleted",
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



const confirmUserDelete = (user: User) => {
  confirmDelete.value = {
    ...confirmDelete.value,
    open: true,
    value: user.username,
    id: user._id || null,
    message: `To delete this terminal confirm by typing: ${user.username}`
  }
}



const saveUserForm = async () => {
  loading.value = true;
  try {
    const { data } = await (
      form.value._id?.length ? $axios.put(`/dashboard/users/${form.value._id}`, form.value) :
        $axios.post('/dashboard/users', form.value)
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

watch(search, (value, prevValue) => {
  if (value === prevValue) return;
  fetchData();
})

watch(organisation, (value, prevValue) => {
  if (value === prevValue) return;
  fetchData();
})

onMounted(() => {
  fetchPermissons();
  fetchData();
})
</script>