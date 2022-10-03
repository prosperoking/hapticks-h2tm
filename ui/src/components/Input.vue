<template>
  <div class="flex items-baseline mb-2 space-x-2">
    <label v-if="title?.length" class="w-1/5 text-sm font-bold text-gray-700" for="emailAddress">{{ title }}:</label>
    <input
      v-if="!['checkbox','radio'].includes(type)"
      class="w-4/5 p-1 mt-2 border border-gray-200 rounded-md focus:outline-none focus:border-none focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
      :type="type" :value="value" @input="updateValue" :placeholder="placeholder" />

    <template v-else>
      <input
      v-if="isCheckable"
      :checked="value"
      class="p-1 mt-2 border border-gray-200 rounded-md focus:outline-none focus:border-none focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
      :type="type" @input="updateValue" />  
    <input
    v-else
    :value="value"
    class="p-1 mt-2 border border-gray-200 rounded-md focus:outline-none focus:border-none focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
    :type="type" @input="updateValue" />
    </template>  
    <p v-if="desciption" v-text="desciption"></p>
  </div>
</template>

<script lang="ts" setup>
import { useAttrs, defineProps, defineEmits, computed } from 'vue'
interface Props {
  title?: string,
  value: any,
  type?: string,
  desciption?: string,
  placeholder?: string,
}

const props = withDefaults( defineProps<Props>(),{
  type: 'text',
})

const emit = defineEmits(['update:value'])

const updateValue = (event: any) => {
  emit('update:value', isCheckable.value? event.target.checked : event.target.value)
}

const isCheckable = computed(()=>{
  return ['checkbox','radio'].includes(props.type) && typeof props.value === 'boolean';
})
</script>