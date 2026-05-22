<script setup lang="ts">
import AppLoader from '../components/AppLoader.vue'
</script>

<template>
  <ClientOnly>
    <AppLoader />
  </ClientOnly>
  <NuxtPage />
</template>
