import { mkdir } from 'node:fs/promises'
import { chromium } from '@playwright/test'

await mkdir('artifacts', { recursive: true })

const browser = await chromium.launch()
const errors = []
const pageErrors = []

const desktop = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
})
desktop.on('console', (message) => {
  if (message.type() === 'error') errors.push(message.text())
})
desktop.on('pageerror', (error) => pageErrors.push(error.message))
await desktop.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle' })
await desktop.waitForSelector('h1')
await desktop.waitForTimeout(2500)
await desktop.screenshot({ path: 'artifacts/hero-desktop.png' })
await desktop.screenshot({ path: 'artifacts/full-desktop.png', fullPage: true })
await desktop.locator('#work').screenshot({ path: 'artifacts/skysprout-desktop.png' })
await desktop.locator('#iahbrary').screenshot({ path: 'artifacts/iahbrary-desktop.png' })
await desktop.locator('#other-work').screenshot({ path: 'artifacts/other-work-desktop.png' })
await desktop.locator('#about').screenshot({ path: 'artifacts/about-desktop.png' })
await desktop.locator('#contact').screenshot({ path: 'artifacts/contact-desktop.png' })
await desktop.locator('#work').scrollIntoViewIfNeeded()
await desktop.evaluate(() => {
  if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
})
await desktop.screenshot({ path: 'artifacts/work-viewport.png' })
await desktop.locator('#iahbrary').scrollIntoViewIfNeeded()
await desktop.evaluate(() => {
  if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
})
await desktop.screenshot({ path: 'artifacts/iahbrary-viewport.png' })

const desktopInfo = await desktop.evaluate(() => ({
  title: document.title,
  canvas: Boolean(document.querySelector('canvas')),
  fallback: Boolean(document.querySelector('[data-testid="island-fallback"]')),
  overflow:
    document.documentElement.scrollWidth >
    document.documentElement.clientWidth + 1,
}))

const mobile = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
})
await mobile.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle' })
await mobile.waitForSelector('h1')
await mobile.waitForTimeout(1000)
await mobile.screenshot({ path: 'artifacts/hero-mobile.png' })
await mobile.screenshot({ path: 'artifacts/full-mobile.png', fullPage: true })
await mobile.locator('#work').screenshot({ path: 'artifacts/skysprout-mobile.png' })
await mobile.locator('#iahbrary').screenshot({ path: 'artifacts/iahbrary-mobile.png' })
await mobile.locator('#other-work').screenshot({ path: 'artifacts/other-work-mobile.png' })
await mobile.locator('#about').screenshot({ path: 'artifacts/about-mobile.png' })
await mobile.locator('#contact').screenshot({ path: 'artifacts/contact-mobile.png' })

const mobileInfo = await mobile.evaluate(() => ({
  canvas: Boolean(document.querySelector('canvas')),
  fallback: Boolean(document.querySelector('[data-testid="island-fallback"]')),
  overflow:
    document.documentElement.scrollWidth >
    document.documentElement.clientWidth + 1,
}))

console.log(JSON.stringify({ desktopInfo, mobileInfo, errors, pageErrors }, null, 2))
await browser.close()
