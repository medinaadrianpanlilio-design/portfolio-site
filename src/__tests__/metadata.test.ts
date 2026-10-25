import { readFileSync } from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

const root = process.cwd()
const read = (file: string) => readFileSync(path.join(root, file), 'utf8')

describe('site metadata', () => {
  it('has the approved title, description, and social image', () => {
    const html = read('index.html')

    expect(html).toContain('<title>Adrian Medina — Software Engineer & Builder</title>')
    expect(html).toContain(
      'name="description" content="Computer Science student building software with a visible surface: SkySprout, Iahbrary, HealthyaSat, and Magilas Gym."',
    )
    expect(html).toContain('name="theme-color" content="#071a14"')
    expect(html).toContain('property="og:image" content="/images/og.jpg"')
    expect(html).toContain('property="og:image:width" content="1200"')
    expect(html).toContain('property="og:image:height" content="630"')
    expect(html).toContain('name="twitter:card" content="summary_large_image"')
  })

  it('ships a custom favicon and robots file', () => {
    expect(read('public/favicon.svg')).toContain('<svg')
    expect(read('public/favicon.svg')).toContain('#071a14')
    expect(read('public/robots.txt')).toContain('User-agent: *')
  })
})
