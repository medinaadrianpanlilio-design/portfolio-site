import * as THREE from 'three'

/**
 * Blender bakes the lighting into each texture, so show those textures unlit;
 * real-time lights would light the room twice.
 */
export function applyBakedMaterials(root: THREE.Object3D): void {
  root.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return
    const map = (object.material as THREE.MeshStandardMaterial).map
    if (!map) return
    map.colorSpace = THREE.SRGBColorSpace
    // toneMapped: false. The bake already went through Blender's view transform.
    object.material = new THREE.MeshBasicMaterial({ map, toneMapped: false })
  })
}
