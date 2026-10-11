export interface PlaybackState {
	stage: number
	paused: boolean
	visible: boolean
	hidden: boolean
	reducedMotion: boolean
}
export function canAdvance(state: PlaybackState): boolean {
	return state.visible && !state.hidden && !state.paused && !state.reducedMotion && state.stage < 4
}
export function nextStage(stage: number): number {
	return Math.min(4, stage + 1)
}
