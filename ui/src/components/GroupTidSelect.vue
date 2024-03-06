<template>
    <ComboSelect v-model="value" placeholder="Select GroupTid" :options="asyncGroupTids" valueKey="_id" titleKey="name" />
</template>

<script setup lang="ts">
import { ref, inject, reactive, computed, watch, onMounted } from "vue";

import axios, { AxiosInstance } from "axios"
// @ts-ignore
import ComboSelect from "./ComboSelect.vue";
import { Organisation, PaginatedData, GroupTid } from '../@types/types';

interface Props {
  modelValue?: string | null
}

interface GroupTidState {
  loading: boolean,
  q: string,
  groupTids: PaginatedData<Organisation[]>
}
const state: GroupTidState = reactive<GroupTidState>({
  loading: false,
  q: '',
  groupTids: {
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
    const { page, limit } = state.groupTids;
    const params = { page, limit, q: state.q }
    // @ts-ignore: Unreachable code error
    const { data } = await request?.get('/dashboard/group-tids', {
      params
    });
    state.groupTids = data;
  } catch (error: any) {

    if (error.isAxiosError) {

    }
  } finally {
    state.loading = false;
  }
}

const asyncGroupTids =async (q:string) => {
    try {
    // @ts-ignore: Unreachable code error
    const { data } = await request?.get<PaginatedData<GroupTid>>('/dashboard/group-tids/all', {
      params:{
        q
      }
    });
    return [{_id: null, name: "None"},...data.map((item:{_id:string , terminalId:string})=>({...item, name: item.terminalId}))];
  } catch (error: any) {
    return []
  } finally {
    state.loading = false;
  }
}

watch(value, (val)=> emitter('update:modelValue',val),);

const organisations = computed(()=>state.groupTids.docs,);

onMounted(()=>{
  value.value = props.modelValue;
})
</script>