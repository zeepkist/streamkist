import { expect, test } from '@playwright/test'

const stats = { streams: 1250000, streamers: 1000000000, categories: 2345, guilds: 42 }
const endpoint = '**/streamkist/stats'

test('stats sit below demo, count together once, and preserve suffixes', async ({ page }) => {
	let requests = 0
	await page.route(endpoint, (route) => {
		requests++
		return route.fulfill({ json: stats })
	})
	await page.clock.install()
	await page.goto('/')
	const section = page.locator('#stats')
	const numbers = section.locator('.stat-number')
	await expect(numbers).toHaveText(['0.00M', '0.00B', '0', '0'])
	await expect(section.locator('.stat-label')).toHaveText([
		'Streams',
		'Streamers',
		'Categories',
		'Discord Servers',
	])
	expect(await section.evaluate((element) => element.previousElementSibling?.id)).toBe('demo')
	expect(await section.evaluate((element) => element.nextElementSibling?.id)).toBe('features')
	await section.scrollIntoViewIfNeeded()
	await page.clock.runFor(400)
	await expect(numbers.nth(0)).not.toHaveText('0.00M')
	await expect(numbers.nth(0)).not.toHaveText('1.25M')
	await expect(numbers.nth(0)).toHaveText(/^\d+\.\d{2}M$/)
	await expect(numbers.nth(1)).toHaveText(/^\d+\.\d{2}B$/)
	await page.clock.runFor(1600)
	await expect(numbers).toHaveText(['1.25M', '1.00B', '2,345', '42'])
	await expect(section.locator('.sr-only')).toHaveText([
		'1,250,000',
		'1,000,000,000',
		'2,345',
		'42',
	])
	await page.locator('#features').scrollIntoViewIfNeeded()
	await section.scrollIntoViewIfNeeded()
	await page.clock.runFor(100)
	await expect(numbers).toHaveText(['1.25M', '1.00B', '2,345', '42'])
	expect(requests).toBe(1)
})

test('late data waits for visibility; loading and failures retain section', async ({ page }) => {
	let release: () => void = () => {}
	const pending = new Promise<void>((resolve) => {
		release = resolve
	})
	await page.route(endpoint, async (route) => {
		await pending
		await route.fulfill({ json: stats })
	})
	await page.goto('/')
	const section = page.locator('#stats')
	await expect(section.locator('.stat-number')).toHaveText(['—', '—', '—', '—'])
	await section.scrollIntoViewIfNeeded()
	await page.locator('h1').scrollIntoViewIfNeeded()
	release()
	await expect(section.locator('.stat-number')).toHaveText(['0.00M', '0.00B', '0', '0'])
	await section.scrollIntoViewIfNeeded()
	await expect(section.locator('.stat-number')).toHaveText(['1.25M', '1.00B', '2,345', '42'])
	await page.route(endpoint, (route) => route.fulfill({ status: 503, json: {} }))
	await page.reload()
	await expect(page.locator('#stats').getByRole('status')).toHaveText('Stats unavailable')
	await expect(page.locator('#stats .stat-number')).toHaveText(['—', '—', '—', '—'])
})

test('reduced motion displays final counts offscreen and when enabled during animation', async ({
	page,
}) => {
	await page.route(endpoint, (route) => route.fulfill({ json: stats }))
	await page.emulateMedia({ reducedMotion: 'reduce' })
	await page.goto('/')
	await expect(page.locator('#stats .stat-number')).toHaveText(['1.25M', '1.00B', '2,345', '42'])
	await page.emulateMedia({ reducedMotion: 'no-preference' })
	await page.reload()
	await expect(page.locator('#stats .stat-number').first()).toHaveText('0.00M')
	await page.locator('#stats').scrollIntoViewIfNeeded()
	await expect(page.locator('#stats .stat-number').first()).not.toHaveText('0.00M')
	await page.emulateMedia({ reducedMotion: 'reduce' })
	await expect(page.locator('#stats .stat-number')).toHaveText(['1.25M', '1.00B', '2,345', '42'])
})

test('stats use four desktop columns and two mobile columns without overflow', async ({ page }) => {
	await page.route(endpoint, (route) => route.fulfill({ json: { ...stats, categories: 999999 } }))
	await page.emulateMedia({ reducedMotion: 'reduce' })
	await page.goto('/')
	await expect(page.locator('#stats')).toHaveAttribute('aria-busy', 'false')
	for (const [width, columns] of [
		[1440, 4],
		[768, 4],
		[767, 2],
		[375, 2],
		[320, 2],
	]) {
		await page.setViewportSize({ width: width ?? 1440, height: 1000 })
		const layout = await page.locator('.stats-grid').evaluate((element) => ({
			columns: getComputedStyle(element).gridTemplateColumns.split(' ').length,
			overflow: element.scrollWidth > element.clientWidth,
		}))
		expect(layout).toEqual({ columns, overflow: false })
	}
})

test('missing IntersectionObserver displays final values', async ({ page }) => {
	await page.route(endpoint, (route) => route.fulfill({ json: stats }))
	await page.addInitScript(() => {
		Reflect.deleteProperty(window, 'IntersectionObserver')
	})
	await page.goto('/')
	await expect(page.locator('#stats .stat-number')).toHaveText(['1.25M', '1.00B', '2,345', '42'])
})
