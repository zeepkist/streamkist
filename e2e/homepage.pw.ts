import { expect, test } from '@playwright/test'
import { categorySuggestions, setupDuration } from '../shared/command-typing'
import { inviteUrl } from '../shared/content'

test('homepage hydrates, loads DINish, and keeps purchases disabled', async ({ page }) => {
	const errors: string[] = []
	page.on('pageerror', (error) => errors.push(error.message))
	page.on('console', (message) => {
		if (message.type() === 'warning' && /hydration/i.test(message.text()))
			errors.push(message.text())
	})
	await page.goto('/')
	await expect(page.getByRole('heading', { level: 1 })).toContainText('Your games.')
	await expect(page.getByRole('button', { name: 'Coming Soon', exact: true })).toHaveCount(2)
	for (const button of await page.getByRole('button', { name: 'Coming Soon', exact: true }).all())
		await expect(button).toBeDisabled()
	for (const link of await page.getByRole('link', { name: /Add.*Discord/ }).all())
		await expect(link).toHaveAttribute('href', inviteUrl)
	await page.evaluate(() => document.fonts.ready)
	expect(await page.evaluate(() => document.fonts.check('16px DINish'))).toBe(true)
	const contrast = await page.locator('.site-header .button').evaluate((element) => {
		const style = getComputedStyle(element)
		const luminance = (color: string) => {
			const channels = (color.match(/[\d.]+/g) ?? []).slice(0, 3).map((value) => {
				const channel = Number(value) / 255
				return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
			})
			return (channels[0] ?? 0) * 0.2126 + (channels[1] ?? 0) * 0.7152 + (channels[2] ?? 0) * 0.0722
		}
		return (luminance(style.color) + 0.05) / (luminance(style.backgroundColor) + 0.05)
	})
	expect(contrast).toBeGreaterThanOrEqual(4.5)
	expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe(
		'rgb(16, 16, 25)',
	)
	await expect(page.getByRole('button', { name: 'Replay' })).toBeAttached()
	expect(errors).toEqual([])
})

test('automatic lifecycle, pause, resume, manual selection, and replay', async ({ page }) => {
	test.setTimeout(45000)
	await page.goto('/')
	await page.locator('.discord-window').scrollIntoViewIfNeeded()
	await page.getByRole('button', { name: 'Replay' }).click()
	await expect(page.getByRole('button', { name: '01 Set up' })).toHaveAttribute(
		'aria-pressed',
		'true',
	)
	await page.getByRole('button', { name: 'Pause', exact: true }).click()
	await page.waitForTimeout(4300)
	await expect(page.getByRole('button', { name: '01 Set up' })).toHaveAttribute(
		'aria-pressed',
		'true',
	)
	await page.getByRole('button', { name: 'Resume', exact: true }).click()
	await expect(page.getByRole('heading', { name: 'Channel added' })).toBeVisible({
		timeout: setupDuration + 2000,
	})
	await expect(page.locator('.stream-status')).toContainText('LIVE ON TWITCH', { timeout: 6000 })
	await expect(page.getByRole('button', { name: '04 Updated' })).toHaveAttribute(
		'aria-pressed',
		'true',
		{ timeout: 6000 },
	)
	await expect(page.locator('.card-stats')).toContainText('68')
	await expect(page.locator('.stream-status')).toContainText('STREAM FINISHED', { timeout: 6000 })
	await expect(page.locator('.mock-button')).toContainText('Visit channel')
	await expect(page.locator('.card-stats')).toContainText('Peak viewers 81')
	await page.getByRole('button', { name: '03 Live', exact: true }).click()
	await expect(page.locator('.mock-button')).toContainText('Watch stream')
	await expect(page.getByRole('button', { name: 'Resume' })).toBeVisible()
	await page.getByRole('button', { name: 'Replay' }).click()
	await expect(page.getByRole('button', { name: '01 Set up' })).toHaveAttribute(
		'aria-pressed',
		'true',
	)
})

test('offscreen and hidden tabs pause playback', async ({ page }) => {
	await page.goto('/')
	await page.locator('.discord-window').scrollIntoViewIfNeeded()
	await page.getByRole('button', { name: 'Replay' }).click()
	await page.evaluate(() =>
		window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }),
	)
	await page.waitForTimeout(4300)
	await expect(page.getByRole('button', { name: '01 Set up' })).toHaveAttribute(
		'aria-pressed',
		'true',
	)
	await page.locator('.discord-window').scrollIntoViewIfNeeded()
	await page.evaluate(() => {
		Object.defineProperty(document, 'hidden', { configurable: true, value: true })
		document.dispatchEvent(new Event('visibilitychange'))
	})
	await page.waitForTimeout(4300)
	await expect(page.getByRole('button', { name: '01 Set up' })).toHaveAttribute(
		'aria-pressed',
		'true',
	)
	await page.evaluate(() => {
		Object.defineProperty(document, 'hidden', { configurable: true, value: false })
		document.dispatchEvent(new Event('visibilitychange'))
	})
	await expect(page.getByRole('heading', { name: 'Channel added' })).toBeVisible({
		timeout: setupDuration + 2000,
	})
})

test('command typing shows categories, backspaces, and submits Zeepkist', async ({ page }) => {
	await page.goto('/')
	await page.locator('.discord-window').scrollIntoViewIfNeeded()
	await page.getByRole('button', { name: 'Replay' }).click()
	const typed = page.locator('.typed-command')
	await expect(typed).toHaveText('/add-stream-channel category:Trackmania channel:')
	await expect(page.locator('.command-field')).toHaveCount(2)
	await expect(page.locator('.command-field.active .field-label')).toHaveText('category:')
	expect(
		await page
			.locator('.command-field.active')
			.evaluate((element) => getComputedStyle(element).borderColor),
	).toBe('rgb(88, 101, 242)')
	await expect(
		page.getByRole('list', { name: 'Mock category suggestions' }).locator('li'),
	).toHaveText([...categorySuggestions])
	await expect(page.locator('.user-message')).toHaveCount(0)
	await page.getByRole('button', { name: 'Pause', exact: true }).click()
	const frozen = await typed.textContent()
	await page.waitForTimeout(500)
	await expect(typed).toHaveText(frozen ?? '')
	await page
		.locator('.mock-autocomplete')
		.evaluate((element) => element.scrollIntoView({ block: 'center', behavior: 'instant' }))
	await page.screenshot({ path: '.cache/command-autocomplete.png' })
	const viewport = page.viewportSize()
	await page.setViewportSize({ width: 390, height: 900 })
	await page
		.locator('.mock-autocomplete')
		.evaluate((element) => element.scrollIntoView({ block: 'center', behavior: 'instant' }))
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
	await page.screenshot({ path: '.cache/command-autocomplete-mobile.png' })
	if (viewport) await page.setViewportSize(viewport)
	await typed.evaluate((element) => {
		const initial = element.textContent ?? ''
		const observer = new MutationObserver(() => {
			const value = element.textContent ?? ''
			if (value.includes('category:Tra') && value.length < initial.length) {
				document.body.dataset.commandBackspaced = 'true'
				observer.disconnect()
			}
		})
		observer.observe(element, { childList: true, characterData: true, subtree: true })
	})
	await page.getByRole('button', { name: 'Resume', exact: true }).click()
	await expect(page.locator('body')).toHaveAttribute('data-command-backspaced', 'true')
	await expect(page.locator('.mock-autocomplete')).toHaveCount(0)
	await expect(typed).toHaveText('/add-stream-channel category:Zeepkist channel:')
	await expect(
		page.getByRole('list', { name: 'Mock category suggestions' }).locator('li'),
	).toHaveText(['Zeepkist'])
	await expect(page.locator('.command-field.active .field-label')).toHaveText('channel:')
	await expect(page.locator('.user-message')).toContainText('category:Zeepkist')
	await expect(page.locator('.user-message')).toContainText('channel:#streams')
	await expect(page.locator('.mock-autocomplete')).toHaveCount(0)
})

test('reduced motion keeps manual controls and native scrolling', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' })
	await page.goto('/')
	await page.locator('.discord-window').scrollIntoViewIfNeeded()
	await page.waitForTimeout(4300)
	await expect(page.getByRole('button', { name: '03 Live' })).toHaveAttribute(
		'aria-pressed',
		'true',
	)
	await expect(page.getByRole('button', { name: 'Pause', exact: true })).toHaveCount(0)
	await page.getByRole('button', { name: '05 Finished' }).click()
	await expect(page.locator('.stream-status')).toContainText('STREAM FINISHED')
	expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe(
		'auto',
	)
	await page.locator('#demo').evaluate((element) => element.scrollIntoView({ block: 'start' }))
	await page.screenshot({ path: '.cache/desktop-demo.png' })
})

test('mobile and desktop geometry has no horizontal overflow; keyboard links work', async ({
	page,
}) => {
	await page.emulateMedia({ reducedMotion: 'reduce' })
	for (const width of [320, 390, 768, 1440, 1920, 2560, 3440]) {
		await page.setViewportSize({ width, height: 900 })
		await page.goto('/')
		expect(
			await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
		).toBe(true)
		const hero = await page.locator('.hero').boundingBox()
		expect(hero?.width).toBe(width)
		if (width > 1440) {
			const shell = await page.locator('.hero > .shell').boundingBox()
			const glow = await page.locator('.hero-glow').boundingBox()
			expect(shell).not.toBeNull()
			expect(glow).not.toBeNull()
			if (!shell || !glow) throw new Error('Hero shell and glow must have layout bounds')
			expect(glow.x + glow.width).toBeGreaterThan(shell.x + shell.width)
			await page.screenshot({ path: `.cache/glow-${width}.png` })
		}
		await page.locator('.discord-window').scrollIntoViewIfNeeded()
		expect(
			await page
				.locator('.discord-window')
				.evaluate((element) => element.scrollWidth <= element.clientWidth),
		).toBe(true)
		if (width === 390) {
			await page.evaluate(() => window.scrollTo(0, 0))
			await page.screenshot({ path: '.cache/mobile-full.png', fullPage: true })
		}
		if (width === 1440) {
			await page.evaluate(() => window.scrollTo(0, 0))
			await page.screenshot({ path: '.cache/desktop-full.png', fullPage: true })
		}
	}
	await page.goto('/')
	await page.keyboard.press('Tab')
	await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused()
})

test('homepage remains useful without JavaScript', async ({ browser }) => {
	const context = await browser.newContext({ javaScriptEnabled: false })
	const page = await context.newPage()
	await page.goto('http://127.0.0.1:4173/')
	await expect(page.getByRole('heading', { level: 1 })).toContainText('Your games.')
	await expect(page.locator('.stream-card')).toContainText('LIVE ON TWITCH')
	await expect(page.locator('#commands')).toContainText('/add-stream-channel')
	await expect(page.locator('#pricing')).toContainText('£4')
	await page.getByRole('link', { name: 'Pricing', exact: true }).first().click()
	await expect(page.locator('#pricing')).toBeInViewport()
	await context.close()
})
