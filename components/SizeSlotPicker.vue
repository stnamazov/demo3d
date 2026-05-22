<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { SIZE_SCALE_MAX, SIZE_SCALE_MIN } from '../app/constants/size-slots'

const props = defineProps<{
  label?: string
  width: number
  height: number
  length: number
}>()

const emit = defineEmits<{
  'update:width': [value: number]
  'update:height': [value: number]
  'update:length': [value: number]
}>()

const expanded = ref(false)
const rootRef = ref<HTMLElement>()

const percentMin = Math.round(SIZE_SCALE_MIN * 100)
const percentMax = Math.round(SIZE_SCALE_MAX * 100)

const widthPercent = computed({
  get: () => Math.round(props.width * 100),
  set: (percent) => emit('update:width', percent / 100),
})

const heightPercent = computed({
  get: () => Math.round(props.height * 100),
  set: (percent) => emit('update:height', percent / 100),
})

const lengthPercent = computed({
  get: () => Math.round(props.length * 100),
  set: (percent) => emit('update:length', percent / 100),
})

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
        class="absolute bottom-full left-1/2 z-20 mb-2 w-52 -translate-x-1/2 rounded-xl border border-slate-300 bg-white px-3 py-2.5 shadow-sm"
      >
        <label class="mb-2 flex items-center gap-2 text-xs text-slate-700">
          <span class="w-14 shrink-0">Длина</span>
          <input
            v-model.number="lengthPercent"
            type="range"
            class="size-slider min-w-0 flex-1"
            :min="percentMin"
            :max="percentMax"
            step="1"
          >
          <span class="w-9 shrink-0 text-right tabular-nums text-slate-500">{{ lengthPercent }}%</span>
        </label>
        <label class="mb-2 flex items-center gap-2 text-xs text-slate-700">
          <span class="w-14 shrink-0">Ширина</span>
          <input
            v-model.number="widthPercent"
            type="range"
            class="size-slider min-w-0 flex-1"
            :min="percentMin"
            :max="percentMax"
            step="1"
          >
          <span class="w-9 shrink-0 text-right tabular-nums text-slate-500">{{ widthPercent }}%</span>
        </label>
        <label class="flex items-center gap-2 text-xs text-slate-700">
          <span class="w-14 shrink-0">Высота</span>
          <input
            v-model.number="heightPercent"
            type="range"
            class="size-slider min-w-0 flex-1"
            :min="percentMin"
            :max="percentMax"
            step="1"
          >
          <span class="w-9 shrink-0 text-right tabular-nums text-slate-500">{{ heightPercent }}%</span>
        </label>
      </div>
    </Transition>

    <button
      type="button"
      class="size-toggle-btn"
      :class="{ 'size-toggle-btn-active': expanded }"
      :title="label"
      :aria-label="label ? `Size: ${label}` : 'Adjust size'"
      @click="toggleExpanded"
    >
      {{ label ?? 'size' }}
    </button>
  </div>
</template>

<style scoped>
.size-toggle-btn {
  @apply box-border flex size-12 shrink-0 cursor-pointer appearance-none items-center justify-center rounded-full border border-slate-300 bg-white px-1 text-center text-[0.6875rem] font-medium leading-none text-slate-700 shadow-none transition-[transform,border-color] duration-150;
}

.size-toggle-btn:hover {
  @apply -translate-y-px;
}

.size-toggle-btn-active {
  @apply border-sky-400;
}

.size-slider {
  @apply h-1.5 cursor-pointer accent-sky-500;
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
