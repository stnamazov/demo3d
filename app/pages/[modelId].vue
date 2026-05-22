<script setup lang="ts">
import { watch } from 'vue'
import ModelViewer from '../../components/ModelViewer.vue'
import { useAppLoader } from '../composables/useAppLoader'
import { buildModelUrl, checkModelAvailable, isValidModelId } from '../utils/model-url'

const route = useRoute()
const config = useRuntimeConfig()
const { start: startLoader } = useAppLoader()

if (import.meta.client)
  startLoader()

const modelId = computed(() => {
  const raw = route.params.modelId
  return (Array.isArray(raw) ? raw[0] : raw) ?? ''
})

if (!isValidModelId(modelId.value)) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Model not found',
    message: 'Неверный идентификатор модели',
  })
}

const modelUrl = computed(() =>
  buildModelUrl(config.public.modelBaseUrl, modelId.value),
)

const { data: isAvailable } = await useAsyncData(
  `model-check-${modelId.value}`,
  () => checkModelAvailable(modelUrl.value),
)

if (!isAvailable.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Model not found',
    message: `Модель «${modelId.value}» не найдена`,
  })
}

useHead({
  title: modelId.value,
})

watch(modelId, () => {
  if (import.meta.client)
    startLoader()
})
</script>

<template>
  <ClientOnly>
    <ModelViewer :model-url="modelUrl" />
  </ClientOnly>
</template>
