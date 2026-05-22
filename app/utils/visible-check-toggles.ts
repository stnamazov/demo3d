import type { Object3D } from 'three'
import { VISIBLE_CHECK_PROP } from '../constants/visible-check-slots'

export interface VisibleCheckOption {
  name: string
  object: Object3D
}

export function getVisibleCheckKey(userData?: Record<string, unknown>): string | null {
  if (!userData || !Object.prototype.hasOwnProperty.call(userData, VISIBLE_CHECK_PROP))
    return null

  const value = userData[VISIBLE_CHECK_PROP]
  if (value === undefined || value === null)
    return null

  return String(value)
}

export function collectVisibleCheckGroups(root: Object3D): Map<string, VisibleCheckOption[]> {
  const groups = new Map<string, VisibleCheckOption[]>()

  root.traverse((node) => {
    const key = getVisibleCheckKey(node.userData as Record<string, unknown>)
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

export function hideVisibleCheckGroup(options: readonly VisibleCheckOption[]): void {
  for (const option of options)
    option.object.visible = false
}

export function setVisibleCheckOption(
  option: VisibleCheckOption,
  visible: boolean,
): void {
  option.object.visible = visible
}
