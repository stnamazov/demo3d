<script setup lang="ts">
import { computed } from 'vue'
import ColorSlotPicker from './ColorSlotPicker.vue'
import SizeSlotPicker from './SizeSlotPicker.vue'
import VisibilitySlotPicker from './VisibilitySlotPicker.vue'
import VisibleCheckSlotPicker from './VisibleCheckSlotPicker.vue'
import { useModelColorSlots } from '../app/composables/useModelColorSlots'
import { useModelSizeSlots } from '../app/composables/useModelSizeSlots'
import { useModelVisibleCheckSlots } from '../app/composables/useModelVisibleCheckSlots'
import { useModelVisibilitySlots } from '../app/composables/useModelVisibilitySlots'

const { slots: colorSlots, setSlotColor } = useModelColorSlots()
const { slots: visibilitySlots, setActiveOption } = useModelVisibilitySlots()
const { slots: visibleCheckSlots, toggleOption: toggleVisibleCheck } = useModelVisibleCheckSlots()
const { slots: sizeSlots, setSlotFactors } = useModelSizeSlots()

const hasControls = computed(
  () =>
    colorSlots.value.length > 0
    || visibilitySlots.value.length > 0
    || visibleCheckSlots.value.length > 0
    || sizeSlots.value.length > 0,
)
</script>

<template>
  <div
    v-if="hasControls"
    class="controls-bar pointer-events-auto flex flex-row flex-wrap items-center justify-center gap-3 rounded-full border border-slate-300 bg-white px-4 py-2.5"
  >
    <ColorSlotPicker
      v-for="slot in colorSlots"
      :key="`color-${slot.key}`"
      :label="slot.label"
      :color="slot.color"
      :palette="slot.palette"
      @update:color="setSlotColor(slot.key, $event)"
    />
    <VisibilitySlotPicker
      v-for="slot in visibilitySlots"
      :key="`visible-${slot.key}`"
      :group-label="slot.label"
      :options="slot.options"
      :active="slot.active"
      @update:active="setActiveOption(slot.key, $event)"
    />
    <VisibleCheckSlotPicker
      v-for="slot in visibleCheckSlots"
      :key="`visible-check-${slot.key}`"
      :group-label="slot.label"
      :options="slot.options"
      :visible="slot.visible"
      @toggle="toggleVisibleCheck(slot.key, $event)"
    />
    <SizeSlotPicker
      v-for="slot in sizeSlots"
      :key="`size-${slot.key}`"
      :label="slot.label"
      :width="slot.width"
      :height="slot.height"
      :length="slot.length"
      @update:width="setSlotFactors(slot.key, { width: $event })"
      @update:height="setSlotFactors(slot.key, { height: $event })"
      @update:length="setSlotFactors(slot.key, { length: $event })"
    />
  </div>
</template>
