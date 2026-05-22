<script setup lang="ts">
import { useGLTF } from '@tresjs/cientos'
import type { Object3D } from 'three'
import { toRef, watch } from 'vue'
import { useAppLoader } from '../app/composables/useAppLoader'
import { useModelColorSlots } from '../app/composables/useModelColorSlots'
import { useModelInfoMarkers } from '../app/composables/useModelInfoMarkers'
import { useModelSizeSlots } from '../app/composables/useModelSizeSlots'
import { useModelVisibleCheckSlots } from '../app/composables/useModelVisibleCheckSlots'
import { useModelVisibilitySlots } from '../app/composables/useModelVisibilitySlots'
import SceneInfoMarkers from './SceneInfoMarkers.vue'
import { CAMERA_POSITION, ORBIT_TARGET } from '../app/constants/camera'
import { logGltfStructure } from '../app/utils/log-gltf-structure'
import { normalizeModelMaterials } from '../app/utils/normalize-model-materials'
import { applySketchEdges, removeSketchEdges } from '../app/utils/sketch-edges'

const props = defineProps<{
  modelUrl: string
}>()

const modelUrl = toRef(props, 'modelUrl')
const { state, isLoading } = useGLTF(modelUrl)
const { start: startLoader, finish: finishLoader } = useAppLoader()
const { initFromScene: initColorSlots, reset: resetColorSlots } = useModelColorSlots()
const { initFromScene: initVisibilitySlots, reset: resetVisibilitySlots } = useModelVisibilitySlots()
const { initFromScene: initVisibleCheckSlots, reset: resetVisibleCheckSlots } = useModelVisibleCheckSlots()
const { initFromScene: initSizeSlots, reset: resetSizeSlots } = useModelSizeSlots()
const { initFromScene: initInfoMarkers, reset: resetInfoMarkers } = useModelInfoMarkers()

let edgesScene: Object3D | null = null

watch(isLoading, (loading) => {
  if (loading) {
    startLoader()
    return
  }

  if (state.value?.scene)
    finishLoader()
}, { immediate: true })

watch(
  () => state.value?.scene,
  (scene) => {
    if (edgesScene && edgesScene !== scene)
      removeSketchEdges(edgesScene)

    edgesScene = scene ?? null

    if (scene) {
      logGltfStructure(scene, modelUrl.value)
      normalizeModelMaterials(scene)
      applySketchEdges(scene)
      initVisibilitySlots(scene)
      initVisibleCheckSlots(scene)
      initColorSlots(scene)
      initSizeSlots(scene)
      initInfoMarkers(scene)

      if (!isLoading.value)
        finishLoader()
    }
    else {
      resetColorSlots()
      resetVisibilitySlots()
      resetVisibleCheckSlots()
      resetSizeSlots()
      resetInfoMarkers()
    }
  },
  { immediate: true },
)

</script>

<template>
  <TresPerspectiveCamera
    :position="CAMERA_POSITION"
    :look-at="ORBIT_TARGET"
  />

  <TresAmbientLight :intensity="1" />
  <TresHemisphereLight :args="['#ffffff', '#444444', 1.5]" />
  <TresDirectionalLight
    :position="[5, 10, 7]"
    :intensity="1.2"
  />

  <primitive
    v-if="!isLoading && state?.scene"
    :object="state.scene"
  />

  <SceneInfoMarkers v-if="!isLoading && state?.scene" />
</template>
