/** Blender custom property (glTF extras → userData) for independent multi-select visibility. */
export const VISIBLE_CHECK_PROP = 'visible_check'

export function visibleCheckLabel(key: string): string {
  return key === '' ? 'default' : key
}
