import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sourceDir = path.join(root, 'assets', 'source')
const outputDir = path.join(root, 'public', 'images')

const imageJobs = [
  { source: 'magilas-landing.png', name: 'magilas-landing', widths: [800, 1440] },
  { source: 'healthyaSat-extension.png', name: 'healthyaSat-extension', widths: [600, 843] },
  { source: 'iahbrary-home.png', name: 'iahbrary-home', widths: [360, 720] },
  { source: 'skysprout-garden.png', name: 'skysprout-garden', widths: [800, 1600] },
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
