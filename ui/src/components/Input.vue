<template>
  <div class="flex items-baseline mb-2 space-x-2">
    <label v-if="title?.length" class="w-1/5 text-sm font-bold text-gray-700" for="emailAddress">{{ title }}:</label>
    <input
      v-if="!['checkbox','radio'].includes(type)"
      class="w-4/5 p-1 mt-2 border border-gray-200 rounded-md focus:outline-none focus:border-none focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
      :type="type" :value="value" @input="updateValue" />
    <input
      v-if="['checkbox','radio'].includes(type)"
      :checked="value"
      class="p-1 mt-2 border border-gray-200 rounded-md focus:outline-none focus:border-none focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
      :type="type" :value="value" @input="updateValue" />  
    <p v-if="desciption" v-text="desciption"></p>
  </div>
</template>

<script lang="ts" setup>
import { useAttrs, defineProps, defineEmits } from 'vue'
interface Props {
  title?: string,
  value: any,
  type?: string,
  desciption?: string,
}

const { title, value, type = 'text', desciption=null } = defineProps<Props>()

const emit = defineEmits(['update:value'])

const updateValue = (event: any) => {
  emit('update:value', event.target.value)
}
</script>