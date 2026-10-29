import { readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const root = process.cwd()
const read = (file: string) => readFileSync(path.join(root, file), 'utf8')

describe('document shell and deployment config', () => {
  it('describes the landing page and its social image', () => {
    const html = read('index.html')
    expect(html).toContain('<title>Adrian Medina — Software Engineer</title>')
    expect(html).toContain('name="color-scheme" content="light"')
    expect(html).toContain('name="theme-color" content="#f4f2ed"')
    expect(html).toContain('property="og:image" content="/images/og.jpg"')
    expect(html).toContain('Magilas Gym, HealthyaSat, and Iahbrary')
    expect(html).toContain('software, systems, and AI')
    expect(html).not.toMatch(/SkySprout|three|canvas/i)
    expect(statSync(path.join(root, 'public/images/og.jpg')).size).toBeGreaterThan(
      10_000,
    )
  })

  it('ships 3D only as the room runtime', () => {
    const pkg = JSON.parse(read('package.json')) as {
      dependencies: Record<string, string>
      devDependencies: Record<string, string>
    }
    const dependencies = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
    }

    expect(dependencies).toHaveProperty('three')
    expect(dependencies).toHaveProperty('@react-three/drei')
    // R3F v9 is the React 19 line.
    expect(dependencies['@react-three/fiber']).toMatch(/^\^?9\./)
    expect(dependencies).not.toHaveProperty('framer-motion')
    expect(dependencies).toHaveProperty('react-router-dom')
    expect(dependencies).toHaveProperty('@fontsource/archivo-black')
  })

  it('supports the project routes without swallowing the AI API', () => {
    const vercel = JSON.parse(read('vercel.json')) as {
      rewrites: { source: string; destination: string }[]
    }
    expect(vercel.rewrites).toEqual([
      {
        source: '/:path((?!api/).*)',
        destination: '/index.html',
      },
    ])
    expect(vercel.rewrites[0].source).toContain('?!api/')
  })

  it('keeps the approved favicon and robots file', () => {
    expect(read('public/favicon.svg')).toContain('<svg')
    expect(read('public/robots.txt')).toContain('Allow: /')
  })
})
