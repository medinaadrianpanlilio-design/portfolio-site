import { writeFile } from 'node:fs/promises'
import { chromium } from '@playwright/test'

const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:5173'
const output = 'public/Adrian-Medina-Resume.pdf'

const browser = await chromium.launch()
const page = await browser.newPage()

await page.goto(`${baseURL}/resume`)
await page.evaluate(async () => {
  await document.fonts.ready
})

const pdf = await page.pdf({
  format: 'A4',
  printBackground: false,
  preferCSSPageSize: true,
})
await browser.close()

const pages = pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g)?.length ?? 0
if (pages !== 1) {
  console.error(`Resume is ${pages} pages; it must fit on one`)
  process.exit(1)
}

await writeFile(output, pdf)
console.log(`Wrote ${output} (${(pdf.length / 1024).toFixed(0)} KB, 1 page)`)
