<template>
  <h3 class="text-3xl font-medium text-gray-700">Upload Terminals</h3>
  <div v-if="!form.length">
    <div class="flex items-center justify-center w-48 bg-white border-2 border-gray-700 border-dashed rounded shadow h-36">
      <input type="file" accept="text/csv" @change="handleFileInputChange" />
    </div>
    <div>
      <label >profiles</label>
      <ComboSelect :options="fetchProfiles" :value-key="'id'" />
    </div>
  </div>
  <div v-else></div>
</template>

<script setup lang="ts">
import { inject, ref } from "vue";
import * as ParseCsv from "csv-parse/browser/esm/sync"
import ComboSelect from "../../components/ComboSelect.vue";


interface TerminalForm {
  _id?: string,
  serialNo: string,
  terminalId: string,
  profileId: string,
  iswTid?: string | null,
  iswUniqueId?: string | null,
  brand?: string | null,
  deviceModel?: string | null,
}

let form = ref<TerminalForm[]>([]);
// @ts-ignore: Unreachable code error
const $axios: Axios = inject('$axios')

const handleFileInputChange = (event: Event)=>{
  const fileReader = new FileReader()
  
  const file = (event.currentTarget as HTMLInputElement)?.files;
  if(file?.length){
    console.log(fileReader.readAsText(file[0]))
  }

  fileReader.addEventListener('loadend',()=>{
    const data = fileReader?.result?.toString() || '';
    console.log( ParseCsv.parse(data, {
      skipEmptyLines: true,
      columns: true,
    }) )
  })
}

const fetchOrganisations: (q:string)=>Promise<any> = async (query: string)=> {
  console.log(query)
}

const fetchProfiles: (q:string)=>Promise<any> = async (q: string)=> {
  console.log(q)
  try {
    const { data } = await $axios.get('/dashboard/profiles', {
      query:{ q }
    })
    return data.data;
  } catch (error) {
   return []
  }
}

</script>