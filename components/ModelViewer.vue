<script setup lang="ts">
import { OrbitControls } from '@tresjs/cientos'
import { TresCanvas } from '@tresjs/core'
import { onBeforeUnmount, onMounted } from 'vue'
import {
  ORBIT_MAX_DISTANCE,
  ORBIT_MIN_DISTANCE,
  ORBIT_POLAR_ANGLE,
  ORBIT_TARGET,
} from '../app/constants/camera'
import { useModelInfoMarkers } from '../app/composables/useModelInfoMarkers'
import ModelControls from './ModelControls.vue'
import Scene from './Scene.vue'

const props = defineProps<{
  modelUrl: string
}>()

const { close: closeInfoPanel } = useModelInfoMarkers()

function onDocumentPointerDown(event: PointerEvent) {
  const target = event.target as HTMLElement | null
  if (target?.closest('.info-marker-root'))
    return
  closeInfoPanel()
}

onMounted(() => {
  document.addEventListener('pointerdown', onDocumentPointerDown)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocumentPointerDown)
})
</script>

<template>
  <div class="relative h-screen w-screen overflow-hidden bg-white">
    <p
      class="demo-watermark"
      aria-hidden="true"
    >
      ДЕМО
    </p>

    <TresCanvas
      class="demo-canvas"
      alpha
      clear-color="#ffffff"
      :clear-alpha="0"
      window-size
      @pointer-missed="closeInfoPanel"
    >
      <Scene :model-url="modelUrl" />
      <OrbitControls
        :target="ORBIT_TARGET"
        :min-polar-angle="ORBIT_POLAR_ANGLE"
        :max-polar-angle="ORBIT_POLAR_ANGLE"
        :min-distance="ORBIT_MIN_DISTANCE"
        :max-distance="ORBIT_MAX_DISTANCE"
        :enable-pan="false"
      />
    </TresCanvas>

    <div class="pointer-events-none absolute bottom-6 left-1/2 z-10 flex w-full max-w-full -translate-x-1/2 justify-center px-4">
      <ModelControls />
    </div>
  </div>
</template>

<style scoped>
.demo-watermark {
  position: absolute;
  inset: 0;
  z-index: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  width: 100%;
  padding: 0 0.04em;
  font-weight: 700;
  line-height: 0.9;
  letter-spacing: 0.02em;
  color: #e8edf3;
  text-align: center;
  white-space: nowrap;
  pointer-events: none;
  user-select: none;
  transform: none;
}

/* ширина > высоты — горизонтально на всю ширину */
@media (orientation: landscape) {
  .demo-watermark {
    font-size: 38vw;
    transform: none;
  }
}

/* высота ≥ ширины — поворот 90°, на всю высоту */
@media (orientation: portrait) {
  .demo-watermark {
    font-size: 38vh;
    transform: rotate(-90deg);
  }
}

.demo-canvas {
  position: relative;
  z-index: 1;
}
</style>
