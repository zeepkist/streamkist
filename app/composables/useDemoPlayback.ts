import type { Ref } from 'vue'
import { computed, onMounted, onUnmounted, shallowRef, watch } from 'vue'
import { setupDuration } from '~~/shared/command-typing'
import { canAdvance, nextStage } from '~~/shared/playback'

export function useDemoPlayback(element: Ref<HTMLElement | null>) {
	// Render a complete live example before hydration and when JavaScript is disabled.
	const stage = shallowRef(2)
	const paused = shallowRef(false)
	const visible = shallowRef(false)
	const hidden = shallowRef(false)
	const reducedMotion = shallowRef(false)
	const ready = shallowRef(false)
	const elapsed = shallowRef(0)
	const setupElapsed = computed(() => (reducedMotion.value ? setupDuration : elapsed.value))
	let started = false
	let timer: ReturnType<typeof setTimeout> | undefined
	let observer: IntersectionObserver | undefined
	let media: MediaQueryList | undefined
	let lastTick = 0
	const playing = computed(
		() =>
			ready.value &&
			canAdvance({
				stage: stage.value,
				paused: paused.value,
				visible: visible.value,
				hidden: hidden.value,
				reducedMotion: reducedMotion.value,
			}),
	)
	function stop() {
		clearTimeout(timer)
		timer = undefined
	}
	function schedule() {
		stop()
		if (!playing.value) return
		lastTick = performance.now()
		function tick() {
			const now = performance.now()
			elapsed.value += now - lastTick
			lastTick = now
			if (elapsed.value >= (stage.value === 0 ? setupDuration : 4000)) {
				stage.value = nextStage(stage.value)
			} else {
				timer = setTimeout(tick, 40)
			}
		}
		timer = setTimeout(tick, 40)
	}
	function visibility() {
		hidden.value = document.hidden
	}
	function motion() {
		reducedMotion.value = media?.matches ?? false
	}
	function replay() {
		stage.value = 0
		elapsed.value = 0
		paused.value = false
		schedule()
	}
	function select(index: number) {
		stage.value = index
		paused.value = true
		if (index === 0) elapsed.value = setupDuration
	}
	watch(
		stage,
		() => {
			elapsed.value = 0
		},
		{ flush: 'sync' },
	)
	watch([playing, stage], schedule)
	onMounted(() => {
		media = window.matchMedia('(prefers-reduced-motion: reduce)')
		motion()
		visibility()
		media.addEventListener('change', motion)
		document.addEventListener('visibilitychange', visibility)
		observer = new IntersectionObserver(
			([entry]) => {
				visible.value = entry?.isIntersecting ?? false
				if (visible.value && !started) {
					started = true
					if (!reducedMotion.value) stage.value = 0
				}
			},
			{ threshold: 0.25 },
		)
		if (element.value) observer.observe(element.value)
		ready.value = true
	})
	onUnmounted(() => {
		stop()
		observer?.disconnect()
		media?.removeEventListener('change', motion)
		document.removeEventListener('visibilitychange', visibility)
	})
	return { stage, paused, reducedMotion, ready, playing, replay, select, setupElapsed }
}
