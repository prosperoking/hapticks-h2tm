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
}
const state: OrganisationState = reactive<OrganisationState>({
  loading: false,
  q: '',
})

const props = defineProps<Props>()

const request: AxiosInstance | undefined = inject('$axios');
const emitter = defineEmits(['update:modelValue']);

const value = ref();

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

onMounted(()=>{
  value.value = props.modelValue;
})
</script>