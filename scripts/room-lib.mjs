// Shared by scripts/build-room.mjs and its tests. Mirrors requiredRoomNodes()
// in src/content/room.ts; a test pins the two together.

/** @param {string[]} objects */
export function deriveRoomNames(objects) {
  return [
    ...objects,
    'cam_start',
    'cam_start_target',
    ...objects.flatMap((name) => [`cam_${name}`, `cam_${name}_target`]),
  ]
}

/**
 * @param {import('@gltf-transform/core').Document} document
 * @param {string[]} required
 * @returns {string[]} the required names missing from the export, in order
 */
export function checkRoomNames(document, required) {
  const present = new Set(document.getRoot().listNodes().map((node) => node.getName()))
  return required.filter((name) => !present.has(name))
}
