/** Blender custom property (glTF extras → userData) for mutually exclusive visibility groups. */
export const VISIBLE_TOGGLE_PROP = 'visible_toggle'

export function visibleToggleLabel(key: string): string {
  return key === '' ? 'default' : key
}
