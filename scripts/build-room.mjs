import { readFile, stat } from 'node:fs/promises'
import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'
import { dedup, meshopt, prune, textureCompress } from '@gltf-transform/functions'
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer'
import sharp from 'sharp'

import { checkRoomNames, deriveRoomNames } from './room-lib.mjs'

const BUDGET = 3_000_000
const [input, output = 'public/models/room.glb'] = process.argv.slice(2)
if (!input) {
  console.error('Usage: npm run room -- path/to/room.glb [output.glb]')
  process.exit(2)
}

const contract = JSON.parse(await readFile('src/content/roomContract.json', 'utf8'))
const required = deriveRoomNames(contract.objects)

await MeshoptEncoder.ready
const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({
    'meshopt.decoder': MeshoptDecoder,
    'meshopt.encoder': MeshoptEncoder,
  })

const document = await io.read(input)

const missing = checkRoomNames(document, required)
if (missing.length > 0) {
  console.error(`Missing in Blender export: ${missing.join(', ')}`)
  process.exit(1)
}

await document.transform(
  dedup(),
  // keepLeaves: the camera empties are leaf nodes with no mesh.
  prune({ keepLeaves: true }),
  textureCompress({ encoder: sharp, targetFormat: 'webp', resize: [2048, 2048] }),
  meshopt({ encoder: MeshoptEncoder, level: 'medium' }),
)

const lost = checkRoomNames(document, required)
if (lost.length > 0) {
  console.error(`Compression removed required nodes: ${lost.join(', ')}`)
  process.exit(1)
}

await io.write(output, document)
const { size } = await stat(output)
const mb = (size / 1_000_000).toFixed(2)
if (size > BUDGET) {
  console.error(`room.glb is ${mb} MB; budget is 3 MB`)
  process.exit(1)
}
console.log(`Wrote ${output} (${mb} MB)`)
