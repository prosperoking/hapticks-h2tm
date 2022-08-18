<template>
  <div class="flex items-center justify-center h-screen px-6 bg-gray-200">
    <div class="w-full max-w-sm p-6 bg-white rounded-md shadow-md">
      <div class="flex items-center justify-center">
          <div class="flex items-center justify-center w-8 h-8 bg-white rounded">
            <svg class="w-8 h-8" viewBox="0 0 114 79" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M35 5V61" stroke="black" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M71 5V61" stroke="black" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M19 36.1841L31.2222 49L81 11" stroke="black" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span title="Hapticks Terminal Manager and Transaction Monitor" class="mx-2 text-2xl font-semibold"
            >H2TM</span
          >
      </div>

      <form class="mt-4" @submit.prevent="login">
        <label class="block">
          <span class="text-sm text-gray-700">Email</span>
          <input
            placeholder="username/email"
            type="text"
            class="block w-full mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
            v-model="username"
          />
        </label>

        <label class="block mt-3">
          <span class="text-sm text-gray-700">Password</span>
          <input
            type="password"
            placeholder="Enter Password"
            class="block w-full mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
            v-model="password"
          />
        </label>
        <div v-if="errorMsg !== null" class="flex items-center justify-between mt-4">
          <div class="text-red-400">
            {{ errorMsg }}
          </div>
        </div>

        <div class="flex items-center justify-between mt-4">
          <div>
            <label class="inline-flex items-center">
              <input v-model="rememberMe" type="checkbox" class="text-indigo-600 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500" />
              <span class="mx-2 text-sm text-gray-600">Remember me</span>
            </label>
          </div>

          <div>
            <a
              class="block text-sm text-indigo-700 fontme hover:underline"
              href="#"
              >Forgot your password?</a
            >
          </div>
        </div>

        <div class="mt-6">
          <button
            :disabled="loading"
            type="submit"
            class="w-full px-4 py-2 text-sm text-center text-white bg-indigo-600 rounded-md disabled:pointer-events-none disabled:opacity-50 focus:outline-none hover:bg-indigo-500"
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AxiosError, AxiosInstance } from "axios";
import { inject, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const username = ref("");
const rememberMe = ref(false);
const password = ref("");
const errorMsg = ref<String | null>(null);
const loading = ref(false);
const request: AxiosInstance| undefined = inject('$axios');
async function login() {
  loading.value = true;
  errorMsg.value = null;
  try {
    await request?.post('/login',{
      username: username.value,
      rememberMe: rememberMe.value,
      password: password.value,
    });
    router.push("/dashboard");
  } catch (error: any) {
    console.log(error.response.status)
    if(error.isAxiosError) {
      errorMsg.value = error.response.status == 401? "Incorrect email or password" :error.response?.data.message;
      return;
    }
    
    errorMsg.value = error.message;
  } finally {
    loading.value = false;
  }
}
</script>
