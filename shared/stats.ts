export interface StreamkistStats {
	streams: number
	streamers: number
	categories: number
	guilds: number
}

export const statsLabels = [
	{ key: 'streams', label: 'Streams' },
	{ key: 'streamers', label: 'Streamers' },
	{ key: 'categories', label: 'Categories' },
	{ key: 'guilds', label: 'Discord Servers' },
] as const

const integerFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
const scales = [
	{ divisor: 1e18, suffix: 'Qi' },
	{ divisor: 1e15, suffix: 'Qa' },
	{ divisor: 1e12, suffix: 'T' },
	{ divisor: 1e9, suffix: 'B' },
	{ divisor: 1e6, suffix: 'M' },
] as const

/** Pick notation from final count so every animation frame keeps the same scale. */
export function formatStatCount(total: number, progress = 1): string {
	const value = total * Math.min(1, Math.max(0, progress))
	const scale = scales.find((candidate) => total >= candidate.divisor)
	return scale
		? `${(value / scale.divisor).toFixed(2)}${scale.suffix}`
		: integerFormat.format(value)
}
