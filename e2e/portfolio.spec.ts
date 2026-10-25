import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('desktop: the page renders and the island is live', async ({ page }) => {
  const consoleErrors: string[] = []
  const pageErrors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })
  page.on('pageerror', (error) => pageErrors.push(error.message))

  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/')

  await expect(page).toHaveTitle(
    'Adrian Medina — Software Engineer & Builder',
  )
  await expect(
    page.getByRole('heading', { level: 1, name: 'Adrian Medina' }),
  ).toBeVisible()
  await expect(page.getByTestId('island-canvas')).toBeVisible()
  await expect(page.locator('canvas')).toBeVisible()

  const playLink = page.getByRole('link', { name: 'Play SkySprout' }).first()
  await expect(playLink).toHaveAttribute(
    'href',
    'https://www.roblox.com/games/117628058304479',
  )

  for (const heading of [
    'SkySprout',
    'Iahbrary',
    'Other work',
    'About',
    'Contact',
  ]) {
    await expect(
      page.getByRole('heading', { level: 2, name: heading }),
    ).toBeVisible()
  }

  await page.screenshot({ path: 'artifacts/e2e-desktop.png' })

  expect(consoleErrors).toEqual([])
  expect(pageErrors).toEqual([])
})

test('phone: no overflow and the fallback is visible', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  await expect(
    page.getByRole('heading', { level: 1, name: 'Adrian Medina' }),
  ).toBeVisible()
  await expect(page.getByTestId('island-fallback')).toBeVisible()
  await expect(page.locator('canvas')).toHaveCount(0)

  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth + 1,
  )
  expect(overflow).toBe(false)

  await page.screenshot({ path: 'artifacts/e2e-mobile.png' })
})

test('reduced motion: no canvas', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')

  await expect(page.getByTestId('island-fallback')).toBeVisible()
  await expect(page.locator('canvas')).toHaveCount(0)
})

test('links, images, and accessibility', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/')

  await expect(
    page.getByRole('link', { name: 'Visit HealthyaSat' }),
  ).toHaveAttribute('href', 'https://healthyasat.fit/')
  await expect(page.getByRole('link', { name: 'Visit the gym' })).toHaveAttribute(
    'href',
    'https://magilasgym.com/',
  )
  await expect(page.getByRole('link', { name: 'Staff portal' })).toHaveAttribute(
    'href',
    'https://magilasgym.com/login',
  )
  await expect(page.getByRole('link', { name: 'View the code' })).toHaveAttribute(
    'href',
    'https://github.com/medinaadrianpanlilio-design/iahbrary',
  )
  await expect(page.getByRole('link', { name: 'GitHub' }).first()).toHaveAttribute(
    'href',
    'https://github.com/medinaadrianpanlilio-design',
  )
  await expect(
    page.getByRole('link', { name: 'medinaadrianpanlilio@gmail.com' }).first(),
  ).toHaveAttribute('href', 'mailto:medinaadrianpanlilio@gmail.com')

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(1200)

  const contentImages = page.locator('main img:not([alt=""])')
  expect(await contentImages.count()).toBeGreaterThanOrEqual(5)
  for (const image of await contentImages.all()) {
    await expect(image).toHaveAttribute('alt', /.+/)
    await expect
      .poll(() =>
        image.evaluate((element: HTMLImageElement) => element.naturalWidth),
      )
      .toBeGreaterThan(0)
  }

  const results = await new AxeBuilder({ page }).analyze()
  expect(
    results.violations.filter((violation) =>
      ['critical', 'serious'].includes(violation.impact ?? ''),
    ),
  ).toEqual([])
})
