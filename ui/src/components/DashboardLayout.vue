<template>
  <div class="flex h-screen bg-gray-200 font-roboto">
    <Sidebar />

    <div class="flex flex-col flex-1 overflow-hidden">
      <Header />

      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
        <div class="container px-6 py-8 mx-auto">
          <slot />
        </div>
      </main>
    </div>
  </div>
  <notifications position="top right" />
</template>

<script setup lang="ts">
// @ts-ignore
import Sidebar from "./Sidebar.vue";
// @ts-ignore
import Header from "./Header.vue";
</script>
