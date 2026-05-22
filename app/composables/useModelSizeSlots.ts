import type { Object3D } from 'three'
import { computed, ref } from 'vue'
import { sizeToggleLabel } from '../constants/size-slots'
import {
  applySizeFactors,
  collectSizeToggleGroups,
  DEFAULT_SIZE_FACTORS,
  type SizeFactors,
  type SizeToggleTarget,
} from '../utils/size-toggles'

export interface ModelSizeSlot {
  key: string
  label: string
  width: number
  height: number
  length: number
}

const slotsState = ref<ModelSizeSlot[]>([])
const groupTargets = ref<Map<string, SizeToggleTarget[]>>(new Map())

function sortSlotKeys(a: string, b: string): number {
  if (a === '')
    return 1
  if (b === '')
    return -1
  return a.localeCompare(b)
}

export function useModelSizeSlots() {
  const slots = computed(() => slotsState.value)

  function initFromScene(scene: Object3D) {
    const groups = collectSizeToggleGroups(scene)
    const nextSlots: ModelSizeSlot[] = []

    for (const [key, targets] of groups) {
      if (!targets.length)
        continue

      applySizeFactors(targets, DEFAULT_SIZE_FACTORS)
      nextSlots.push({
        key,
        label: sizeToggleLabel(key),
        width: DEFAULT_SIZE_FACTORS.width,
        height: DEFAULT_SIZE_FACTORS.height,
        length: DEFAULT_SIZE_FACTORS.length,
      })
    }

    nextSlots.sort((a, b) => sortSlotKeys(a.key, b.key))
    groupTargets.value = groups
    slotsState.value = nextSlots
  }

  function setSlotFactors(groupKey: string, partial: Partial<SizeFactors>) {
    const targets = groupTargets.value.get(groupKey)
    if (!targets?.length)
      return

    slotsState.value = slotsState.value.map((slot) => {
      if (slot.key !== groupKey)
        return slot

      const factors: SizeFactors = {
        width: partial.width ?? slot.width,
        height: partial.height ?? slot.height,
        length: partial.length ?? slot.length,
      }
      applySizeFactors(targets, factors)

      return {
        ...slot,
        width: factors.width,
        height: factors.height,
        length: factors.length,
      }
    })
  }

  function reset() {
    slotsState.value = []
    groupTargets.value = new Map()
  }

  return {
    slots,
    initFromScene,
    setSlotFactors,
    reset,
  }
}
