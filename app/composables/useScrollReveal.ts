import { onMounted, onUnmounted } from 'vue'

export function useScrollReveal() {
	let observer: IntersectionObserver | undefined
	let media: MediaQueryList | undefined
	function enable() {
		observer?.disconnect()
		const elements = document.querySelectorAll<HTMLElement>('[data-reveal]')
		for (const element of elements) element.classList.remove('reveal-pending')
		if (media?.matches || !('IntersectionObserver' in window)) return
		observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries)
					if (entry.isIntersecting) {
						entry.target.classList.remove('reveal-pending')
						observer?.unobserve(entry.target)
					}
			},
			{ threshold: 0.08 },
		)
		for (const element of elements) {
			if (element.getBoundingClientRect().top > window.innerHeight)
				element.classList.add('reveal-pending')
			observer.observe(element)
		}
	}
	onMounted(() => {
		media = window.matchMedia('(prefers-reduced-motion: reduce)')
		media.addEventListener('change', enable)
		enable()
	})
	onUnmounted(() => {
		observer?.disconnect()
		media?.removeEventListener('change', enable)
	})
}
