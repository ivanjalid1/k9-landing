// Screenshots of every page at 375px and 1440px (first screen + full page), a few
// mid-scroll shots of the home page with animations running, and an overflow check.
// Usage: start `npm run dev` (or `npm run preview`), then:
//   node scripts/screenshots.mjs [baseUrl] [outDir] [--reduced]
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const base = (process.argv[2] ?? 'http://localhost:5173').replace(/\/$/, '')
const outDir = process.argv[3] ?? 'screenshots'
const reduced = process.argv.includes('--reduced')

const pages = [
  ['home', '/'],
  ['training', '/training'],
  ['pet-care', '/pet-care'],
  ['about', '/about'],
  ['service-area', '/service-area'],
  ['faq', '/faq'],
  ['contact', '/contact'],
  ['404', '/does-not-exist'],
]
const viewports = [
  { name: 'mobile-375', width: 375, height: 812 },
  { name: 'desktop-1440', width: 1440, height: 900 },
]
const homeScrollTargets = ['#approach', '#services', '[aria-labelledby="teaser-title"]', '[aria-label="Our promise"]']

await mkdir(outDir, { recursive: true })
const browser = await chromium.launch()

async function settle(page) {
  await page.evaluate(() => document.fonts.ready)
  // Scroll through so every once-only reveal plays, then return to the top.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo({ top: y, behavior: 'instant' })
      await new Promise((r) => setTimeout(r, 140))
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  })
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(1200)
}

async function overflow(page) {
  return page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }))
}

for (const vp of viewports) {
  const page = await browser.newPage({
    viewport: { width: vp.width, height: vp.height },
    reducedMotion: reduced ? 'reduce' : 'no-preference',
  })

  for (const [name, path] of pages) {
    await page.goto(base + path, { waitUntil: 'networkidle' })
    await page.waitForTimeout(2000) // entrance animation
    await page.screenshot({ path: `${outDir}/${name}-${vp.name}.png` })

    if (name === 'home') {
      for (const [i, sel] of homeScrollTargets.entries()) {
        await page.locator(sel).first().evaluate((el) => el.scrollIntoView({ block: 'start', behavior: 'instant' }))
        await page.waitForTimeout(1600)
        await page.screenshot({ path: `${outDir}/home-${vp.name}-scroll-${i + 1}.png` })
      }
    }

    await settle(page)
    const o = await overflow(page)
    console.log(`${name} ${vp.name} title="${await page.title()}" overflow=${o.scrollWidth > o.clientWidth ? 'YES' : 'no'}`)
    await page.screenshot({ path: `${outDir}/${name}-${vp.name}-full.png`, fullPage: true })
  }
  await page.close()
}

await browser.close()
