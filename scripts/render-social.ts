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
.card{position:absolute;right:28px;top:200px;width:330px;background:#24242f;border:1px solid #9254ff70;border-left:3px solid #9254ff;border-radius:12px;padding:18px;transform:rotate(-6deg);box-shadow:0 25px 80px #0006}.section{display:flex;align-items:flex-start;gap:16px}.details{flex:1;min-width:0}.status{font-size:11px;color:#ba91ff;margin:0 0 12px}.card h2{font-size:22px;line-height:1.2;margin:0 0 8px}.username{font-size:14px;color:#d2cbdf;margin:0 0 16px}.preview{display:block;width:80px;height:80px;flex-shrink:0;object-fit:cover;border-radius:6px}.stats{font-size:11px;color:#c0bacf;line-height:1.8;margin:0}.button{display:inline-block;background:#34323f;border:1px solid #ffffff13;border-radius:4px;padding:7px 12px;font-size:12px;margin-top:12px}.url{position:absolute;left:64px;bottom:44px;font-size:18px;color:#ad9dca}
</style></head><body>
<main><header><img class="logo" src="data:image/avif;base64,${logo.toString('base64')}" alt="">Streamkist</header><h1>Your games.<br><em>Live in</em> Discord.</h1><p class="description">Showcase your game’s Twitch streaming community.</p></main>
<aside class="card"><div class="section"><div class="details"><p class="status">Streaming Zeepkist on Twitch</p><h2>Zeepkist Super League</h2><p class="username">Akane</p><p class="stats"><strong>Time live</strong> Started 24 minutes ago<br><strong>Current viewers</strong> 68<br><strong>Peak viewers</strong> 81</p></div><img class="preview" src="data:image/avif;base64,${preview.toString('base64')}" alt="" width="80" height="80"></div><span class="button">Watch stream</span></aside>
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
