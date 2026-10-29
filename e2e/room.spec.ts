import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

// Runs against the stand-in room (`vite build --mode e2e`, see .env.e2e).

const label = (name: string) =>
  new RegExp(`^${name}: open from the room$`)

test('overlay is usable before the room loads', async ({ page }) => {
  await page.route('**/RoomCanvas-*.js', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 3000))
    await route.continue()
  })
  await page.goto('/')

  const room = page.getByRole('region', { name: "Adrian's room" })
  await expect(room.getByText('Adrian Alexander Medina')).toBeVisible({
    timeout: 1000,
  })
  await expect(room.getByText(/Software Engineer & AI Integrator/)).toBeVisible({
    timeout: 1000,
  })
  // Labels never show before the scene has placed them.
  await expect(page.getByRole('button', { name: label('Projects') })).toBeHidden()

  await page.getByRole('button', { name: 'Skip to my work' }).click()
  await expect(
    page.getByRole('heading', { level: 1, name: /Software.*Systems.*AI/i }),
  ).toBeInViewport()
})

test.describe('desktop labels', () => {
  test.use({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' })

  const open = async (page: import('@playwright/test').Page, name: string) => {
    await page.goto('/')
    await expect(page.locator('canvas[data-view="start"]')).toHaveCount(1)
    const button = page.getByRole('button', { name: label(name) })
    await button.focus()
    await page.keyboard.press('Enter')
  }

  test('monitor opens projects', async ({ page }) => {
    await open(page, 'Projects')
    await expect(page).toHaveURL(/\/projects$/)
  })

  test('bed opens about', async ({ page }) => {
    await open(page, 'About')
    await expect(page).toHaveURL(/\/about$/)
  })

  test('system unit opens skills', async ({ page }) => {
    await open(page, 'Skills')
    await expect(page).toHaveURL(/#skills$/)
    await expect(
      page.getByRole('heading', { level: 2, name: 'What I work with.' }),
    ).toBeInViewport()
  })

  test('window opens contact', async ({ page }) => {
    await open(page, 'Contact')
    await expect(page).toHaveURL(/#contact$/)
  })

  test('paper opens the resume PDF', async ({ page }) => {
    const pdf = page.waitForResponse('**/Adrian-Medina-Resume.pdf')
    await open(page, 'Resume')
    expect((await pdf).status()).toBe(200)
  })

  test('after jumping to skills, scrolling back up shows the start view', async ({
    page,
  }) => {
    await open(page, 'Skills')
    await expect(page).toHaveURL(/#skills$/)
    await page.evaluate(() => window.scrollTo(0, 0))
    await expect(page.locator('canvas[data-view="start"]')).toHaveCount(1)
  })
})

test('double tap during a flight navigates once', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/')
  await expect(page.locator('canvas[data-view="start"]')).toHaveCount(1)
  const before = await page.evaluate(() => history.length)

  const button = page.getByRole('button', { name: label('Projects') })
  await button.focus()
  await page.keyboard.press('Enter')
  await page.keyboard.press('Enter')

  await expect(page).toHaveURL(/\/projects$/)
  await page.waitForTimeout(1500)
  expect(await page.evaluate(() => history.length)).toBe(before + 1)
})

test.describe('phone', () => {
  test.use({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 3,
  })

  test('labels are visible, tappable and nothing overflows', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('canvas[data-view="start"]')).toHaveCount(1)

    const card = await page
      .getByRole('button', { name: 'Skip to my work' })
      .locator('..')
      .boundingBox()
    const boxes: { name: string; x: number; y: number; width: number; height: number }[] = []
    for (const name of ['Projects', 'Skills', 'Contact', 'About', 'Resume']) {
      const button = page.getByRole('button', { name: label(name) })
      await expect(button).toBeVisible()
      const box = (await button.boundingBox())!
      expect(box.height, name).toBeGreaterThanOrEqual(44)
      // Fully on screen.
      expect(box.x, name).toBeGreaterThanOrEqual(0)
      expect(box.x + box.width, name).toBeLessThanOrEqual(390)
      boxes.push({ name, ...box })
    }

    const overlaps = (
      a: { x: number; y: number; width: number; height: number },
      b: { x: number; y: number; width: number; height: number },
    ) =>
      a.x < b.x + b.width &&
      b.x < a.x + a.width &&
      a.y < b.y + b.height &&
      b.y < a.y + a.height

    for (const [i, a] of boxes.entries()) {
      expect(overlaps(a, card!), `${a.name} under the name card`).toBe(false)
      for (const b of boxes.slice(i + 1)) {
        expect(overlaps(a, b), `${a.name} overlaps ${b.name}`).toBe(false)
      }
    }

    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth + 1,
    )
    expect(overflow).toBe(false)
    await page.screenshot({ path: 'artifacts/e2e-room-phone.png' })
  })
})

test('no WebGL shows the still fallback', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      type: string,
      ...args: unknown[]
    ) {
      if (/webgl/.test(type)) return null
      return original.call(this, type as '2d', ...(args as []))
    } as typeof original
  })
  await page.goto('/')

  await expect(page.locator('canvas')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Skip to my work' })).toBeVisible()
  // The still image is optional until Adrian renders it; the warm fallback is not.
  await expect(page.locator('[data-room-fallback]')).toBeVisible()
})

test('other routes never load the room', async ({ page }) => {
  const urls: string[] = []
  page.on('request', (request) => urls.push(request.url()))
  await page.goto('/projects')
  await page.waitForLoadState('networkidle')

  expect(urls.filter((url) => /RoomCanvas-|\/models\//.test(url))).toEqual([])
})

test('axe: no serious or critical issues on / with the room', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/')
  await expect(page.locator('canvas[data-view="start"]')).toHaveCount(1)

  const results = await new AxeBuilder({ page }).analyze()
  const serious = results.violations.filter((violation) =>
    ['serious', 'critical'].includes(violation.impact ?? ''),
  )
  expect(serious.map((violation) => violation.id)).toEqual([])
})
