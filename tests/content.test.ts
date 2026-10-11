import { describe, expect, test } from 'bun:test'
import { commandSubmitAt, commandTypingFrame, setupDuration } from '../shared/command-typing'
import { commands, inviteUrl, planFeatures, plans } from '../shared/content'
import { canAdvance, nextStage } from '../shared/playback'

describe('public content contracts', () => {
	test('preserves bot command names and permissions', () => {
		expect(commands.map((command) => command.name)).toEqual([
			'/add-stream-channel',
			'/show-stream-channels',
			'/ping',
		])
		expect(commands[0].example).toBe('/add-stream-channel category:Zeepkist channel:#streams')
		expect(commands.map((command) => command.permission)).toEqual([
			'Manage Server',
			'Manage Server',
			'Everyone',
		])
	})
	test('preserves plan prices, category quotas, and concurrent stream limits', () => {
		expect(plans.map((plan) => [plan.name, plan.price, plan.games, plan.available])).toEqual([
			['Free', 0, 1, true],
			['Extra', 2, 3, false],
			['Plus', 4, 5, false],
		])
		expect(planFeatures).toHaveLength(6)
		expect(plans.map((plan) => plan.concurrentStreams)).toEqual([15, 30, 30])
		expect(new URL(inviteUrl).searchParams.get('client_id')).toBe('1324441059983495240')
	})
})
describe('demo progression', () => {
	test('setup types, deletes the first category, then submits the intended watch', () => {
		const frames = Array.from({ length: setupDuration + 1 }, (_, time) => commandTypingFrame(time))
		expect(frames.find((frame) => frame.fieldsReady)).toMatchObject({
			text: '/add-stream-channel category: channel:',
			categoryValue: '',
			channelValue: '',
			channel: false,
		})
		const trackmania = frames.findIndex((frame) => frame.categoryValue === 'Trackmania')
		expect(trackmania).toBeGreaterThan(0)
		expect(frames.slice(trackmania).some((frame) => frame.categoryValue === 'Trackmani')).toBe(true)
		const zeepkist = frames.findIndex((frame) => frame.categoryValue === 'Zeepkist')
		expect(zeepkist).toBeGreaterThan(trackmania)
		expect([
			...new Set(frames.filter((frame) => frame.suggestions.length).map((frame) => frame.text)),
		]).toEqual([
			'/add-stream-channel category:Trackmania channel:',
			'/add-stream-channel category:Zeepkist channel:',
			commands[0].example,
		])
		expect(commandTypingFrame(commandSubmitAt - 1).submitted).toBe(false)
		expect(commandTypingFrame(setupDuration)).toMatchObject({
			text: commands[0].example,
			submitted: true,
		})
	})
	const active = { stage: 0, paused: false, visible: true, hidden: false, reducedMotion: false }
	test('advances through category stop, return, and terminal finish', () => {
		expect(canAdvance(active)).toBe(true)
		expect([0, 1, 2, 3, 4, 5, 6].map(nextStage)).toEqual([1, 2, 3, 4, 5, 6, 6])
		expect(canAdvance({ ...active, stage: 4 })).toBe(true)
		expect(canAdvance({ ...active, stage: 6 })).toBe(false)
	})
	test('pauses for user choice, offscreen, hidden tab, and reduced motion', () => {
		for (const change of [
			{ paused: true },
			{ visible: false },
			{ hidden: true },
			{ reducedMotion: true },
		])
			expect(canAdvance({ ...active, ...change })).toBe(false)
	})
})
