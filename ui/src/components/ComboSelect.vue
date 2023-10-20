<template>
  <div>
    <Combobox v-model="selected" :class="{'pointer-events-none': data?.length < 1 || busy }" class="">
      <div class="mt-1 relative">
        <div
          class="relative w-full overflow-hidden text-left bg-white border border-gray-400 rounded cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-300 sm:text-sm"
        >
          <ComboboxInput
            class="w-full py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 border-none focus:ring-0"
            :displayValue="getDisplay"
            :placeholder="placeholder"
            @change="query = $event.target.value"
          />
          <ComboboxButton
            class="absolute inset-y-0 right-0 flex items-center pr-2"
          >
            <ChevronDownIcon v-if="!busy" class="w-5 h-5 text-gray-400" aria-hidden="true" />
          </ComboboxButton>
        </div>

        <TransitionRoot
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          @after-leave="query = ''"
        >

          <ComboboxOptions
            class="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          >
            <div
                v-if="busy"
                class="relative px-4 py-2 text-gray-700 cursor-default select-none"
                >
                please wait ...
            </div>
            <div
              v-if="data.length === 0 && query === ''"
              class="relative px-4 py-2 text-gray-700 cursor-default select-none"
            >
              Nothing found.
            </div>
            <div
              v-if="data.length === 0 && query !== ''"
              class="relative px-4 py-2 text-gray-700 cursor-default select-none"
            >
              Nothing found.
            </div>

            <template v-if="data.length">
            <ComboboxOption
              v-for="(item,index) in data"
              as="template"
              :key="index"
              :value="item[valueKey]"
              v-slot="{ selected, active }"
            >

              <li
                class="relative py-2 pl-10 cursor-pointer select-none pr-4s"
                :class="{
                  'text-gray-800 font-bold': active,
                  'text-gray-900': !active,
                }"
              >
                <span
                  class="block truncate"
                  :class="{ 'font-medium': selected, 'font-normal': !selected }"
                >
                  {{ item[titleKey] }}
                </span>
                <span
                  v-if="selected"
                  class="absolute inset-y-0 left-0 flex items-center pl-3"
                  :class="{ 'text-white': active, 'text-blue-600': !active }"
                >
                  <CheckIcon class="w-5 h-5" aria-hidden="true" />
                </span>
              </li>
            </ComboboxOption>
            </template>
          </ComboboxOptions>
        </TransitionRoot>
      </div>
    </Combobox>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  TransitionRoot,
} from '@headlessui/vue'
import { CheckIcon, ChevronDownIcon } from '@heroicons/vue/20/solid'
import { debounce } from 'lodash';

type Option = {
    [key:string]: any
}

interface Props {
    options: Array<Option> | ((q:string)=>Promise<Array<Option>>),
    valueKey: string,
    titleKey: string,
    modelValue?: any,
    placeholder?: string
}

const props = withDefaults(defineProps<Props>(),{
    //@ts-ignore
    options: [],
    valueKey: 'value',
    titleKey: 'title',
    modelValue: undefined
});

let selected = ref(props.modelValue)
let query = ref('')
let asyncOptions = ref<Array<Option>>([]);
let busy = ref(false);

const emit = defineEmits(['update:modelValue'])

const fetchAsyncData = async (filter?: string)=>{
    if (typeof props.options !== 'function') return props.options;

    try {
        busy.value = true;
        let data = await props.options(filter || '');
        asyncOptions.value = [...data] || [];
    } catch (error) {
        console.log(error)
        return []
    }finally{
        busy.value = false;
    }
}

watch(query, debounce((value)=>{
    if(typeof props.options === 'function') {
        fetchAsyncData(value);
    }
}, 600))

watch(selected, (val)=> emit('update:modelValue',val),);

let data = computed<Option[]>(() =>{
    if(typeof props.options === 'function') {
        return asyncOptions.value;
    }

    const dataToUse = typeof props.options === 'function' ? asyncOptions : props.options;
    return query.value === '' || typeof props.options === 'function'
    ? dataToUse
    // @ts-ignore
    : dataToUse.filter((item: Array<Option>) =>
       // @ts-ignore
        item[titleKey]
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(query.value.toLowerCase().replace(/\s+/g, ''))
      )
})

const getDisplay = (value: any)=> {
 if(data.value instanceof Array === false || !value === undefined || value?.length < 1) return

 return (data.value || []).find(item=>item[props.valueKey] === value)?.[props.titleKey]
}

onMounted(()=>{
  fetchAsyncData();
  // selected.value = props.modelValue;
})
</script>
