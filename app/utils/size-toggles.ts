import type { Object3D } from 'three'
import { Vector3 } from 'three'
import {
  SIZE_SCALE_DEFAULT,
  SIZE_SCALE_MAX,
  SIZE_SCALE_MIN,
  SIZE_TOGGLE_PROP,
} from '../constants/size-slots'

export interface SizeToggleTarget {
  object: Object3D
  baseScale: Vector3
}

/** Axis scale multipliers (1 = initial size). */
export interface SizeFactors {
  /** Scale along X (ширина). */
  width: number
  /** Scale along Y (высота). */
  height: number
  /** Scale along Z (длина). */
  length: number
}

export const DEFAULT_SIZE_FACTORS: SizeFactors = {
  width: SIZE_SCALE_DEFAULT,
  height: SIZE_SCALE_DEFAULT,
  length: SIZE_SCALE_DEFAULT,
}

export function getSizeToggleKey(userData?: Record<string, unknown>): string | null {
  if (!userData || !Object.prototype.hasOwnProperty.call(userData, SIZE_TOGGLE_PROP))
    return null

  const value = userData[SIZE_TOGGLE_PROP]
  if (value === undefined || value === null)
    return null

  return String(value)
}

export function clampSizeFactor(value: number): number {
  return Math.min(SIZE_SCALE_MAX, Math.max(SIZE_SCALE_MIN, value))
}

export function collectSizeToggleGroups(root: Object3D): Map<string, SizeToggleTarget[]> {
  const groups = new Map<string, SizeToggleTarget[]>()

  root.traverse((node) => {
    const key = getSizeToggleKey(node.userData as Record<string, unknown>)
    if (key === null)
      return

    const list = groups.get(key) ?? []
    list.push({
      object: node,
      baseScale: node.scale.clone(),
    })
    groups.set(key, list)
  })

  for (const [key, targets] of groups)
    groups.set(key, targets.sort((a, b) => a.object.name.localeCompare(b.object.name)))

  return groups
}

export function applySizeFactors(
  targets: readonly SizeToggleTarget[],
  factors: SizeFactors,
): void {
  const width = clampSizeFactor(factors.width)
  const height = clampSizeFactor(factors.height)
  const length = clampSizeFactor(factors.length)

  for (const { object, baseScale } of targets) {
    object.scale.set(
      baseScale.x * width,
      baseScale.y * height,
      baseScale.z * length,
    )
  }
}
