// Converts the designer's heavy source files in brand-assets/ into web-ready
// files under src/assets/ and public/. brand-assets/ is never modified.
// Run with: npm run assets
import sharp from 'sharp'
import { mkdir, copyFile, readFile, writeFile, mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { execFileSync } from 'node:child_process'
import { join, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const src = join(root, 'brand-assets')
const out = join(root, 'src', 'assets')

async function webp(input, output, width, quality = 80) {
  await mkdir(dirname(output), { recursive: true })
  const info = await sharp(input)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality, alphaQuality: 90, effort: 6 })
    .toFile(output)
  console.log(`${output.replace(root, '.')}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`)
}

// ---------------------------------------------------------------------------
// Real photos (designer: Fini). The AI studio avatars are no longer used on the site.
// HEIC is decoded with ffmpeg (applies the HEIF rotation); JPEGs are auto-oriented
// from EXIF with sharp's .rotate(). `crop` is a fraction box { left, top, width, height }.
// Every dog photo below was checked by eye; none shows anything that needs hiding.
// ---------------------------------------------------------------------------
const fini = join(src, 'About Us (Fini)')
const tmp = await mkdtemp(join(tmpdir(), 'k9-heic-'))

async function decode(input) {
  if (!/\.heic$/i.test(input)) return input
  const png = join(tmp, basename(input).replace(/\.heic$/i, '.png'))
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', input, '-frames:v', '1', png])
  return png
}

async function photo(input, output, width, { crop, quality = 78 } = {}) {
  const file = await decode(input)
  let img = sharp(file).rotate()
  if (crop) {
    const { width: w, height: h } = await sharp(await img.toBuffer()).metadata()
    img = sharp(await img.toBuffer()).extract({
      left: Math.round(crop.left * w),
      top: Math.round(crop.top * h),
      width: Math.round(crop.width * w),
      height: Math.round(crop.height * h),
    })
  }
  await mkdir(dirname(output), { recursive: true })
  const info = await img.resize({ width, withoutEnlargement: true }).webp({ quality, effort: 6 }).toFile(output)
  console.log(`${output.replace(root, '.')}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`)
}

const photos = join(out, 'photos')
// Home hero background: designed cover with both dogs (only 1264px wide at source).
await photo(join(fini, 'General Images', 'Fondo Portada Angel y Romeo.png'), join(photos, 'hero-angel-romeo.webp'), 1264, { quality: 84 })
// Final call to action: both dogs in a forest creek.
await photo(join(fini, 'General Images', 'Angel & Romeo.JPG'), join(photos, 'creek-2000.webp'), 2000)
await photo(join(fini, 'General Images', 'Angel & Romeo.JPG'), join(photos, 'creek-1000.webp'), 1000)
// Portraits (3:4) for the home teaser.
await photo(join(fini, 'Angel', 'Angel2.heic'), join(photos, 'angel-portrait.webp'), 900, { crop: { left: 0, top: 0, width: 1, height: 0.858 } })
await photo(join(fini, 'Romeo', 'Romeo2.heic'), join(photos, 'romeo-portrait.webp'), 900, { crop: { left: 0, top: 0.12, width: 1, height: 0.75 } })
// The pack (About page), 5:4.
await photo(join(fini, 'Angel', 'Angel.JPG'), join(photos, 'angel-water.webp'), 1000, { crop: { left: 0.08, top: 0, width: 0.75, height: 0.9 } })
await photo(join(fini, 'Romeo', 'Romeo.heic'), join(photos, 'romeo-grass.webp'), 1000, { crop: { left: 0.15, top: 0.1, width: 0.85, height: 0.85 } })
// Bonita.avif (sunbathing) has heavy black window bars and is only 622px; the kitten photo fits her story.
await photo(join(fini, 'Bonita', 'Bonita2.jpg'), join(photos, 'bonita.webp'), 828)
await photo(join(fini, 'Casper', 'Casper.jpg'), join(photos, 'casper.webp'), 828)
// Emma (About page).
await photo(join(fini, 'Emma', 'Emma.JPG'), join(photos, 'emma-field.webp'), 1600)
await photo(join(fini, 'Emma', 'Emma2.JPG'), join(photos, 'emma-woods.webp'), 1200)

await rm(tmp, { recursive: true, force: true })

// Decorative leaves (SVG, copied unchanged).
await mkdir(join(out, 'leaves'), { recursive: true })
for (const f of ['hoja1.svg', 'hoja2_naranja.svg', 'hoja3.svg', 'hoja4.svg']) {
  await copyFile(join(src, 'Leaf SVGs', f), join(out, 'leaves', f.replace('_naranja', '-orange').replace('hoja', 'leaf-')))
}

const pine = join(src, 'Pine Elements')
await webp(join(pine, 'pinoelemento21_0000_Layer---Pine.png'), join(out, 'pine', 'pine-branch.webp'), 560, 70)
await webp(join(pine, 'pinoelemento21_0002_Layer---Blue-Spruce.png'), join(out, 'pine', 'spruce.webp'), 560, 70)
await webp(join(pine, 'pinoelemento21_0005_Layer---Fir.png'), join(out, 'pine', 'fir.webp'), 560, 70)
await webp(join(pine, 'pinoelemento21_0010_Layer---Blue-Spruce-.png'), join(out, 'pine', 'spruce-sprig.webp'), 480, 70)
await webp(join(pine, 'pinoelemento21_0011_Layer---Pine-Cone.png'), join(out, 'pine', 'pine-cone.webp'), 300)

const patterns = join(src, 'Patterns')
// Patterns are seamless 4320px tiles; 720px keeps them crisp at the tile sizes used in CSS.
await webp(join(patterns, 'Stride_Pattern_2.png'), join(out, 'patterns', 'stride-dark.webp'), 540, 75)
await webp(join(patterns, 'Trailhead_Map_Pattern.png'), join(out, 'patterns', 'trailhead-map.webp'), 960, 65)

// SVG logos and icons are copied as-is (never redrawn).
const logos = [
  ['White', 'Horizontal'], ['White', 'Vertical'], ['White', 'Isotype'],
  ['Color', 'Horizontal'], ['Color', 'Vertical'], ['Color', 'Isotype'],
]
await mkdir(join(out, 'logo'), { recursive: true })
for (const [variant, kind] of logos) {
  const name = `K9Movement_${kind}_Logo_${variant}.svg`
  await copyFile(join(src, 'Logo', 'Vector', variant, name), join(out, 'logo', `${kind.toLowerCase()}-${variant.toLowerCase()}.svg`))
}

const icons = {
  'Dog_Training_Icon.svg': 'training',
  'Pett_Sitting_Icon.svg': 'walking',
  'Dog_Boarding_Icon.svg': 'boarding',
  'Pet_Transportation.svg': 'transport',
  'Human_Pet_Bond_Icon.svg': 'bond',
  'Discipline_Icon.svg': 'discipline',
  'Outside_Icon.svg': 'outside',
  'Location_Icon.svg': 'location',
  'Phone_Numbre_Icon.svg': 'phone',
  'Website_Icon.svg': 'website',
  'Instagram_Icon.svg': 'instagram',
}
await mkdir(join(out, 'icons'), { recursive: true })
for (const [file, name] of Object.entries(icons)) {
  await copyFile(join(src, 'Icons', 'Vector', 'Only Icon', file), join(out, 'icons', `${name}.svg`))
}

// Favicon: the isotype in brand colour, plus PNG fallbacks.
const isotype = join(src, 'Logo', 'Vector', 'Color', 'K9Movement_Isotype_Logo_Color.svg')
const pub = join(root, 'public')
await mkdir(pub, { recursive: true })
await copyFile(isotype, join(pub, 'favicon.svg'))
// Apple touch icon: white isotype on Dark Teal square
const whiteIso = await readFile(join(src, 'Logo', 'Vector', 'White', 'K9Movement_Isotype_Logo_White.svg'))
const isoPng = await sharp(whiteIso, { density: 400 }).resize({ width: 130 }).png().toBuffer()
await sharp({ create: { width: 180, height: 180, channels: 4, background: '#243F40' } })
  .composite([{ input: isoPng, gravity: 'center' }])
  .png()
  .toFile(join(pub, 'apple-touch-icon.png'))
console.log('public/apple-touch-icon.png')

// Open Graph image: vertical white logo + stride pattern on Dark Teal, 1200x630
const vertical = await readFile(join(src, 'Logo', 'Vector', 'White', 'K9Movement_Vertical_Logo_White.svg'))
const logoPng = await sharp(vertical, { density: 600 }).resize({ width: 520 }).png().toBuffer()
const stride = await sharp(join(patterns, 'Stride_Pattern_2.png')).resize(600, 600).ensureAlpha(0.18).png().toBuffer()
await sharp({ create: { width: 1200, height: 630, channels: 4, background: '#243F40' } })
  .composite([
    { input: stride, tile: true, blend: 'soft-light' },
    { input: logoPng, gravity: 'center' },
  ])
  .jpeg({ quality: 86 })
  .toFile(join(pub, 'og-image.jpg'))
console.log('public/og-image.jpg')

// The e-mail icon only exists with its "e-mail" label underneath; crop the
// viewBox to the icon (same 67-unit height as the other icons). Path untouched.
const emailSvg = await readFile(join(src, 'Icons', 'Vector', 'Text', 'e-mail_Icon_Text.svg'), 'utf8')
await writeFile(join(out, 'icons', 'email.svg'), emailSvg.replace('viewBox="0 0 74.55 91.9"', 'viewBox="0 0 74.55 67"'))
console.log('src/assets/icons/email.svg')
