import { Box3, Vector3, type Object3D } from 'three'
import { INFO_PROP } from '../constants/info-markers'

const anchor = new Vector3()
const box = new Box3()

export interface InfoMarker {
  id: string
  object: Object3D
  text: string
  label: string
  position: [number, number, number]
}

export function getInfoText(userData?: Record<string, unknown>): string | null {
  if (!userData || !Object.prototype.hasOwnProperty.call(userData, INFO_PROP))
    return null

  const value = userData[INFO_PROP]
  if (value === undefined || value === null)
    return null

  const text = String(value).trim()
  return text.length > 0 ? text : null
}

export function isHierarchyVisible(object: Object3D): boolean {
  let current: Object3D | null = object
  while (current) {
    if (!current.visible)
      return false
    current = current.parent
  }
  return true
}

export function getMarkerAnchorPosition(object: Object3D): [number, number, number] {
  box.setFromObject(object)
  if (box.isEmpty()) {
    object.getWorldPosition(anchor)
    anchor.y += 0.15
  }
  else {
    const height = box.max.y - box.min.y
    anchor.set(
      (box.min.x + box.max.x) / 2,
      box.max.y + Math.max(height * 0.08, 0.05),
      (box.min.z + box.max.z) / 2,
    )
  }

  return [anchor.x, anchor.y, anchor.z]
}

export function collectInfoMarkers(root: Object3D): InfoMarker[] {
  const markers: InfoMarker[] = []

  root.traverse((node) => {
    const text = getInfoText(node.userData as Record<string, unknown>)
    if (!text)
      return

    markers.push({
      id: node.uuid,
      object: node,
      text,
      label: node.name || '(unnamed)',
      position: getMarkerAnchorPosition(node),
    })
  })

  return markers
}
