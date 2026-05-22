import type { Material, Mesh, Object3D } from 'three'
import { MeshStandardMaterial } from 'three'

/**
 * GLTF exports often ship with metalness=1 and no environment map,
 * which makes MeshStandardMaterial render fully black under scene lights.
 */
export function normalizeModelMaterials(root: Object3D): void {
  root.traverse((node) => {
    if (!(node as Mesh).isMesh)
      return

    const mesh = node as Mesh
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]

    for (const material of materials)
      normalizeMaterial(material)
  })
}

function normalizeMaterial(material: Material): void {
  if (!(material instanceof MeshStandardMaterial))
    return

  if (material.metalness > 0)
    material.metalness = 0

  if (material.roughness < 0.4)
    material.roughness = 0.85

  material.needsUpdate = true
}
