<script setup lang="ts">
import { Html } from '@tresjs/cientos'
import { useLoop } from '@tresjs/core'
import { useModelInfoMarkers } from '../app/composables/useModelInfoMarkers'

const {
  visibleMarkers,
  activeId,
  toggle,
  close,
  refreshVisibility,
} = useModelInfoMarkers()

const { onBeforeRender } = useLoop()
onBeforeRender(refreshVisibility)
</script>

<template>
  <TresGroup
    v-for="marker in visibleMarkers"
    :key="marker.id"
    :position="marker.position"
  >
    <Html
      center
      :distance-factor="8"
      sprite
      wrapper-class="info-marker-html"
    >
      <div
        class="info-marker-root"
        @pointerdown.stop
      >
        <div
          v-if="activeId === marker.id"
          class="info-panel"
        >
          <button
            type="button"
            class="info-panel-close"
            aria-label="Close"
            @click="close"
          >
            ×
          </button>
          <p class="info-panel-text">
            {{ marker.text }}
          </p>
        </div>

        <button
          v-else
          type="button"
          class="info-marker-btn"
          :title="marker.label"
          :aria-label="`Info: ${marker.label}`"
          @click.stop="toggle(marker.id)"
        >
          i
        </button>
      </div>
    </Html>
  </TresGroup>
</template>

<style>
.info-marker-html > div {
  pointer-events: none !important;
}

.info-marker-html > div > * {
  pointer-events: auto;
}
</style>

<style scoped>
.info-marker-root {
  @apply flex flex-col-reverse items-center gap-1.5;
}

.info-marker-btn {
  @apply box-border flex size-8 cursor-pointer items-center justify-center rounded-full border border-slate-300 bg-white p-0 text-sm font-semibold leading-none text-slate-600 shadow-none transition-[transform,border-color,color] duration-150;
}

.info-marker-btn:hover {
  @apply border-slate-400 text-slate-800;
}

.info-panel {
  @apply relative w-[13rem] rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-left shadow-none;
}

.info-panel-close {
  @apply absolute -right-1.5 -top-1.5 flex size-5 cursor-pointer items-center justify-center rounded-full border border-slate-300 bg-white p-0 text-sm leading-none text-slate-500 transition-colors hover:border-slate-400 hover:text-slate-800;
}

.info-panel-text {
  @apply m-0 pr-2 text-sm leading-snug text-slate-700;
}
</style>
