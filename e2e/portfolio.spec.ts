import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

const linkedin =
  'https://www.linkedin.com/in/adrian-alexander-medina-022b8a433/'

async function waitForImages(page: Page) {
  await page.waitForFunction(() =>
    Array.from(document.images).every(
      (image) => image.complete && image.naturalWidth > 0,
    ),
  )
}

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth + 1,
  )
  expect(overflow).toBe(false)
}

test('desktop: the landing page leads with positioning, skills, stack, and LinkedIn', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/')

  await expect(page).toHaveTitle('Adrian Medina — Software Engineer')
  await expect(
    page.getByRole('heading', { level: 1, name: /Backend, web, mobile/i }),
  ).toBeVisible()
  await expect(
    page.getByRole('heading', { level: 2, name: 'What I work with.' }),
  ).toBeVisible()
  await expect(
    page.getByRole('heading', { level: 3, name: 'Tools in the kit.' }),
  ).toBeVisible()
  await expect(page.getByText('TypeScript')).toBeVisible()
  await expect(page.getByText('Docker')).toBeVisible()
  await expect(
    page.getByRole('complementary', { name: /right now summary/i }),
  ).toBeVisible()

  await expect(
    page.getByRole('link', { name: 'View projects' }),
  ).toHaveAttribute('href', '/projects')
  await expect(
    page.getByRole('link', { name: 'All projects' }),
  ).toHaveAttribute('href', '/projects')
  await expect(
    page.getByRole('link', { name: /MAGILAS/i }).first(),
  ).toHaveAttribute('href', '/projects/magilas')
  await expect(
    page.locator(`main a[href="${linkedin}"]`).first(),
  ).toHaveAttribute('href', linkedin)

  await expect(
    page.getByRole('navigation', { name: 'Primary navigation' }),
  ).toBeVisible()
  await expect(
    page.getByRole('link', { name: 'Home', exact: true }),
  ).toHaveAttribute('aria-current', 'page')
  await expect(page.locator('canvas')).toHaveCount(0)
  await expectNoHorizontalOverflow(page)

  const aiGuide = page.locator('#ai-guide')
  await expect(
    aiGuide.getByRole('heading', { level: 2, name: 'Ask about the work.' }),
  ).toBeVisible()
  await aiGuide
    .getByRole('button', { name: 'Which project shows backend work?' })
    .click()
  await expect(
    aiGuide.getByText(/HealthyaSat is the clearest backend\/API case study/),
  ).toBeVisible()
  await expect(
    aiGuide.getByText('Preview answer from the portfolio notes.'),
  ).toBeVisible()

  await page.screenshot({ path: 'artifacts/e2e-landing-desktop.png' })
})

test('desktop: professional work leads and the active project follows scroll', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/projects')

  await expect(page).toHaveTitle('Projects — Adrian Medina')
  await expect(
    page.getByRole('heading', { level: 1, name: 'Projects' }),
  ).toBeVisible()

  const cards = page.locator('main [data-project-slug] > a')
  await expect(cards).toHaveCount(3)
  expect(
    await cards.evaluateAll((nodes) =>
      nodes.map((node) => node.getAttribute('href')),
    ),
  ).toEqual([
    '/projects/magilas',
    '/projects/healthya-sat',
    '/projects/iahbrary',
  ])

  await expect(page.getByText('Off the clock')).toBeVisible()
  await expect(
    page.getByRole('heading', { level: 2, name: 'SkySprout' }),
  ).toBeVisible()
  await expect(
    page.getByRole('link', { name: 'Read the hobby note' }),
  ).toBeVisible()
  await expect(
    page.getByRole('link', { name: 'View SkySprout project' }),
  ).toHaveCount(0)

  await expect(
    page.getByRole('link', { name: 'Projects', exact: true }),
  ).toHaveAttribute('aria-current', 'page')
  await expectNoHorizontalOverflow(page)

  await waitForImages(page)
  const images = page.locator('main img')
  expect(await images.count()).toBeGreaterThanOrEqual(4)
  for (const image of await images.all()) {
    await expect(image).toHaveAttribute('alt', /.+/)
  }

  await page.evaluate(() => window.scrollTo(0, 1000))
  await expect(
    page
      .getByRole('complementary', { name: 'Current project' })
      .getByRole('heading', { level: 2 }),
  ).toHaveText('HEALTHYASAT')

  await page.evaluate(() => window.scrollTo(0, 2000))
  await expect(
    page
      .getByRole('complementary', { name: 'Current project' })
      .getByRole('heading', { level: 2 }),
  ).toHaveText('IAHBRARY')

  await page.screenshot({ path: 'artifacts/e2e-projects-desktop.png' })
})

test('mobile: floating dock navigates between home, about, and projects without overflow', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  await expect(
    page.getByRole('heading', { level: 1, name: /Backend, web, mobile/i }),
  ).toBeVisible()
  const dock = page.getByRole('navigation', { name: 'Primary navigation' })
  await expect(dock).toBeVisible()
  await expectNoHorizontalOverflow(page)

  await page.screenshot({ path: 'artifacts/e2e-landing-mobile.png' })

  await dock.getByRole('link', { name: 'About' }).click()
  await expect(page).toHaveURL(/\/about$/)
  await expect(
    page.getByRole('heading', { level: 1, name: 'Adrian Medina' }),
  ).toBeVisible()
  await expect(dock).toBeVisible()
  await expectNoHorizontalOverflow(page)

  await dock.getByRole('link', { name: 'Projects' }).click()
  await expect(page).toHaveURL(/\/projects$/)
  await expect(
    page.getByRole('heading', { level: 1, name: 'Projects' }),
  ).toBeVisible()
  await expect(
    page.locator('main [data-project-slug] > a'),
  ).toHaveCount(3)
  await expectNoHorizontalOverflow(page)
  await waitForImages(page)
  await page.screenshot({ path: 'artifacts/e2e-projects-mobile.png' })
})

test('project detail pages carry the real links and keep the hobby separate', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })

  await page.goto('/projects/magilas')
  await expect(
    page.getByRole('heading', { level: 1, name: 'MAGILAS' }),
  ).toBeVisible()
  await expect(
    page.getByRole('link', { name: 'All projects' }),
  ).toHaveAttribute('href', '/projects')
  await expect(
    page.getByRole('link', { name: 'Visit Magilas Gym' }),
  ).toHaveAttribute('href', 'https://magilasgym.com/')
  await expect(page.getByText(/public Magilas Gym site/i)).toBeVisible()
  await expectNoHorizontalOverflow(page)

  await page.goto('/projects/healthya-sat')
  await expect(
    page.getByRole('heading', { level: 1, name: 'HEALTHYASAT' }),
  ).toBeVisible()
  await expect(
    page.getByRole('link', { name: 'Visit HealthyaSat' }),
  ).toHaveAttribute('href', 'https://healthyasat.fit/')

  await page.goto('/projects/iahbrary')
  await expect(
    page.getByRole('heading', { level: 1, name: 'IAHBRARY' }),
  ).toBeVisible()
  await expect(
    page.getByRole('link', { name: 'View the code' }),
  ).toHaveAttribute(
    'href',
    'https://github.com/medinaadrianpanlilio-design/iahbrary',
  )

  await page.goto('/projects/skysprout')
  await expect(page.getByText('Hobby project', { exact: true })).toBeVisible()
  await expect(
    page.getByRole('link', { name: 'Play on Roblox' }),
  ).toHaveAttribute(
    'href',
    'https://www.roblox.com/games/117628058304479',
  )
  await expect(page.getByText(/Roblox account may be required/i)).toBeVisible()
  await expect(
    page.locator('main').getByRole('link', { name: 'View the code' }),
  ).toHaveAttribute(
    'href',
    'https://github.com/medinaadrianpanlilio-design/skysprout-public',
  )

  await expectNoHorizontalOverflow(page)
})

test('about page exposes skills, education, contact, LinkedIn, and hash anchors', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/about#skills')

  await expect(
    page.getByRole('heading', { level: 1, name: 'Adrian Medina' }),
  ).toBeVisible()
  await expect(page.locator('#skills')).toBeVisible()
  await expect(
    page.getByRole('link', { name: 'medinaadrianpanlilio@gmail.com' }),
  ).toHaveAttribute('href', 'mailto:medinaadrianpanlilio@gmail.com')
  await expect(
    page.locator('#contact').getByRole('link', { name: 'GitHub' }),
  ).toHaveAttribute(
    'href',
    'https://github.com/medinaadrianpanlilio-design',
  )
  await expect(
    page.locator('#contact').getByRole('link', { name: 'LinkedIn' }),
  ).toHaveAttribute('href', linkedin)
  await expect(page.getByText('Pampanga, Philippines')).toBeVisible()
  await expectNoHorizontalOverflow(page)

  await expect(
    page.getByRole('link', { name: 'Skills', exact: true }),
  ).toHaveAttribute('aria-current', 'page')
})

test('accessibility: no critical or serious axe violations at desktop and mobile', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/')
  await page.waitForTimeout(300)
  const landingResults = await new AxeBuilder({ page }).analyze()
  expect(
    landingResults.violations.filter((violation) =>
      ['critical', 'serious'].includes(violation.impact ?? ''),
    ),
  ).toEqual([])

  await page.goto('/projects')
  await waitForImages(page)
  await page.waitForTimeout(300)
  const projectsResults = await new AxeBuilder({ page }).analyze()
  expect(
    projectsResults.violations.filter((violation) =>
      ['critical', 'serious'].includes(violation.impact ?? ''),
    ),
  ).toEqual([])

  await page.goto('/about')
  await page.waitForTimeout(300)
  const aboutResults = await new AxeBuilder({ page }).analyze()
  expect(
    aboutResults.violations.filter((violation) =>
      ['critical', 'serious'].includes(violation.impact ?? ''),
    ),
  ).toEqual([])

  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.waitForTimeout(300)
  const mobileResults = await new AxeBuilder({ page }).analyze()
  expect(
    mobileResults.violations.filter((violation) =>
      ['critical', 'serious'].includes(violation.impact ?? ''),
    ),
  ).toEqual([])
})
