import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

// Runs against Adrian's Blender room (`vite build --mode e2e`, see .env.e2e).

const label = (name: string) =>
  new RegExp(`^${name}: (show in|open from) the room$`)

const STOPS = [
  { name: 'Projects', object: 'monitor', action: 'Open projects', url: /\/projects$/ },
  { name: 'Skills', object: 'system_unit', action: 'See skills', url: /#skills$/ },
  { name: 'Contact', object: 'window', action: 'Get in touch', url: /#contact$/ },
  { name: 'About', object: 'bed', action: 'More about me', url: /\/about$/ },
] as const

const preview = (page: Page, object: string) =>
  page.locator(`[data-room-preview="${object}"]`)

/**
 * Wait out a card's fade-in before clicking it. Playwright retries a click by
 * scrolling the element into view, which for a sticky element scrolls the
 * page away from the stop.
 */
async function settled(card: ReturnType<typeof preview>) {
  await expect(card).toBeVisible()
  await card.evaluate((element) =>
    Promise.all(element.getAnimations({ subtree: true }).map((animation) => animation.finished)),
  )
}

/** Scroll straight to the middle of a stop's hold, the way a reader would land there. */
async function scrollToStop(page: Page, index: number) {
  await page.evaluate((index) => {
    const track = document.querySelector<HTMLElement>('[data-room-tour="scroll"]')!
    const stage = track.firstElementChild as HTMLElement
    const distance = track.offsetHeight - stage.offsetHeight
    const hold = 0.22
    const top = track.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: top + ((index + 1 - hold / 2) / 4) * distance, behavior: 'instant' })
  }, index)
}

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

test.describe('desktop labels (reduced motion: no scroll tour)', () => {
  test.use({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' })

  /** A label shows its preview first; the preview's action opens the page. */
  const open = async (page: Page, index: number) => {
    const stop = STOPS[index]
    await page.goto('/')
    await expect(page.locator('canvas[data-view="start"]')).toHaveCount(1)
    await page.getByRole('button', { name: label(stop.name) }).focus()
    await page.keyboard.press('Enter')
    await expect(page.locator(`canvas[data-view="${stop.object}"]`)).toHaveCount(1)
    await expect(page).toHaveURL(/\/$/)
    const card = preview(page, stop.object)
    await settled(card)
    await card.getByRole('link', { name: stop.action }).click()
  }

  test('monitor opens projects', async ({ page }) => {
    await open(page, 0)
    await expect(page).toHaveURL(STOPS[0].url)
    await expect(page.getByRole('heading', { level: 1, name: 'Projects' })).toBeFocused()
  })

  test('bed opens about', async ({ page }) => {
    await open(page, 3)
    await expect(page).toHaveURL(STOPS[3].url)
    await expect(page.getByRole('heading', { level: 1 })).toBeFocused()
  })

  test('system unit opens skills', async ({ page }) => {
    await open(page, 1)
    await expect(page).toHaveURL(STOPS[1].url)
    const heading = page.locator('#skills-heading')
    await expect(heading).toBeInViewport()
    await expect(heading).toBeFocused()
  })

  test('window opens contact', async ({ page }) => {
    await open(page, 2)
    await expect(page).toHaveURL(STOPS[2].url)
    await expect(page.locator('#contact-heading')).toBeFocused()
  })

  test('paper opens the resume PDF directly', async ({ page }) => {
    const pdf = page.waitForResponse('**/Adrian-Medina-Resume.pdf')
    await page.goto('/')
    await expect(page.locator('canvas[data-view="start"]')).toHaveCount(1)
    await page.getByRole('button', { name: label('Resume') }).focus()
    await page.keyboard.press('Enter')
    expect((await pdf).status()).toBe(200)
  })

  test('after jumping to skills, scrolling back up shows the start view', async ({
    page,
  }) => {
    await open(page, 1)
    await expect(page).toHaveURL(/#skills$/)
    await page.evaluate(() => window.scrollTo(0, 0))
    await expect(page.locator('canvas[data-view="start"]')).toHaveCount(1)
    await expect(page.locator('[data-room-preview]:not([inert])')).toHaveCount(0)
  })

  test('the room stays put: no tall scroll track', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('[data-room-tour="static"]')).toHaveCount(1)
    const height = await page
      .getByRole('region', { name: "Adrian's room" })
      .evaluate((room) => room.getBoundingClientRect().height)
    expect(height).toBeLessThanOrEqual(1001)
  })
})

test.describe('scroll tour (desktop)', () => {
  test.use({ viewport: { width: 1440, height: 1000 } })

  test('scrolling visits monitor, system unit, window, bed, then releases the page', async ({
    page,
  }) => {
    await page.goto('/')
    await expect(page.locator('canvas[data-view="start"]')).toHaveCount(1)
    await expect(page.getByText('Scroll to explore')).toBeVisible()
    await expect(page.locator('[data-room-preview]:not([inert])')).toHaveCount(0)

    for (const [index, stop] of STOPS.entries()) {
      await scrollToStop(page, index)
      await expect(page.locator(`canvas[data-view="${stop.object}"]`)).toHaveCount(1)
      await expect(preview(page, stop.object)).toBeVisible()
      await expect(page.locator('[data-room-preview]:not([inert])')).toHaveCount(1)
      await expect(
        page.getByRole('button', { name: `0${index + 1} ${stop.name}` }),
      ).toHaveAttribute('aria-current', 'step')
      // The room is still pinned to the viewport.
      const top = await page
        .locator('[data-room-tour="scroll"] > div')
        .evaluate((stage) => stage.getBoundingClientRect().top)
      expect(Math.abs(top)).toBeLessThan(1)
      // Let the camera settle before the picture.
      await page.waitForTimeout(900)
      await page.screenshot({ path: `artifacts/e2e-tour-${stop.object}.png` })
    }
    await expect(page.getByText('Scroll to explore')).toBeHidden()

    // Past About, the page carries on into the homepage.
    await page.mouse.move(720, 500)
    for (let i = 0; i < 3; i++) await page.mouse.wheel(0, 250)
    await expect
      .poll(() =>
        page
          .locator('[data-room-tour="scroll"] > div')
          .evaluate((stage) => stage.getBoundingClientRect().top),
      )
      .toBeLessThan(-100)
    await expect(
      page.getByRole('heading', { level: 1, name: /Software.*Systems.*AI/i }),
    ).toBeInViewport()
  })

  test('the wheel scrolls natively', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('canvas[data-view="start"]')).toHaveCount(1)
    await page.mouse.move(720, 500)
    await page.mouse.wheel(0, 300)
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(200)
    await page.mouse.wheel(0, 600)
    await expect(page.locator('canvas[data-view="monitor"]')).toHaveCount(1)
  })

  test('a rail step scrolls to its stop', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('canvas[data-view="start"]')).toHaveCount(1)
    await page.getByRole('button', { name: '03 Contact' }).click()
    await expect(page.locator('canvas[data-view="window"]')).toHaveCount(1)
    await expect(preview(page, 'window')).toBeVisible()
  })

  test('a label scrolls to its stop instead of navigating', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('canvas[data-view="start"]')).toHaveCount(1)
    await page.getByRole('button', { name: label('About') }).focus()
    await page.keyboard.press('Enter')
    await expect(page.locator('canvas[data-view="bed"]')).toHaveCount(1)
    await expect(page).toHaveURL(/\/$/)
    await expect(preview(page, 'bed')).toBeVisible()
  })

  test('the preview action steps into the page behind a warm overlay', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('canvas[data-view="start"]')).toHaveCount(1)
    await scrollToStop(page, 0)
    const card = preview(page, 'monitor')
    await settled(card)
    await card.getByRole('link', { name: 'Open projects' }).click()
    await expect(page.locator('[data-phase="cover"]')).toHaveCount(1)
    await expect(page).toHaveURL(/\/projects$/)
    await expect(page.locator('[data-phase]')).toHaveCount(0)
    await expect(page.getByRole('heading', { level: 1, name: 'Projects' })).toBeFocused()
    expect(await page.evaluate(() => window.scrollY)).toBe(0)
  })

  test('skip jumps past the whole tour', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('canvas[data-view="start"]')).toHaveCount(1)
    await page.getByRole('button', { name: 'Skip to my work' }).click()
    const headline = page.getByRole('heading', { level: 1, name: /Software.*Systems.*AI/i })
    await expect(headline).toBeInViewport()
    await expect(headline).toBeFocused()
  })

  test('axe: no serious issues with a preview open', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('canvas[data-view="start"]')).toHaveCount(1)
    await scrollToStop(page, 2)
    await expect(preview(page, 'window')).toBeVisible()
    const results = await new AxeBuilder({ page }).analyze()
    const serious = results.violations.filter((violation) =>
      ['serious', 'critical'].includes(violation.impact ?? ''),
    )
    expect(serious.map((violation) => violation.id)).toEqual([])
  })
})

test('double press during the transition navigates once', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/')
  await expect(page.locator('canvas[data-view="start"]')).toHaveCount(1)
  const before = await page.evaluate(() => history.length)

  await scrollToStop(page, 0)
  await settled(preview(page, 'monitor'))
  const action = preview(page, 'monitor').getByRole('link', { name: 'Open projects' })
  await action.focus()
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

  test('each preview is a bottom sheet clear of the dock', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('canvas[data-view="start"]')).toHaveCount(1)
    const dock = (await page.getByRole('navigation', { name: 'Primary navigation' }).boundingBox())!

    for (const [index, stop] of STOPS.entries()) {
      await scrollToStop(page, index)
      const card = preview(page, stop.object)
      await expect(card).toBeVisible()
      await expect(card.getByRole('link', { name: stop.action })).toBeInViewport({ ratio: 1 })
      const box = (await card.boundingBox())!
      expect(box.y + box.height, stop.name).toBeLessThanOrEqual(dock.y)
      expect(box.x).toBeGreaterThanOrEqual(0)
      expect(box.x + box.width).toBeLessThanOrEqual(390)
      await page.waitForTimeout(900)
      await page.screenshot({ path: `artifacts/e2e-tour-phone-${stop.object}.png` })
    }
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
  // No tour: no tall track of empty screens, no rail.
  await expect(page.locator('[data-room-tour]')).toHaveCount(0)
  await expect(page.getByRole('navigation', { name: 'Room tour' })).toHaveCount(0)
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

test.describe('review fixes', () => {
  test.use({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  })

  test('phone: swiping on the room scrolls the page', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('canvas[data-view="start"]')).toHaveCount(1)

    // Raw touch events (synthesizeScrollGesture doesn't scroll in headless Chromium).
    const client = await page.context().newCDPSession(page)
    const touch = (type: string, y?: number) =>
      client.send('Input.dispatchTouchEvent', {
        type,
        touchPoints: y === undefined ? [] : [{ x: 195, y }],
      })
    await touch('touchStart', 650)
    for (let step = 1; step <= 10; step++) await touch('touchMove', 650 - step * 40)
    await touch('touchEnd')

    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100)
  })
})

test('a failed room chunk shows the fallback, not a blank site', async ({ page }) => {
  await page.route('**/RoomCanvas-*.js', (route) => route.abort())
  const failed = page.waitForEvent('requestfailed', (request) =>
    request.url().includes('RoomCanvas-'),
  )
  await page.goto('/')
  await failed
  // Let the rejected import reach React before checking what survived.
  await page.waitForTimeout(500)

  await expect(page.locator('[data-room-fallback]')).toBeVisible()
  await expect(page.getByRole('status')).toHaveCount(0)
  await expect(
    page.getByRole('heading', { level: 1, name: /Software.*Systems.*AI/i }),
  ).toBeAttached()
})

test('opening Skills again after scrolling up scrolls down again', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.locator('canvas[data-view="start"]')).toHaveCount(1)
  const skills = page.getByRole('button', { name: label('Skills') })
  const action = preview(page, 'system_unit').getByRole('link', { name: 'See skills' })

  await skills.focus()
  await page.keyboard.press('Enter')
  await action.click()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(500)

  await page.evaluate(() => window.scrollTo(0, 0))
  await expect(page.locator('canvas[data-view="start"]')).toHaveCount(1)
  await skills.focus()
  await page.keyboard.press('Enter')
  await action.click()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(500)
})

test('hovering the work list keeps the room alive', async ({ page }) => {
  await page.addInitScript(() => {
    const counter = window as unknown as { __webgl: number }
    counter.__webgl = 0
    const original = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      type: string,
      ...args: unknown[]
    ) {
      if (/webgl/.test(type)) counter.__webgl++
      return original.call(this, type as '2d', ...(args as []))
    } as typeof original
  })
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/')
  await expect(page.locator('canvas[data-view="start"]')).toHaveCount(1)

  // The selected-work row (its pointer moves re-render HomePage).
  const row = page
    .locator('section[aria-labelledby="selected-work-heading"]')
    .getByRole('link', { name: /MAGILAS/i })
  await row.scrollIntoViewIfNeeded()
  const box = (await row.boundingBox())!
  const count = () =>
    page.evaluate(() => (window as unknown as { __webgl: number }).__webgl)
  const before = await count()
  for (let i = 0; i < 40; i++) {
    await page.mouse.move(box.x + 20 + i * 8, box.y + box.height / 2 + (i % 2))
  }
  // No new WebGL contexts per pointer move (each one can evict the room's).
  expect(await count()).toBe(before)
})
