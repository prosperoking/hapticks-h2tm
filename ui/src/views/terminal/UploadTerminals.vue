<template>
  <h3 class="text-3xl font-medium text-gray-700">Upload Terminals</h3>
  <div class="flex space-x-2 my-2">
    <div>
      <label>Profile</label>
      <ComboSelect placeholder="select profile" :options="fetchProfiles" v-model="form.profileId" valueKey="id" titleKey="title" />
    </div>
    <div>
      <label >Orgnaisation</label>
      <OrganisactionSelect v-model="form.organisationId"/>
    </div>
    <div class="flex items-end " v-if="form.terminals.length">
      <button
      :disabled="$v.$error || busy"
      @click="uploadData"
      class="px-6 py-2 mt-3 font-medium tracking-wide text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none disabled:bg-blue-300 disabled:cursor-not-allowed"
      >Upload</button>
    </div>
  </div>
  <div class="flex items-center space-x-5">
    <div
      @dragenter.prevent
      @dragover.prevent

      @drop.prevent="handleFileDrop" @click="()=>
      // @ts-ignore
      $refs?.file.click()"
      class="flex mt-2 items-center justify-center w-1/3 bg-white border-2 border-gray-700 border-dashed rounded shadow h-36 p-5 hover:cursor-pointer">
      <span v-if="fileName==null">Drop Or Click to upload</span>
      <span v-else>{{fileName}}</span>
      <input ref="file" class="hidden" type="file" accept="text/csv" @change="handleFileInputChange" />
    </div>
    <a href="/template.csv" class="text-blue-500 hover:text-blue-600 hover:underline flex items-center space-x-2">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>

     <span> Download sample</span>
    </a>

  </div>
  <template v-if="form.terminals.length">
    <div
            class="inline-block min-w-full overflow-hidden rounded-lg shadow my-4"
          >
            <table class="min-w-full leading-normal">
              <thead>
                <tr>
                  <th
                    class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                  >
                    Terminal ID
                  </th>
                  <th
                    class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                  >
                  SerialNo
                  </th>
                  <th
                    class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                  >
                  ThreeLineTid
                  </th>
                  <th
                    class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                  >
                    ISW Terminal ID
                  </th>
                  <th
                    class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                  >
                    ISW Unique ID
                  </th>
                  <th
                    class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                  >
                    Brand
                  </th>
                  <th
                    class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                  >
                    Model
                  </th>
                  <th
                    class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(terminal, index) in pagedData.docs" :key="index">
                  <td
                    class="px-5 py-5 text-sm bg-white border-b border-gray-200"
                  >
                    <div class="flex items-center">
                      <div class="flex-shrink-0 w-10 h-10">
                        {{terminal.terminalId}}
                      </div>
                    </div>
                    <error-message :errors="errors" :errorKey="`terminals[${index * page}].terminalId`" />
                  </td>
                  <td
                    class="px-5 py-5 text-sm bg-white border-b border-gray-200"
                  >
                  <div class="flex items-center">
                      <div class="flex-shrink-0 w-10 h-10">
                        {{terminal.serialNo}}
                      </div>
                    </div>
                    <error-message :errors="errors" :errorKey="`terminals[${index * page}].serialNo`" />
                  </td>
                  <td
                    class="px-5 py-5 text-sm bg-white border-b border-gray-200"
                  >
                  <div class="flex items-center space-y-2">
                      <div class="flex-shrink-0 w-10 h-10">
                        {{terminal.threeLineTid}}
                      </div>
                    </div>
                    <error-message :errors="errors" :errorKey="`terminals[${index * page}].iswTid`" />
                  </td>
                  <td
                    class="px-5 py-5 text-sm bg-white border-b border-gray-200"
                  >
                  <div class="flex items-center space-y-2">
                      <div class="flex-shrink-0 w-10 h-10">
                        {{terminal.iswTid}}
                      </div>
                    </div>
                    <error-message :errors="errors" :errorKey="`terminals[${index * page}].iswTid`" />
                  </td>
                  <td
                    class="px-5 py-5 text-sm bg-white border-b border-gray-200"
                  >
                  <div class="flex items-center">
                      <div class="flex-shrink-0 w-10 h-10">
                        {{terminal.iswUniqueId}}
                      </div>
                    </div>
                    <error-message :errors="errors" :errorKey="`terminals[${index * page}].iswUniqueId`" />
                  </td>
                  <td
                    class="px-5 py-5 text-sm bg-white border-b border-gray-200"
                  >
                  <div class="flex items-center">
                      <div class="flex-shrink-0 w-10 h-10">
                        {{terminal.brand}}
                      </div>
                    </div>
                  </td>
                  <td
                    class="px-5 py-5 text-sm bg-white border-b border-gray-200"
                  >
                  <div class="flex items-center">
                      <div class="flex-shrink-0 w-10 h-10">
                        {{terminal.deviceModel}}
                      </div>
                    </div>
                  </td>
                  <td
                    class="px-5 py-5 text-sm bg-white border-b border-gray-200"
                  >
                  <div class="flex items-center">
                      <div class="flex-shrink-0 w-10 h-10">

                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div
              v-if="pagedData.pages > 1"
              class="flex flex-col items-center px-5 py-5 bg-white border-t xs:flex-row xs:justify-between"
            >
              <span class="text-xs text-gray-900 xs:text-sm"
                >Showing {{pagedData.pageInfo.start}} to {{pagedData.pageInfo.end}}  of {{pagedData.total}} </span
              >

              <div class="inline-flex mt-2 xs:mt-0">
                <button
                  :disabled="pagedData.prevPage === null"
                  @click="page = pagedData.prevPage || 1"
                  class="px-4 py-2 text-sm font-semibold text-gray-800 bg-gray-300 rounded-l hover:bg-gray-400"
                >
                  Prev
                </button>
                <button
                  :disabled="pagedData.nextPage === null"
                  @click="page = pagedData.prevPage || 1"
                  class="px-4 py-2 text-sm font-semibold text-gray-800 bg-gray-300 rounded-r hover:bg-gray-400"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
  </template>
</template>

<script setup lang="ts">
import { computed, inject, ref, reactive, watch } from "vue";
import * as ParseCsv from "csv-parse/browser/esm/sync";
// @ts-ignore
import ComboSelect from "../../components/ComboSelect.vue";
// @ts-ignore
import OrganisationSelect from "../../components/OrganisactionSelect.vue";
// @ts-ignore
import OrganisactionSelect from "../../components/OrganisactionSelect.vue";
// @ts-ignore
import ErrorMessage from "../../components/ErrorMessage.vue";
import { notify } from "@kyvg/vue3-notification";
import chunk from "lodash/chunk"
import useVuelidate from "@vuelidate/core";
import { helpers, required } from '@vuelidate/validators';
import { Axios } from "axios";


interface TerminalData {
  serialNo: string,
  terminalId: string,
  threeLineTid?: string,
  iswTid?: string | null,
  iswUniqueId?: string | null,
  brand?: string | null,
  deviceModel?: string | null,
}

interface TerminalForm {
  terminals: TerminalData[],
  profileId: string | null,
  organisationId: string | null,
}
let defaultForm = {
  terminals:[],
  profileId: null,
  organisationId: null,
}
let form = reactive<TerminalForm>(defaultForm);

const readingFile = ref(false);
const fileName= ref<string | null>(null);
const errors = ref<{}>({})
const page = ref(1);
const busy = ref(false);

const $axios = inject<Axios>('$axios')

const rules = {
  profileId: {
    required,
  },
  organisationId: {

  },
  terminals: {
    $each: helpers.forEach({
      terminalId: {
        required,
      },
      serialNo: {
        required,
      },
      iswTid: {
        required,
      },
      iswUniqueId: {
        required,
      },
      brand: {
        required,
      },
      deviceModel: {
        required,
      }
    })
  }
}

const $v = useVuelidate<TerminalForm>(rules, form, { $autoDirty: true, });

const readFile: (file:File)=> Promise<TerminalData[]> = (file: File) =>{

  return new Promise((resolve,reject)=>{

    if(file.type !== 'text/csv') {
      reject("Incorrect file format")
    }
    const fileReader = new FileReader();
    fileReader.readAsText(file);
    fileReader.addEventListener('loadend',()=>{
      const data = fileReader?.result?.toString() || '';
      const rows = ParseCsv.parse(data, {
        skipEmptyLines: true,
        columns: true,
      });
      resolve(rows);
    })

    fileReader.addEventListener('error',(err)=>{
      reject("Failed to read file")
    })
  });
}

const handleFileInputChange = async (event: Event)=>{
  const files = (event.currentTarget as HTMLInputElement)?.files;
  if(!files?.length) return;
  try {
    const file = files[0];
    fileName.value = file.name;
    const terminals = await readFile(file);
    form.terminals = terminals;
  } catch (error) {
    notify({
      title: "Failed",
      type: "error",
      text: "Failed to read file"
    })
  }

}

const handleFileDrop = async (ev: any)=>{
  const files:FileList = ev.dataTransfer.files;
  if(!files.length) return;
  try {
    const file = files[0];
    fileName.value = file.name;
    const terminals = await readFile(file);
    // Todo: validate
    form.terminals = terminals;
  } catch (error) {
    notify({
      title: "Failed",
      type: "error",
      text: "Failed to read file"
    })
  }
}

const pagedTerminals = computed(()=>chunk(form.terminals, 50));

const pagedData = computed(()=>{
  const total = form.terminals.length;
  const pages = pagedTerminals.value.length;
  const prevPage = page.value === 1? null: page.value - 1;
  const nextPage = page.value === pages? null: page.value + 1;

  return {
    total,
    pages,
    docs: pagedTerminals.value[page.value - 1] || [],
    prevPage,
    nextPage,
    pageInfo:{
      start: (page.value * 50) +1 ,
      end: (page.value * 50) +  (pagedTerminals.value[page.value - 1 ] || [])?.length
    }
  }
});

const fetchProfiles: (q:string)=>Promise<any> = async (q: string)=> {
  try {
    const { data } = await $axios!.get('/dashboard/profiles', {
      params:{ q }
    })
    return data.docs;
  } catch (error) {
   return []
  }
}

const uploadData = async ()=>{
  try {
    errors.value = {};
    const {data} = await $axios!.post('/dashboard/terminals/bulk-upload', form);
    form = {... defaultForm}
    notify({
      title: "Success",
      type: "success",
      text: `Total of ${form.terminals.length} terminals successfully uploaded`
    })
  }
  catch (error: any) {
    let message = error.message
    if(error.isAxiosError) {
      message = error.response.data.message;
      if(error.response.status === 412) {
        const {data} = error.response;
        errors.value = {...data.errors}
      }

    }
    notify({
      title: "Error",
      type: "error",
      text: `Failed to upload terminals: ${message}`
    })
  }
}

watch(form,()=>{
  $v.value.$validate();
})

</script>