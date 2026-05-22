/** Blender custom property (glTF extras → userData) used to group color pickers. */
export const COLOR_TOGGLE_PROP = 'color_toggle'

/** Preset swatches shown when expanding a color slot control. */
export const COLOR_SLOT_PALETTE = [
  '#e6c280',
  '#c9a66b',
  '#a67c52',
  '#8b5e3c',
  '#d4b896',
  '#5c4033',
] as const

export function colorToggleLabel(key: string): string {
  return key === '' ? 'default' : key
}
