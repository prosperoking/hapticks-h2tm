<template>
    <ComboSelect v-model="value" placeholder="Select Organisation" :options="asyncOrganisations" valueKey="_id" titleKey="name" />
</template>

<script setup lang="ts">
import { ref, inject, reactive, computed, watch, onMounted } from "vue";

import axios, { AxiosInstance } from "axios"
// @ts-ignore
import ComboSelect from "./ComboSelect.vue";
import { Organisation, PaginatedData } from "../@types/types";

interface Props {
  modelValue?: string | null
}

interface OrganisationState {
  loading: boolean,
  q: string,
  organisations: PaginatedData<Organisation[]>
}
const state: OrganisationState = reactive<OrganisationState>({
  loading: false,
  q: '',
  organisations: {
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

const getOrganisations = async () => {
  try {
    state.loading = true;
    const { page, limit } = state.organisations;
    const params = { page, limit, q: state.q }
    // @ts-ignore: Unreachable code error
    const { data } = await request?.get('/dashboard/organisations', {
      params
    });
    state.organisations = data;
  } catch (error: any) {

    if (error.isAxiosError) {

    }
  } finally {
    state.loading = false;
  }
}  

const asyncOrganisations =async (q:string) => {
    try {
    // @ts-ignore: Unreachable code error
    const { data } = await request?.get<PaginatedData<Organisation>>('/dashboard/organisations', {
      params:{
        q
      }
    });
    return [{_id: null, name: "None"},...data.docs];
  } catch (error: any) {
    return []
  } finally {
    state.loading = false;
  }
}

watch(value, (val)=> emitter('update:modelValue',val),);

const organisations = computed(()=>state.organisations.docs,);

onMounted(()=>{
  value.value = props.modelValue;
})
</script>