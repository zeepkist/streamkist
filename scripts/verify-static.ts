import { strict as assert } from 'node:assert'
import { createHash } from 'node:crypto'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join, relative, resolve } from 'node:path'
import { commands, inviteUrl, siteUrl } from '../shared/content'

const root = resolve('.output/public')
const html = await readFile(join(root, 'index.html'), 'utf8')
assert.match(html, /<h1[\s>]/, 'Missing prerendered heading')
assert(html.includes('Your games.'), 'Missing homepage content')
assert(html.includes(inviteUrl), 'Missing invite')
assert(html.includes(`rel="canonical" href="${siteUrl}/"`), 'Missing canonical')
for (const command of commands)
	assert(html.includes(command.name), `Missing command: ${command.name}`)
assert.equal((html.match(/disabled/g) ?? []).length >= 2, true, 'Paid plans must be disabled')
assert(!html.includes('/_ipx/'), 'Runtime image processing is forbidden')
assert(!html.includes('Internal Server Error'), 'Error page exported')
const styles = [...html.matchAll(/<link[^>]*rel="stylesheet"[^>]*>/g)]
	.map((match) => match[0])
	.join('')
await writeFile(
	join(root, '404.html'),
	`<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><meta name="theme-color" content="#101019"><title>Page not found — Streamkist</title>${styles}</head><body><main class="shell invite-section"><p class="error-code">404 / Page not found</p><h1 style="font-size:clamp(40px,8vw,100px);margin:40px 0">This stream took<br>a different turn.</h1><p class="muted" style="margin-bottom:30px">The page you requested could not be found.</p><a href="/" class="button">Back to Streamkist</a></main></body></html>\n`,
)
const files: Record<string, string> = {}
async function collect(directory: string) {
	for (const entry of await readdir(directory, { withFileTypes: true })) {
		const path = join(directory, entry.name)
		if (entry.isSymbolicLink()) throw new Error(`Unexpected output symlink: ${path}`)
		if (entry.isDirectory()) await collect(path)
		else if (entry.isFile() && entry.name !== 'release-manifest.json')
			files[relative(root, path).replaceAll('\\', '/')] = createHash('sha256')
				.update(await readFile(path))
				.digest('hex')
	}
}
await collect(root)
for (const asset of [
	'favicon.avif',
	'stream-preview.avif',
	'social-preview.png',
	'robots.txt',
	'sitemap.xml',
	'404.html',
])
	assert(files[asset], `Missing asset: ${asset}`)
assert(
	Object.keys(files).some((path) => path.startsWith('_nuxt/')),
	'Missing client assets',
)
await writeFile(
	join(root, 'release-manifest.json'),
	`${JSON.stringify({ formatVersion: 1, revision: process.env.GITHUB_SHA ?? 'local', generatedAt: new Date().toISOString(), routes: ['/'], files }, null, 2)}\n`,
)
console.log(`Verified static homepage, 404, and ${Object.keys(files).length} release files.`)
