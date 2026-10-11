<script setup lang="ts">
import { IconExternalLink } from '@tabler/icons-vue'
import { demoStream } from '~~/shared/content'

const props = defineProps<{ stage: number; streamer: string; title: string }>()
const finished = computed(() => props.stage === 4)
const viewers = computed(() =>
	finished.value ? 0 : props.stage === 3 ? demoStream.viewers : demoStream.initialViewers,
)
const peak = computed(() => (props.stage >= 3 ? demoStream.peak : demoStream.initialViewers))
</script>

<template>
	<article
		class="stream-card"
		:class="{ finished }"
		aria-label="Example Twitch stream notification"
	>
		<p class="stream-status">
			<span class="signal-dot" />{{ finished ? 'STREAM FINISHED' : 'LIVE ON TWITCH' }}
			<span>· {{ demoStream.game }}</span>
		</p>
		<h3>{{ props.title }}</h3>
		<p class="streamer-name">{{ props.streamer }}</p>
		<p class="card-timing">
			<strong>Time live</strong>
			{{ finished ? `${demoStream.duration} · Finished just now` : 'Started 24 minutes ago' }}
		</p>
		<div class="card-stats">
			<span><strong>Current viewers</strong> {{ viewers }}</span
			><span><strong>Peak viewers</strong> {{ peak }}</span>
		</div>
		<div class="stream-preview">
			<img
				src="/stream-preview.avif"
				alt="Placeholder video preview for fictional Twitch stream"
				width="1280"
				height="720"
				loading="lazy"
			/>
		</div>
		<span class="mock-button"
			>{{ finished ? 'Visit channel' : 'Watch stream' }}
			<IconExternalLink :size="20" aria-hidden="true"
		/></span>
		<p class="card-disclaimer">Streamkist</p>
	</article>
</template>
