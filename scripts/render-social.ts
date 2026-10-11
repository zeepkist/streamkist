import { readFile } from 'node:fs/promises'
import { chromium } from '@playwright/test'

// Optional asset authoring command; production builds use committed PNG.
const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL })
try {
	const page = await browser.newPage({
		viewport: { width: 1200, height: 630 },
		deviceScaleFactor: 1,
	})
	const image = (await readFile('public/stream-preview.svg')).toString('base64')
	await page.setContent(
		`<html><head><style>@font-face{font-family:DINish;src:url(https://cdn.zeepki.st/fonts/DINish.woff2)}*{box-sizing:border-box}body{margin:0;background:#101019;color:#fff;font-family:DINish,Arial,sans-serif;width:1200px;height:630px;overflow:hidden;background-image:radial-gradient(ellipse at 85% 40%,#9254ff40,transparent 65%)}main{padding:64px}header{display:flex;align-items:center;gap:16px;font-size:26px;font-weight:700}b{background:#9254ff;border-radius:12px;width:44px;height:44px;display:grid;place-items:center}h1{font-size:91px;line-height:1;letter-spacing:-5px;margin:62px 0 30px}em{font-style:normal;color:#9254ff}p{font-size:22px;color:#bbb3ca}img{position:absolute;right:-150px;top:110px;width:520px;height:380px;object-fit:cover;border:3px solid #9254ff;border-radius:14px;transform:rotate(-8deg);opacity:.65;z-index:-0}main{position:relative;z-index:1}.url{position:absolute;left:64px;bottom:44px;font-size:18px;color:#ad9dca}</style></head><body><img src="data:image/svg+xml;base64,${image}" alt=""><main><header><b>S</b>Streamkist</header><h1>Your games.<br><em>Live in</em> Discord.</h1><p>Twitch streams. Your community. One channel.</p></main><div class="url">streamkist.zeepki.st / Free to start.</div></body></html>`,
	)
	await page.evaluate(() => document.fonts.ready)
	await page.screenshot({ path: 'public/social-preview.png' })
} finally {
	await browser.close()
}
