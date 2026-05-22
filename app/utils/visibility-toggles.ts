import type { Object3D } from 'three'
import { VISIBLE_TOGGLE_PROP } from '../constants/visibility-slots'

export interface VisibilityToggleOption {
  name: string
  object: Object3D
}

export function getVisibleToggleKey(userData?: Record<string, unknown>): string | null {
  if (!userData || !Object.prototype.hasOwnProperty.call(userData, VISIBLE_TOGGLE_PROP))
    return null

  const value = userData[VISIBLE_TOGGLE_PROP]
  if (value === undefined || value === null)
    return null

  return String(value)
}

export function collectVisibleToggleGroups(root: Object3D): Map<string, VisibilityToggleOption[]> {
  const groups = new Map<string, VisibilityToggleOption[]>()

  root.traverse((node) => {
    const key = getVisibleToggleKey(node.userData as Record<string, unknown>)
    if (key === null)
      return

    const list = groups.get(key) ?? []
    list.push({
      name: node.name || '(unnamed)',
      object: node,
    })
    groups.set(key, list)
  })

  for (const [key, options] of groups)
    groups.set(key, options.sort((a, b) => a.name.localeCompare(b.name)))

  return groups
}

export function applyVisibleToggleGroup(
  options: VisibilityToggleOption[],
  activeName: string,
): void {
  for (const option of options)
    option.object.visible = option.name === activeName
}
