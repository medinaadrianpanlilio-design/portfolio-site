import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sourceDir = path.join(root, 'assets', 'source')
const outputDir = path.join(root, 'public', 'images')

const imageJobs = [
  { source: 'iahbrary-home.png', name: 'iahbrary-home', widths: [360, 720] },
  { source: 'skysprout-garden.png', name: 'skysprout-garden', widths: [800, 1600] },
  { source: 'skysprout-weather.png', name: 'skysprout-weather', widths: [800, 1600] },
  { source: 'skysprout-listing.png', name: 'skysprout-listing', widths: [600, 1000] },
  { source: 'skysprout-thumbnail.png', name: 'skysprout-thumbnail', widths: [400, 768] },
  { source: 'skysprout-icon.png', name: 'skysprout-icon', widths: [256, 512] },
  { source: 'healthyaSat-extension.png', name: 'healthyaSat-extension', widths: [600, 843] },
]

await mkdir(outputDir, { recursive: true })

for (const job of imageJobs) {
  const input = path.join(sourceDir, job.source)
  const metadata = await sharp(input).metadata()
  for (const width of job.widths) {
    if (!metadata.width || width > metadata.width) {
      continue
    }
    const output = path.join(outputDir, `${job.name}-${width}.webp`)
    await sharp(input)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(output)
    console.log(`wrote ${path.relative(root, output)}`)
  }
}

await sharp(path.join(sourceDir, 'skysprout-garden.png'))
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .jpeg({ quality: 84 })
  .toFile(path.join(outputDir, 'og.jpg'))
console.log('wrote public/images/og.jpg')
