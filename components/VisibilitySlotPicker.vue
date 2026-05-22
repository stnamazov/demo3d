<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps<{
  options: readonly { name: string }[]
  active: string
  groupLabel?: string
}>()

const emit = defineEmits<{
  'update:active': [name: string]
}>()

const expanded = ref(false)
const rootRef = ref<HTMLElement>()

function selectOption(name: string) {
  emit('update:active', name)
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
          v-for="option in options"
          :key="option.name"
          type="button"
          class="visibility-option"
          :class="{ 'visibility-option-active': option.name === active }"
          :aria-label="option.name"
          @click="selectOption(option.name)"
        >
          {{ option.name }}
        </button>
      </div>
    </Transition>

    <button
      type="button"
      class="visibility-option"
      :class="{ 'visibility-option-active': expanded }"
      :title="groupLabel"
      :aria-label="groupLabel ? `Visibility: ${groupLabel}` : 'Choose visible object'"
      @click="toggleExpanded"
    >
      {{ active }}
    </button>
  </div>
</template>

<style scoped>
.visibility-option {
  @apply box-border flex size-12 shrink-0 cursor-pointer appearance-none items-center justify-center rounded-full border border-slate-300 bg-slate-800/95 px-1 text-center text-[0.6875rem] font-medium leading-none text-slate-50 shadow-none transition-[transform,border-color] duration-150;
}

.visibility-option:hover {
  @apply -translate-y-px;
}

.visibility-option-active {
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
