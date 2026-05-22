import type { Object3D } from 'three'
import { computed, ref } from 'vue'
import { COLOR_SLOT_PALETTE, colorToggleLabel } from '../constants/color-slots'
import {
  applyColorToMeshes,
  collectColorableMeshes,
  ensureUniqueMaterials,
  readMeshColorHex,
} from '../utils/colorable-meshes'

export interface ModelColorSlot {
  /** color_toggle value from Blender */
  key: string
  label: string
  color: string
  palette: readonly string[]
}

const slotsState = ref<ModelColorSlot[]>([])
const meshGroups = ref<Map<string, import('three').Mesh[]>>(new Map())

function sortSlotKeys(a: string, b: string): number {
  if (a === '')
    return 1
  if (b === '')
    return -1
  return a.localeCompare(b)
}

export function useModelColorSlots() {
  const slots = computed(() => slotsState.value)

  function initFromScene(scene: Object3D) {
    const groups = collectColorableMeshes(scene)
    const nextSlots: ModelColorSlot[] = []

    for (const [key, meshes] of groups) {
      if (!meshes.length)
        continue

      for (const mesh of meshes)
        ensureUniqueMaterials(mesh)

      const color = readMeshColorHex(meshes[0]!)
      nextSlots.push({
        key,
        label: colorToggleLabel(key),
        color,
        palette: COLOR_SLOT_PALETTE,
      })
    }

    nextSlots.sort((a, b) => sortSlotKeys(a.key, b.key))
    meshGroups.value = groups
    slotsState.value = nextSlots
  }

  function setSlotColor(key: string, hex: string) {
    const meshes = meshGroups.value.get(key)
    if (!meshes?.length)
      return

    applyColorToMeshes(meshes, hex)
    slotsState.value = slotsState.value.map(slot =>
      slot.key === key ? { ...slot, color: hex } : slot,
    )
  }

  function reset() {
    slotsState.value = []
    meshGroups.value = new Map()
  }

  return {
    slots,
    initFromScene,
    setSlotColor,
    reset,
  }
}
