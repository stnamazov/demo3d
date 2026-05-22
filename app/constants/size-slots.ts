/** Blender custom property (glTF extras → userData) for grouped axis scaling. */
export const SIZE_TOGGLE_PROP = 'size_toggle'

/** Scale multiplier limits relative to the object's scale at init (±20%). */
export const SIZE_SCALE_MIN = 0.8
export const SIZE_SCALE_MAX = 1.2
export const SIZE_SCALE_DEFAULT = 1

export function sizeToggleLabel(key: string): string {
  return key === '' ? 'default' : key
}
