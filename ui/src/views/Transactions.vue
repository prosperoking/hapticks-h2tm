<template>

  <h3 class="space-x-3 text-3xl font-medium text-gray-700">
    <span>Transactions: {{ state.transactions.totalDocs }}</span>
    <small class="text-sm text-blue-500" v-if="state.loading">Loading ...</small>
  </h3>
  <div class="flex items-center justify-between mt-6">
    <div class="w-2/12">
      <div>Filter</div>
      <div class="relative block w-full mt-2 sm:mt-0">
        <span class="absolute inset-y-0 left-0 flex items-center pl-2">
          <svg viewBox="0 0 24 24" class="w-4 h-4 text-gray-500 fill-current">
            <path
              d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z" />
          </svg>
        </span>

        <input placeholder="Search" v-model="state.q"
          @change="()=>state.q.length > 3 ? debounce(getTransactions, 400): null"
          class="flex w-full py-2 pl-8 pr-6 text-sm text-gray-700 placeholder-gray-400 bg-white border border-b border-gray-400 rounded appearance-none focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none" />
      </div>
    </div>
    <div class="w-2/12">
      <div class="relative block w-full mt-2 sm:mt-0">
        <label>Start Date</label>
        <input placeholder="Search" type="date" v-model="state.startDate"
          class="flex w-full py-2 pl-8 pr-6 text-sm text-gray-700 placeholder-gray-400 bg-white border border-b border-gray-400 rounded appearance-none focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none" />
      </div>

    </div>
    <div class="w-2/12">
      <div class="relative block w-full mt-2 sm:mt-0">
        <label>End Date</label>
        <input v-model="state.endDate" type="date"
          class="flex w-full py-2 pl-8 pr-6 text-sm text-gray-700 placeholder-gray-400 bg-white border border-b border-gray-400 rounded appearance-none focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none" />
      </div>

    </div>
    <div class="space-x-2">
      <button @click="getTransactions"
        class="px-6 py-2 font-medium tracking-wide text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none">
        search
      </button>
      <button
        class="px-6 py-2 font-medium tracking-wide text-white bg-gray-600 rounded-md hover:bg-gray-500 focus:outline-none">
        export
      </button>
    </div>
  </div>
  <div class="flex flex-col mt-8">
    <p class="my-2">
      Page {{ state.transactions.page }} of {{ state.transactions.totalPages }}
    </p>
    <div class="py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div class="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg">
        <table class="min-w-full">
          <thead>
            <tr>

              <th
                class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                Info
              </th>
              <th
                class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                Orgnisation
              </th>
              <th
                class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                MERCHANT INFO
              </th>
              <th
                class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                PROCESSOR
              </th>

              <th
                class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                Date
              </th>
              <th class="px-6 py-3 border-b border-gray-200 bg-gray-50"></th>
            </tr>
          </thead>

          <tbody class="bg-white">
            <template v-if="state.transactions?.totalDocs">
              <tr v-for="(u, index) in state.transactions.docs" :key="index">

                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap w-52">
                  <div class="flex items-center w-36">
                    <div class="ml-2">
                      <div class="text-sm font-medium leading-5 text-gray-500">
                        TID:
                        <span
                          class="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                          {{ u.terminalId}}</span>
                      </div>
                      <div class="text-sm font-medium leading-5 text-gray-500">
                        Stan: {{ u.STAN }}
                      </div>
                      <div class="text-sm font-medium leading-5 text-gray-500">
                        RRN: {{ u.rrn }}
                      </div>
                      <div class="text-sm font-medium leading-5 text-gray-500">
                        Amount: {{ currencyFormatter(u.amount / 100) }}
                      </div>
                      <div class="text-sm leading-5 text-gray-500">
                        <span class="inline-flex font-semibold leading-5  rounded-full">
                          PAN:
                        </span> {{ u.PAN }}
                      </div>
                      <div class="text-sm leading-5 text-gray-500">
                        <span class="inline-flexfont-semibold leading-5  rounded-full">
                          Response Code:
                        </span> {{ u.responseCode }}
                      </div>
                      <div class="text-sm leading-5 text-gray-500">
                        <span class="inline-flex font-semibold leading-5  rounded-full">
                          Meaning:
                        </span> {{ u.responseDescription }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    {{ u.organisation?.name }}
                  </div>

                </td>

                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    {{ u.merchantName }}
                  </div>
                  <div class="text-sm leading-5 text-gray-500">
                    {{ u.merchantAddress }}
                  </div>
                  <div class="text-sm leading-5 text-gray-500">
                    {{ u.merchantId }}
                  </div>
                </td>

                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                  <span
                    class="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">{{
                    u.processor
                    }}</span>
                </td>

                <td class="px-6 py-4 text-sm leading-5 text-gray-500 border-b border-gray-200 whitespace-nowrap">
                  {{ dateFormatter(u.transactionTime) }}
                </td>

                <td
                  class="px-6 py-4 text-sm font-medium leading-5 text-right border-b border-gray-200 whitespace-nowrap">
                  <a href="#" class="text-indigo-600 hover:text-indigo-900">print</a>
                </td>
              </tr>
            </template>
            <template v-else>
              <tr>
                <td colspan="7" class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                  <div class="text-sm font-medium leading-5 text-gray-900">
                    Keep Calm Transactions are coming
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
        <div v-if="state.transactions?.totalPages > 1"
          class="flex flex-col items-center px-5 py-5 bg-white border-t xs:flex-row xs:justify-between">
          <div class="space-x-10">
            <span class="text-xs text-gray-900 xs:text-sm">
              Page {{ state.transactions.page }} of {{ state.transactions.totalPages }}
            </span>
            <span class="text-xs text-gray-900 xs:text-sm">Showing 1 to {{state.transactions.limit}} of
              {{state.transactions.totalDocs}} transactions</span>
          </div>

          <div class="inline-flex mt-2 xs:mt-0">
            <button :disabled="!state.transactions.hasPrevPage" @click="()=>gotoPage(state.transactions?.prevPage || 1)"
              class="px-4 py-2 text-sm font-semibold text-gray-800 bg-gray-300 rounded-l disabled:opacity-30 hover:bg-gray-400">
              Prev
            </button>
            <button :disabled="!state.transactions.hasNextPage" @click="()=>gotoPage(state.transactions.nextPage || 1)"
              class="px-4 py-2 text-sm font-semibold text-gray-800 bg-gray-300 rounded-r disabled:opacity-20 hover:bg-gray-400">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import { ref, inject, reactive, onMounted } from "vue";
import axios, { AxiosInstance } from "axios"
import { Transaction, PaginatedData, Organisation } from '../@types/types';
import { currencyFormatter, dateFormatter } from '../utils/Formatters';
import debounce from 'lodash/debounce'
import { notify } from "@kyvg/vue3-notification";

interface TransactionState {
  loading: boolean,
  q: string,
  startDate?: string | null,
  endDate?: string | null,
  organisation: string | null,
  organisations: Organisation[],
  transactions: PaginatedData<Transaction>
}

interface User {
  name: string;
  email: string;
  title: string;
  title2: string;
  status: string;
  role: string;
}

const request: AxiosInstance | undefined = inject('$axios');
const state: TransactionState = reactive<TransactionState>({
  loading: false,
  q: '',
  startDate: null,
  endDate: null,
  organisation: null,
  organisations: [],
  transactions: {
    docs: [],
    totalDocs: 0,
    limit: 30,
    page: 1,
    totalPages: 1,
  },
})

const gotoPage = (page: number) => {
  state.transactions.page = page;
  getTransactions();
}

const search = () => {
  state.transactions.page = 1;
  getTransactions()
}
const getTransactions = async () => {
  try {
    state.loading = true;
    const { page, limit } = state.transactions;
    const { startDate, endDate, organisation } = state;
    const params = { page, limit, q: state.q, startDate, endDate, organisation }
    // @ts-ignore: Unreachable code error
    const { data } = await request?.get('/dashboard/transactions', {
      params
    });
    state.transactions = data;
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

const getOrganisations = async () => {
  try {
    const { data } = await request!.get<Organisation[]>('/dashboard/organisations/all',);
    state.organisations = data;
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

onMounted(() => {
  getTransactions();
  getOrganisations();
})
</script>