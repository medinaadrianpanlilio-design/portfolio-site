import { chromium } from '@playwright/test'

const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:5173'
const browser = await chromium.launch()
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
})

await page.goto(baseURL)
await page.evaluate(async () => {
  await document.fonts.ready
})

await page.evaluate(() => {
  document.documentElement.style.background = '#f4f2ed'
  document.body.style.margin = '0'
  document.body.style.overflow = 'hidden'
  document.body.innerHTML = `
    <div style="box-sizing: border-box; width: 1200px; height: 630px; padding: 52px 64px; background: #f4f2ed; color: #181818; font-family: 'Inter Variable', Inter, sans-serif; display: flex; flex-direction: column;">
      <div style="display: flex; justify-content: space-between; color: #716c64; font-size: 13px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;">
        <span>Adrian Medina — Software Engineer</span>
        <span>2025—2026</span>
      </div>

      <div style="margin-top: auto; font-family: 'Archivo Black', Arial, sans-serif; font-size: 96px; font-weight: 400; letter-spacing: -0.04em; line-height: 0.88; text-transform: uppercase;">
        <div>Backend,</div>
        <div>web, mobile.</div>
      </div>

      <div style="display: flex; align-items: flex-end; justify-content: space-between; gap: 32px; margin-top: 44px; padding-top: 24px; border-top: 1px solid #ddd8cf;">
        <div style="display: flex; flex-wrap: wrap; gap: 32px; font-family: 'Archivo Black', Arial, sans-serif; font-size: 23px; font-weight: 400; letter-spacing: -0.02em; line-height: 1; text-transform: uppercase;">
          <span style="color: #a65a1e;">Magilas</span>
          <span style="color: #5257d9;">HealthyaSat</span>
          <span style="color: #1f7f6b;">Iahbrary</span>
        </div>
        <div style="color: #716c64; font-size: 12px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; white-space: nowrap;">
          CS ’27 · Pampanga
        </div>
      </div>
    </div>
  `
})

await page.screenshot({
  path: 'public/images/og.jpg',
  type: 'jpeg',
  quality: 90,
})

await browser.close()
