<template>
  <div class="flex items-center justify-center h-screen px-6 bg-gray-200">
    <div class="w-full max-w-sm p-6 bg-white rounded-md shadow-md">
      <div class="flex items-center justify-center">
          <div class="flex items-center justify-center w-8 h-8 bg-white rounded">
            <!-- <svg class="w-8 h-8" viewBox="0 0 114 79" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M35 5V61" stroke="black" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M71 5V61" stroke="black" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M19 36.1841L31.2222 49L81 11" stroke="black" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
            </svg> -->

            <svg version="1.2" class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" >
              <path fill="#db353a" d="m36.5 11.8c-2.8 1-6.6 2.7-8.5 3.9-1.9 1.1-5.4 4.2-7.8 6.7-2.3 2.5-4.9 6.1-5.9 7.8-0.9 1.8-2.2 5.5-2.9 8.3-0.8 2.7-1.4 7-1.4 9.5 0 2.5 0.6 6.7 1.3 9.5 0.8 2.7 2 6.1 2.7 7.5 0.7 1.4 2.9 4.5 4.9 6.9 2 2.4 5.6 5.8 8.1 7.4 2.5 1.7 7 3.9 10 4.9 3 1 8 1.8 11 1.8 3 0 8.2-0.9 11.5-2 3.3-1.1 8.1-3.6 10.8-5.5 2.6-1.9 6.3-5.6 8.2-8.3 1.9-2.6 4.5-7.9 5.6-11.7 1.6-5.2 2.1-8.5 1.7-13-0.3-3.3-1.5-8.5-2.6-11.5-1.2-3.1-4.2-7.8-6.9-10.9-2.6-2.9-6.6-6.4-8.8-7.7-2.2-1.3-6.2-3-9-3.9-2.7-0.8-7.7-1.5-11-1.4-3.3 0-8.2 0.8-11 1.7z"/>
              <path fill="#fff" d="m56.3 22.9c-1.2 0.5-3.1 2.2-4.3 3.8-1.3 1.8-2 4.3-2 6.8 0 2.2 0.8 4.9 1.8 6.1 0.9 1.2 2.7 2.7 4 3.3 1.2 0.6 3.6 1.1 5.3 1.1 2.2 0 4.1-1 6.5-3.5 2.7-2.8 3.4-4.3 3.4-7.5 0-3-0.7-4.8-2.7-7-1.8-2-4.1-3.2-6.3-3.5-1.9-0.3-4.5-0.1-5.7 0.4z"/>
            </svg>
          </div>
          <span title="Hapticks Terminal Manager and Transaction Monitor" class="mx-2 text-red-600 text-2xl font-semibold"
            >A2TM</span
          >
      </div>

      <form class="mt-4" @submit.prevent="login">
        <label class="block">
          <span class="text-sm text-gray-700">Email</span>
          <input
            placeholder="username/email"
            type="text"
            class="block w-full mt-1 border-gray-200 rounded-md focus:border-red-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
            v-model="username"
          />
        </label>

        <label class="block mt-3">
          <span class="text-sm text-gray-700">Password</span>
          <input
            type="password"
            placeholder="Enter Password"
            class="block w-full mt-1 border-gray-200 rounded-md focus:border-red-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
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
              <input v-model="rememberMe" type="checkbox" class="text-red-600 border-gray-200 rounded-md focus:border-red-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500" />
              <span class="mx-2 text-sm text-gray-600">Remember me</span>
            </label>
          </div>

          <div>
            <a
              class="block text-sm text-red-700 fontme hover:underline"
              href="#"
              >Forgot your password?</a
            >
          </div>
        </div>

        <div class="mt-6">
          <button
            :disabled="loading"
            type="submit"
            class="w-full px-4 py-2 text-sm text-center text-white bg-red-600 rounded-md disabled:pointer-events-none disabled:opacity-50 focus:outline-none hover:bg-red-500"
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
