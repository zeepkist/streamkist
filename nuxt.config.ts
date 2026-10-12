export default defineNuxtConfig({
	ssr: true,
	compatibilityDate: '2026-10-02',
	modules: ['@nuxt/ui'],
	css: ['~/assets/css/main.css'],
	devtools: { enabled: false },
	devServer: { port: 5000 },
	runtimeConfig: { public: { apiBase: 'https://backend.zeepki.st' } },
	typescript: { strict: true, tsConfig: { compilerOptions: { noUncheckedIndexedAccess: true } } },
	experimental: { entryImportMap: false },
	nitro: {
		prerender: { routes: ['/'], crawlLinks: true, autoSubfolderIndex: true, failOnError: true },
	},
	ui: { fonts: false },
	colorMode: { preference: 'dark', fallback: 'dark' },
	app: {
		head: {
			htmlAttrs: { lang: 'en' },
			title: 'Streamkist — Your games. Live in Discord.',
			meta: [
				{ name: 'theme-color', content: '#101019' },
				{
					name: 'description',
					content:
						'Bring Twitch streams for your favourite games into Discord. Live previews, viewer counts, and stream summaries. Start free with Streamkist.',
				},
				{ property: 'og:title', content: 'Streamkist — Your games. Live in Discord.' },
				{
					property: 'og:description',
					content:
						'Twitch stream notifications for your Discord community. Pick a game. Pick a channel. Start free.',
				},
				{ property: 'og:type', content: 'website' },
				{ property: 'og:url', content: 'https://streamkist.zeepki.st/' },
				{ property: 'og:image', content: 'https://streamkist.zeepki.st/social-preview.png' },
				{ property: 'og:image:width', content: '1200' },
				{ property: 'og:image:height', content: '630' },
				{ name: 'twitter:card', content: 'summary_large_image' },
			],
			link: [
				{ rel: 'canonical', href: 'https://streamkist.zeepki.st/' },
				{ rel: 'icon', type: 'image/avif', href: '/favicon.avif' },
				{
					rel: 'preload',
					as: 'font',
					type: 'font/woff2',
					href: 'https://cdn.zeepki.st/fonts/DINish.woff2',
					crossorigin: 'anonymous',
				},
			],
		},
	},
})
