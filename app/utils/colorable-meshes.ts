import type { Material, Mesh, Object3D } from 'three'
import { Color, Mesh as ThreeMesh } from 'three'
import { COLOR_TOGGLE_PROP } from '../constants/color-slots'

/**
 * Returns the color_toggle group key, or null when the mesh has no toggle property.
 * Empty string is a valid group (e.g. tree with color_toggle = "").
 */
export function getColorToggleKey(userData?: Record<string, unknown>): string | null {
  if (!userData || !Object.prototype.hasOwnProperty.call(userData, COLOR_TOGGLE_PROP))
    return null

  const value = userData[COLOR_TOGGLE_PROP]
  if (value === undefined || value === null)
    return null

  return String(value)
}

export function collectColorableMeshes(root: Object3D): Map<string, ThreeMesh[]> {
  const slots = new Map<string, ThreeMesh[]>()

  root.traverse((node) => {
    if (!(node as ThreeMesh).isMesh)
      return

    const mesh = node as ThreeMesh
    const key = getColorToggleKey(mesh.userData as Record<string, unknown>)
    if (key === null)
      return

    const list = slots.get(key) ?? []
    list.push(mesh)
    slots.set(key, list)
  })

  return slots
}

function cloneMaterial(material: Material): Material {
  return material.clone()
}

export function ensureUniqueMaterials(mesh: ThreeMesh): void {
  if (Array.isArray(mesh.material)) {
    mesh.material = mesh.material.map(cloneMaterial)
    return
  }
  mesh.material = cloneMaterial(mesh.material)
}

export function readMeshColorHex(mesh: ThreeMesh): string {
  const material = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material
  if (material && 'color' in material && material.color instanceof Color)
    return `#${material.color.getHexString()}`
  return '#ffffff'
}

export function applyColorToMeshes(meshes: ThreeMesh[], hex: string): void {
  const color = new Color(hex)
  for (const mesh of meshes) {
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
    for (const material of materials) {
      if ('color' in material && material.color instanceof Color)
        material.color.copy(color)
    }
  }
}
