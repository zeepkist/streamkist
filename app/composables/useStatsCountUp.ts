import type { Ref } from 'vue'
import { onMounted, onUnmounted, readonly, shallowRef, watch } from 'vue'
import type { StreamkistStats } from '~~/shared/stats'

export function useStatsCountUp(
	element: Ref<HTMLElement | null>,
	stats: Ref<StreamkistStats | null | undefined>,
) {
	const progress = shallowRef(0)
	const visible = shallowRef(false)
	const mounted = shallowRef(false)
	const instant = shallowRef(false)
	let started = false
	let frame: number | undefined
	let observer: IntersectionObserver | undefined
	let media: MediaQueryList | undefined

	function finish() {
		if (frame !== undefined) cancelAnimationFrame(frame)
		frame = undefined
		progress.value = 1
		started = true
		observer?.disconnect()
	}

	function motion() {
		instant.value = Boolean(media?.matches) || !('IntersectionObserver' in window)
		if (instant.value && stats.value) finish()
	}

	watch([mounted, visible, instant, stats], () => {
		if (!mounted.value || !stats.value) return
		if (instant.value) {
			finish()
			return
		}
		if (started || !visible.value) return
		started = true
		observer?.disconnect()
		const start = performance.now()
		function tick(now: number) {
			const elapsed = Math.min(1, Math.max(0, (now - start) / 1600))
			progress.value = 1 - (1 - elapsed) ** 3
			if (elapsed < 1) frame = requestAnimationFrame(tick)
			else finish()
		}
		frame = requestAnimationFrame(tick)
	})

	onMounted(() => {
		media = window.matchMedia('(prefers-reduced-motion: reduce)')
		motion()
		media.addEventListener('change', motion)
		if ('IntersectionObserver' in window) {
			observer = new IntersectionObserver(
				([entry]) => {
					visible.value = Boolean(entry?.isIntersecting && entry.intersectionRatio >= 0.25)
				},
				{ threshold: 0.25 },
			)
			if (element.value) observer.observe(element.value)
		}
		mounted.value = true
	})

	onUnmounted(() => {
		if (frame !== undefined) cancelAnimationFrame(frame)
		observer?.disconnect()
		media?.removeEventListener('change', motion)
	})
	return readonly(progress)
}
