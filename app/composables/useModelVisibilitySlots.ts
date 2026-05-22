import type { Object3D } from 'three'
import { computed, ref } from 'vue'
import { visibleToggleLabel } from '../constants/visibility-slots'
import {
  applyVisibleToggleGroup,
  collectVisibleToggleGroups,
  type VisibilityToggleOption,
} from '../utils/visibility-toggles'

export interface ModelVisibilitySlot {
  key: string
  label: string
  options: VisibilityToggleOption[]
  active: string
}

const slotsState = ref<ModelVisibilitySlot[]>([])
const groupOptions = ref<Map<string, VisibilityToggleOption[]>>(new Map())

function sortSlotKeys(a: string, b: string): number {
  if (a === '')
    return 1
  if (b === '')
    return -1
  return a.localeCompare(b)
}

export function useModelVisibilitySlots() {
  const slots = computed(() => slotsState.value)

  function initFromScene(scene: Object3D) {
    const groups = collectVisibleToggleGroups(scene)
    const nextSlots: ModelVisibilitySlot[] = []

    for (const [key, options] of groups) {
      if (options.length < 2)
        continue

      const active = options[0]!.name
      applyVisibleToggleGroup(options, active)
      nextSlots.push({
        key,
        label: visibleToggleLabel(key),
        options,
        active,
      })
    }

    nextSlots.sort((a, b) => sortSlotKeys(a.key, b.key))
    groupOptions.value = groups
    slotsState.value = nextSlots
  }

  function setActiveOption(groupKey: string, optionName: string) {
    const options = groupOptions.value.get(groupKey)
    if (!options?.length)
      return

    applyVisibleToggleGroup(options, optionName)
    slotsState.value = slotsState.value.map(slot =>
      slot.key === groupKey ? { ...slot, active: optionName } : slot,
    )
  }

  function reset() {
    slotsState.value = []
    groupOptions.value = new Map()
  }

  return {
    slots,
    initFromScene,
    setActiveOption,
    reset,
  }
}
