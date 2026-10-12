import { describe, expect, test } from 'bun:test'
import { formatStatCount, statsLabels } from '../shared/stats'

describe('historical stats presentation', () => {
	test('keeps requested order and labels', () => {
		expect(statsLabels.map(({ label }) => label)).toEqual([
			'Streams',
			'Streamers',
			'Categories',
			'Discord Servers',
		])
	})
	test.each([
		[0, '0'],
		[1, '1'],
		[1234, '1,234'],
		[999999, '999,999'],
		[1000000, '1.00M'],
		[1234567, '1.23M'],
		[1250000, '1.25M'],
		[999999999, '1000.00M'],
		[1000000000, '1.00B'],
		[1000000000000, '1.00T'],
		[1000000000000000, '1.00Qa'],
	])('formats %s as %s', (count, formatted) => {
		expect(formatStatCount(count)).toBe(formatted)
	})
	test('fixes scale using final value throughout count-up', () => {
		for (const [total, suffix] of [
			[1e6, 'M'],
			[1e9, 'B'],
			[1e12, 'T'],
		] as const) {
			expect(formatStatCount(total, 0)).toBe(`0.00${suffix}`)
			expect(formatStatCount(total, 0.001)).toBe(`0.00${suffix}`)
			expect(formatStatCount(total, 0.5)).toBe(`0.50${suffix}`)
			expect(formatStatCount(total, 1)).toBe(`1.00${suffix}`)
		}
		expect(formatStatCount(999999, 0)).toBe('0')
		expect(formatStatCount(10, -1)).toBe('0')
		expect(formatStatCount(10, 2)).toBe('10')
	})
})
