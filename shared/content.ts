export const inviteUrl = 'https://discord.com/oauth2/authorize?client_id=1324441059983495240'
export const siteUrl = 'https://streamkist.zeepki.st'

export const commands = [
	{
		name: '/add-stream-channel',
		example: '/add-stream-channel category:Zeepkist channel:#streams',
		title: 'Add a watch',
		description:
			'Find a Twitch game with autocomplete and choose a text or announcement channel for stream notifications.',
		permission: 'Manage Server',
	},
	{
		name: '/show-stream-channels',
		example: '/show-stream-channels',
		title: 'Manage watches',
		description:
			'See your active watches. Select a watch to remove it. Management controls are private and expire after 30 seconds.',
		permission: 'Manage Server',
	},
	{
		name: '/ping',
		example: '/ping',
		title: 'Check bot response',
		description: 'Get a private Pong! response to check that the bot responds.',
		permission: 'Everyone',
	},
] as const

export const features = [
	{
		title: 'Twitch category watches',
		description:
			'Watch a Twitch category, not a list of names. Bring streams for your favourite game into one Discord channel.',
		icon: 'category',
	},
	{
		title: 'Live stream cards',
		description:
			'Large previews, current viewers, and observed peak viewers. Cards update as streams change, without filling your channel with repeat posts.',
		icon: 'card',
	},
	{
		title: 'Finished stream summaries',
		description:
			'Finished cards keep time live and observed peak viewers, with a link back to the Twitch channel.',
		icon: 'history',
	},
] as const

export const planFeatures = [
	'Twitch stream notifications',
	'Large stream previews',
	'Current viewer counts',
	'Observed peak viewers',
	'Updated stream cards',
	'Finished stream summaries',
	'Watch management',
] as const
export const plans = [
	{
		name: 'Free',
		price: 0,
		games: 1,
		available: true,
	},
	{
		name: 'Extra',
		price: 2,
		games: 3,
		available: false,
	},
	{
		name: 'Plus',
		price: 4,
		games: 5,
		available: false,
	},
] as const

export const demoStages = ['Set up', 'Connected', 'Live', 'Updated', 'Finished'] as const
export const demoMembers = [
	{ name: 'Emily', color: '#e4a8bd' },
	{ name: 'Charlotte', color: '#d8b6ed' },
	{ name: 'Frey', color: '#a8cde4' },
	{ name: 'Amélie', color: '#edc5a8' },
	{ name: 'Lena', color: '#b5d6ae' },
	{ name: 'Sanne', color: '#e4cf9c' },
	{ name: 'Hannah', color: '#c3b5e8' },
	{ name: 'Oliver', color: '#a4d8cf' },
	{ name: 'Harry', color: '#e7ada5' },
	{ name: 'Felix', color: '#b7cbe8' },
	{ name: 'Camille', color: '#d4c0a5' },
	{ name: 'Daan', color: '#a9d2b8' },
	{ name: 'Lukas', color: '#c7b3d9' },
	{ name: 'Louis', color: '#e4c2cc' },
	{ name: 'Bram', color: '#c8d69e' },
] as const
export const demoUsernames = [
	'CobaltRacer',
	'ToastedTyres',
	'KistAndChill',
	'DaanOnWheels',
	'PixelPaddock',
	'KerbCollector',
	'GravelGoblin',
	'CaptainCoast',
	'WaffleWheels',
	'LunaLaps',
	'FoxOnWheels',
	'BramBuilds',
	'SlightlySideways',
	'PurplePanda',
] as const
export const demoTitles = [
	'Sunday night Stream',
	'COTD',
	'Kerki',
	'Zeepkist Super League',
	'Building a level',
	'Community race night',
	'Testing workshop tracks',
	'Chasing a personal best',
	'Casual chat',
	'New tracks',
	'Finishing my latest level',
	'Weekend racing',
	'Viewer submissions',
] as const
export const demoStream = {
	streamer: demoUsernames[0],
	game: 'Zeepkist',
	title: demoTitles[0],
	initialViewers: 42,
	viewers: 68,
	peak: 81,
	duration: '2h 14m',
} as const
