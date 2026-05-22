<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const title = computed(() => {
  const code = props.error.statusCode ?? 500
  if (code === 404)
    return 'Модель не найдена'
  if (code >= 500)
    return 'Ошибка сервера'
  return 'Что-то пошло не так'
})

const description = computed(
  () =>
    props.error.message
    || props.error.statusMessage
    || 'Попробуйте проверить адрес или повторить позже.',
)

function clear() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center bg-white px-6 py-12">
    <p class="text-7xl font-extralight tabular-nums text-slate-200">
      {{ error.statusCode ?? 500 }}
    </p>
    <h1 class="mt-4 text-center text-xl font-medium text-slate-800">
      {{ title }}
    </h1>
    <p class="mt-3 max-w-md text-center text-sm leading-relaxed text-slate-600">
      {{ description }}
    </p>
    <button
      type="button"
      class="mt-8 rounded-full border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50"
      @click="clear"
    >
      На главную
    </button>
  </div>
</template>
