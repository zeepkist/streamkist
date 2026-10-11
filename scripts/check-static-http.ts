import { strict as assert } from 'node:assert'
import { readFile } from 'node:fs/promises'
import { inviteUrl } from '../shared/content'

const base = process.argv[2] ?? 'http://127.0.0.1:3000'
for (let attempt = 0; attempt < 20; attempt++) {
	try {
		if ((await fetch(base)).ok) break
	} catch {
		/* Wait for preview startup. */
	}
	await Bun.sleep(200)
}
const response = await fetch(base)
assert.equal(response.status, 200)
const html = await response.text()
assert(html.includes('Your games.') && html.includes(inviteUrl))
assert.match(html, /<h1[\s>]/)
for (const path of ['/missing-page/', '/_nuxt/missing.js']) {
	const missing = await fetch(base + path)
	assert.equal(missing.status, 404)
	assert.equal(missing.headers.get('cache-control'), 'no-cache')
	assert((await missing.text()).includes('Back to Streamkist'))
}
const manifest: { files: Record<string, string> } = JSON.parse(
	await readFile('.output/public/release-manifest.json', 'utf8'),
)
for (const path of Object.keys(manifest.files)) {
	const asset = await fetch(`${base}/${path}`)
	assert.equal(asset.status, 200, `Missing file: ${path}`)
	assert((await asset.arrayBuffer()).byteLength > 0, `Empty file: ${path}`)
}
console.log('HTTP verified rendered homepage, all release files, and genuine custom 404 responses.')
