import {
  BufferGeometry,
  EdgesGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  type Object3D,
} from 'three'
import {
  SKETCH_EDGE_COLOR,
  SKETCH_EDGE_THRESHOLD,
} from '../constants/sketch-edges'

const SKETCH_EDGES_KEY = '__sketchEdges'

function disposeLineSegments(lines: LineSegments): void {
  lines.geometry.dispose()
  const { material } = lines
  if (Array.isArray(material))
    material.forEach(mat => mat.dispose())
  else
    material.dispose()
}

export function applySketchEdges(root: Object3D): void {
  root.traverse((node) => {
    if (!(node as Mesh).isMesh)
      return

    const mesh = node as Mesh
    if (mesh.userData[SKETCH_EDGES_KEY])
      return

    const geometry = mesh.geometry
    if (!(geometry instanceof BufferGeometry))
      return

    const edgesGeometry = new EdgesGeometry(geometry, SKETCH_EDGE_THRESHOLD)
    const lines = new LineSegments(
      edgesGeometry,
      new LineBasicMaterial({ color: SKETCH_EDGE_COLOR }),
    )
    lines.renderOrder = 1
    mesh.add(lines)
    mesh.userData[SKETCH_EDGES_KEY] = lines
  })
}

export function removeSketchEdges(root: Object3D): void {
  root.traverse((node) => {
    if (!(node as Mesh).isMesh)
      return

    const mesh = node as Mesh
    const lines = mesh.userData[SKETCH_EDGES_KEY] as LineSegments | undefined
    if (!lines)
      return

    mesh.remove(lines)
    disposeLineSegments(lines)
    delete mesh.userData[SKETCH_EDGES_KEY]
  })
}

export function refreshSketchEdges(root: Object3D): void {
  removeSketchEdges(root)
  applySketchEdges(root)
}
