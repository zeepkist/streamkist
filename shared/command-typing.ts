export const categorySuggestions = [
	'TrackMania',
	'TrackMania Nations',
	'TrackMania United Forever',
	'TrackMania² Canyon',
	'TrackMania Turbo',
] as const

type CommandFrame = { at: number; text: string }
const frames: CommandFrame[] = [{ at: 0, text: '' }]
let elapsed = 0
let text = ''

function type(value: string, delay: number) {
	for (const character of value) {
		elapsed += delay
		text += character
		frames.push({ at: elapsed, text })
	}
}

type('/add-stream-channel', 45)
elapsed += 250
const fieldsAt = elapsed
text += ' category:'
frames.push({ at: elapsed, text })
type('Trackmania', 100)
const trackmaniaPause = elapsed
elapsed += 1400
const trackmaniaErase = elapsed
for (let count = 0; count < 'Trackmania'.length; count++) {
	elapsed += 65
	text = text.slice(0, -1)
	frames.push({ at: elapsed, text })
}
type('Zeepkist', 100)
const zeepkistPause = elapsed
elapsed += 900
const channelTyping = elapsed
text += ' channel:'
frames.push({ at: elapsed, text })
type('#streams', 70)
const channelPause = elapsed

export const commandSubmitAt = elapsed + 500
export const setupDuration = commandSubmitAt

export function commandTypingFrame(time: number) {
	const current = frames.findLast((frame) => frame.at <= time) ?? frames[0]
	const value = current?.text ?? ''
	const fieldsReady = time >= fieldsAt
	const categoryValue = value.match(/category:(.*?)(?: channel:|$)/)?.[1] ?? ''
	const channelValue = value.split('channel:')[1] ?? ''
	const channel = fieldsReady && time >= channelTyping
	const suggestions =
		time >= channelPause && time < commandSubmitAt
			? ['#streams']
			: time >= trackmaniaPause && time < trackmaniaErase
				? categorySuggestions
				: time >= zeepkistPause && time < channelTyping
					? ['Zeepkist']
					: []
	return {
		text: fieldsReady
			? `/add-stream-channel category:${categoryValue} channel:${channelValue}`
			: value,
		fieldsReady,
		categoryValue,
		channelValue,
		suggestions,
		channel,
		submitted: time >= commandSubmitAt,
	}
}
