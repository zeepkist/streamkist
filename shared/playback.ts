export interface PlaybackState {
	stage: number
	paused: boolean
	visible: boolean
	hidden: boolean
	reducedMotion: boolean
}
export function canAdvance(state: PlaybackState): boolean {
	return (
		state.visible &&
		!state.hidden &&
		!state.paused &&
		!state.reducedMotion &&
		state.stage < finalStage
	)
}
export function nextStage(stage: number): number {
	return Math.min(finalStage, stage + 1)
}
import { demoStages } from './content'

export const finalStage = demoStages.length - 1
