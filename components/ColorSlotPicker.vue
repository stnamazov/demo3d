<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps<{
  color: string
  palette: readonly string[]
  label?: string
}>()

const emit = defineEmits<{
  'update:color': [hex: string]
}>()

const expanded = ref(false)
const rootRef = ref<HTMLElement>()

function selectColor(hex: string) {
  emit('update:color', hex)
  expanded.value = false
}

function toggleExpanded() {
  expanded.value = !expanded.value
}

function onDocumentPointerDown(event: PointerEvent) {
  if (!expanded.value)
    return
  const target = event.target as Node | null
  if (target && rootRef.value?.contains(target))
    return
  expanded.value = false
}

onMounted(() => {
  document.addEventListener('pointerdown', onDocumentPointerDown)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocumentPointerDown)
})
</script>

<template>
  <div
    ref="rootRef"
    class="control-slot relative inline-flex items-center justify-center"
  >
    <Transition name="palette">
      <div
        v-if="expanded"
        class="absolute bottom-full left-1/2 mb-2 flex -translate-x-1/2 flex-col-reverse items-center gap-2"
      >
        <button
          v-for="swatch in palette"
          :key="swatch"
          type="button"
          class="color-swatch"
          :class="{ 'color-swatch-active': swatch === color }"
          :style="{ backgroundColor: swatch }"
          :aria-label="`Color ${swatch}`"
          @click="selectColor(swatch)"
        />
      </div>
    </Transition>

    <button
      type="button"
      class="color-swatch"
      :class="{ 'color-swatch-active': expanded }"
      :style="{ backgroundColor: color }"
      :title="label"
      :aria-label="label ? `Color: ${label}` : 'Choose color'"
      @click="toggleExpanded"
    />
  </div>
</template>

<style scoped>
.color-swatch {
  @apply box-border size-12 shrink-0 cursor-pointer appearance-none rounded-full border border-slate-300 p-0 shadow-none transition-[transform,border-color] duration-150;
}

.color-swatch:hover {
  @apply -translate-y-px;
}

.color-swatch-active {
  @apply border-sky-400;
}

.palette-enter-active,
.palette-leave-active {
  @apply transition-[opacity,transform] duration-150 ease-out;
}

.palette-enter-from,
.palette-leave-to {
  @apply opacity-0;
  transform: translate(-50%, 0.35rem);
}
</style>
