import type { Material, Mesh, Object3D } from 'three'
import { Color } from 'three'

/** Keys written by GLTFLoader that are not Blender custom properties. */
const SKIP_USER_DATA_KEYS = new Set(['name', 'gltfExtensions'])

export interface GltfNodeInfo {
  name: string
  type: string
  uuid: string
  material?: string
  customProperties?: Record<string, unknown>
  children: GltfNodeInfo[]
}

export interface GltfCustomPropertyRow {
  path: string
  name: string
  type: string
  properties: Record<string, unknown>
}

function extractCustomProperties(userData?: Record<string, unknown>): Record<string, unknown> | undefined {
  const properties: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(userData ?? {})) {
    if (SKIP_USER_DATA_KEYS.has(key))
      continue
    properties[key] = value
  }

  return Object.keys(properties).length > 0 ? properties : undefined
}

function describeMaterial(material: Material): string {
  const parts = [material.type]
  if ('color' in material && material.color instanceof Color)
    parts.push(`color=#${material.color.getHexString()}`)
  if ('metalness' in material && typeof material.metalness === 'number')
    parts.push(`metalness=${material.metalness}`)
  if ('roughness' in material && typeof material.roughness === 'number')
    parts.push(`roughness=${material.roughness}`)
  if ('map' in material && material.map)
    parts.push('map=yes')

  const custom = extractCustomProperties(material.userData)
  if (custom)
    parts.push(`custom=${JSON.stringify(custom)}`)

  return parts.join(', ')
}

function buildNode(object: Object3D): GltfNodeInfo {
  const node: GltfNodeInfo = {
    name: object.name || '(unnamed)',
    type: object.type,
    uuid: object.uuid,
    children: [],
  }

  node.customProperties = extractCustomProperties(object.userData)

  if ((object as Mesh).isMesh) {
    const mesh = object as Mesh
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
    node.material = materials.map(describeMaterial).join(' | ')
  }

  for (const child of object.children)
    node.children.push(buildNode(child))

  return node
}

function collectCustomPropertyRows(
  object: Object3D,
  path: string,
  rows: GltfCustomPropertyRow[] = [],
): GltfCustomPropertyRow[] {
  const properties = extractCustomProperties(object.userData)
  const objectPath = path ? `${path}/${object.name || '(unnamed)'}` : (object.name || '(unnamed)')

  if (properties) {
    rows.push({
      path: objectPath,
      name: object.name || '(unnamed)',
      type: object.type,
      properties,
    })
  }

  if ((object as Mesh).isMesh) {
    const mesh = object as Mesh
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
    for (const material of materials) {
      const materialProps = extractCustomProperties(material.userData)
      if (!materialProps)
        continue
      rows.push({
        path: `${objectPath} @material`,
        name: material.name || material.type,
        type: material.type,
        properties: materialProps,
      })
    }
  }

  for (const child of object.children)
    collectCustomPropertyRows(child, objectPath, rows)

  return rows
}

function formatTree(node: GltfNodeInfo, indent = ''): string {
  const material = node.material ? ` — ${node.material}` : ''
  const custom = node.customProperties
    ? `\n${indent}    [custom] ${JSON.stringify(node.customProperties)}`
    : ''
  const lines = [`${indent}${node.name} <${node.type}>${material}${custom}`]

  for (const child of node.children)
    lines.push(formatTree(child, `${indent}  `))

  return lines.join('\n')
}

export function logGltfStructure(root: Object3D, label = 'GLB'): void {
  const tree = buildNode(root)
  const customRows = collectCustomPropertyRows(root, '', [])

  console.group(`[${label}] scene structure`)
  console.log(tree)
  console.log(formatTree(tree))

  if (customRows.length > 0) {
    console.group(`[${label}] Blender custom properties (extras → userData)`)
    console.table(customRows.map(row => ({
      path: row.path,
      type: row.type,
      ...row.properties,
    })))
    console.log(customRows)
    console.groupEnd()
  }
  else {
    console.warn(`[${label}] no custom properties found — enable "Custom Properties" in Blender glTF export`)
  }

  console.groupEnd()
}
