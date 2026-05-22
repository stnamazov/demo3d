import type { Object3D } from 'three'
import { computed, ref } from 'vue'
import {
  collectInfoMarkers,
  isHierarchyVisible,
  type InfoMarker,
} from '../utils/info-markers'

const markersState = ref<InfoMarker[]>([])
const activeIdState = ref<string | null>(null)
const visibilityTick = ref(0)

export function useModelInfoMarkers() {
  const markers = computed(() => markersState.value)

  const visibleMarkers = computed(() => {
    visibilityTick.value
    return markersState.value.filter(marker => isHierarchyVisible(marker.object))
  })

  const activeMarker = computed(() => {
    if (!activeIdState.value)
      return null
    return visibleMarkers.value.find(marker => marker.id === activeIdState.value) ?? null
  })

  function initFromScene(scene: Object3D) {
    markersState.value = collectInfoMarkers(scene)
    activeIdState.value = null
    visibilityTick.value++
  }

  function refreshVisibility() {
    visibilityTick.value++
    if (!activeIdState.value)
      return

    const marker = markersState.value.find(m => m.id === activeIdState.value)
    if (!marker || !isHierarchyVisible(marker.object))
      activeIdState.value = null
  }

  function open(id: string) {
    activeIdState.value = id
  }

  function close() {
    activeIdState.value = null
  }

  function toggle(id: string) {
    activeIdState.value = activeIdState.value === id ? null : id
  }

  function reset() {
    markersState.value = []
    activeIdState.value = null
  }

  return {
    markers,
    visibleMarkers,
    activeMarker,
    activeId: activeIdState,
    initFromScene,
    refreshVisibility,
    open,
    close,
    toggle,
    reset,
  }
}
