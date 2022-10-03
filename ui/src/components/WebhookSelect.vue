<template>
    <ComboSelect v-model="value" placeholder="Select Organisation" :options="asyncOrganisations" valueKey="_id" titleKey="name" />
</template>

<script setup lang="ts">
import { ref, inject, reactive, computed, watch, onMounted } from "vue";

import axios, { AxiosInstance } from "axios"
// @ts-ignore
import ComboSelect from "./ComboSelect.vue";
import { Webhook, PaginatedData } from "../@types/types";

interface Props {
  modelValue?: string | null
}

interface DataState {
  loading: boolean,
  q: string,
  data: PaginatedData<Webhook>
}
const state: DataState = reactive<DataState>({
  loading: false,
  q: '',
  data: {
    docs: [],
    totalDocs: 0,
    limit: 30,
    page: 1,
    totalPages: 1,
  },
})

const props = defineProps<Props>()

const request: AxiosInstance | undefined = inject('$axios');
const emitter = defineEmits(['update:modelValue']);

const value = ref();

const asyncOrganisations =async (q:string) => {
    try {
    const { data } = await request!.get<PaginatedData<Webhook>>('/dashboard/webhook', {
      params:{
        q
      }
    });
    return [
      {_id: null, name: "None"},
      ...data.docs.map(item=>({...item, name: `${item.name} (${item.url.slice(0,10)})`}))
    ];
  } catch (error: any) {
    return []
  } finally {
    state.loading = false;
  }
}

watch(value, (val)=> emitter('update:modelValue',val),);

onMounted(()=>{
  value.value = props.modelValue;
})
</script>