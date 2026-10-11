import { readFile } from 'node:fs/promises'
import { chromium } from '@playwright/test'

// Optional asset authoring command; production builds use committed PNG.
const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL })
try {
	const page = await browser.newPage({
		viewport: { width: 1200, height: 630 },
		deviceScaleFactor: 1,
	})
	const [logo, preview] = await Promise.all([
		readFile('public/favicon.avif'),
		readFile('public/stream-preview.avif'),
	])
	await page.setContent(`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><style>
@font-face{font-family:DINish;src:url(https://cdn.zeepki.st/fonts/DINish.woff2);font-display:swap}
*{box-sizing:border-box}body{margin:0;background:#101019;color:#fff;font-family:DINish,Arial,sans-serif;width:1200px;height:630px;overflow:hidden;background-image:radial-gradient(ellipse 500px 300px at 950px 260px,#9254ff35,transparent)}
main{position:relative;z-index:1;padding:58px 64px}header{display:flex;align-items:center;gap:18px;font-size:28px;font-weight:700}.logo{width:94px;height:48px;object-fit:contain}
h1{font-size:86px;line-height:1;letter-spacing:-4px;margin:65px 0 28px;font-weight:750}em{font-style:normal;color:#9254ff}.description{font-size:22px;color:#bbb3ca;max-width:630px;line-height:1.4}
.card{position:absolute;right:-65px;top:166px;width:400px;background:#24242f;border:1px solid #9254ff70;border-left:3px solid #9254ff;border-radius:12px;padding:18px;transform:rotate(-6deg);box-shadow:0 25px 80px #0006}.status{font-size:12px;color:#ba91ff;margin:0 0 12px}.card h2{font-size:23px;line-height:1.2;margin:0 0 8px}.username{font-size:14px;color:#d2cbdf;margin:0 0 16px}.preview{display:block;width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:6px}.url{position:absolute;left:64px;bottom:44px;font-size:18px;color:#ad9dca}
</style></head><body>
<main><header><img class="logo" src="data:image/avif;base64,${logo.toString('base64')}" alt="">Streamkist</header><h1>Your games.<br><em>Live in</em> Discord.</h1><p class="description">Showcase your game’s Twitch streaming community.</p></main>
<aside class="card"><p class="status">LIVE ON TWITCH · Zeepkist</p><h2>Zeepkist Super League</h2><p class="username">FreyPlays</p><img class="preview" src="data:image/avif;base64,${preview.toString('base64')}" alt=""></aside>
<div class="url">streamkist.zeepki.st</div>
</body></html>`)
	await page.evaluate(async () => {
		await document.fonts.ready
		await Promise.all(Array.from(document.images, (image) => image.decode()))
	})
	await page.screenshot({ path: 'public/social-preview.png' })
} finally {
	await browser.close()
}
