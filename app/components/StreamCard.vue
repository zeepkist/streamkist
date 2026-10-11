<script setup lang="ts">
import { IconExternalLink } from '@tabler/icons-vue'
import { demoStream } from '~~/shared/content'
import { finalStage } from '~~/shared/playback'

const props = defineProps<{ stage: number; streamer: string; title: string }>()
const finished = computed(() => props.stage === finalStage)
const stopped = computed(() => props.stage === 4)
const inactive = computed(() => stopped.value || finished.value)
const viewers = computed(() =>
	inactive.value ? 0 : props.stage >= 3 ? demoStream.viewers : demoStream.initialViewers,
)
const peak = computed(() => (props.stage >= 3 ? demoStream.peak : demoStream.initialViewers))
</script>

<template>
	<article
		class="stream-card"
		:class="{ finished: inactive }"
		aria-label="Example Twitch stream notification"
	>
		<div class="stream-card-section">
			<div class="stream-card-details">
				<p class="stream-status">
					{{ stopped ? 'Stopped streaming' : finished ? 'Streamed' : 'Streaming' }}
					{{ demoStream.game }} on Twitch
				</p>
				<h3>{{ props.title }}</h3>
				<p class="streamer-name">{{ props.streamer }}</p>
				<p class="card-timing">
					<strong>Time live</strong>
					{{
						inactive
							? `${stopped ? '24m' : demoStream.duration} · Finished just now`
							: 'Started 24 minutes ago'
					}}
				</p>
				<div class="card-stats">
					<span><strong>Current viewers</strong> {{ viewers }}</span
					><span><strong>Peak viewers</strong> {{ peak }}</span>
				</div>
			</div>
			<div v-if="!inactive" class="stream-preview">
				<img src="/stream-preview.avif" alt="" width="80" height="80" loading="lazy" />
			</div>
		</div>
		<span class="mock-button"
			>{{ inactive ? 'Visit channel' : 'Watch stream' }}
			<IconExternalLink :size="20" aria-hidden="true"
		/></span>
	</article>
</template>
