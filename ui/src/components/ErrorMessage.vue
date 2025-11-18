<template>
    <div v-if="hasError" class="flex w-full overflow-hidden text-xs text-red-500">
        <p :title="errorMessage ||''">{{errorMessage}}</p>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

interface Props {
    errors: { [key: string]: string[] },
    errorKey: string;
}
const props = defineProps<Props>();

const hasError = computed(() => {
    return props.errors[props.errorKey] !== undefined;
})

const errorMessage = computed(() => {
    return hasError ? props.errors[props.errorKey]?.join('. ') : null;
})
</script>