import type { Object3D } from 'three'
import { computed, ref } from 'vue'
import { visibleCheckLabel } from '../constants/visible-check-slots'
import {
  collectVisibleCheckGroups,
  hideVisibleCheckGroup,
  setVisibleCheckOption,
  type VisibleCheckOption,
} from '../utils/visible-check-toggles'

export interface ModelVisibleCheckSlot {
  key: string
  label: string
  options: { name: string }[]
  /** Names of options currently visible (empty = all hidden). */
  visible: string[]
}

const slotsState = ref<ModelVisibleCheckSlot[]>([])
const groupOptions = ref<Map<string, VisibleCheckOption[]>>(new Map())

function sortSlotKeys(a: string, b: string): number {
  if (a === '')
    return 1
  if (b === '')
    return -1
  return a.localeCompare(b)
}

export function useModelVisibleCheckSlots() {
  const slots = computed(() => slotsState.value)

  function initFromScene(scene: Object3D) {
    const groups = collectVisibleCheckGroups(scene)
    const nextSlots: ModelVisibleCheckSlot[] = []

    for (const [key, options] of groups) {
      if (!options.length)
        continue

      hideVisibleCheckGroup(options)
      nextSlots.push({
        key,
        label: visibleCheckLabel(key),
        options: options.map(o => ({ name: o.name })),
        visible: [],
      })
    }

    nextSlots.sort((a, b) => sortSlotKeys(a.key, b.key))
    groupOptions.value = groups
    slotsState.value = nextSlots
  }

  function toggleOption(groupKey: string, optionName: string) {
    const options = groupOptions.value.get(groupKey)
    const option = options?.find(o => o.name === optionName)
    if (!option)
      return

    const nextVisible = !option.object.visible
    setVisibleCheckOption(option, nextVisible)

    slotsState.value = slotsState.value.map((slot) => {
      if (slot.key !== groupKey)
        return slot

      const visible = new Set(slot.visible)
      if (nextVisible)
        visible.add(optionName)
      else
        visible.delete(optionName)

      return { ...slot, visible: [...visible] }
    })
  }

  function reset() {
    slotsState.value = []
    groupOptions.value = new Map()
  }

  return {
    slots,
    initFromScene,
    toggleOption,
    reset,
  }
}
