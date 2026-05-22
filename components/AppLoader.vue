<script setup lang="ts">
import { useAppLoader } from '../app/composables/useAppLoader'

const { isLoading, message } = useAppLoader()
</script>

<template>
  <Transition name="loader-fade">
    <div
      v-if="isLoading"
      class="pointer-events-none fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
      role="status"
      aria-live="polite"
      :aria-label="message"
    >
      <div
        class="size-11 animate-spin rounded-full border-2 border-slate-200 border-t-sky-500"
        aria-hidden="true"
      />
      <p class="mt-4 text-sm text-slate-500">
        {{ message }}
      </p>
    </div>
  </Transition>
</template>

<style scoped>
.loader-fade-enter-active,
.loader-fade-leave-active {
  transition: opacity 0.2s ease;
}

.loader-fade-enter-from,
.loader-fade-leave-to {
  opacity: 0;
}
</style>
