<script setup lang="ts">
import type { StreamkistStats } from '~~/shared/stats'
import { formatStatCount, statsLabels } from '~~/shared/stats'

const viewport = useTemplateRef<HTMLElement>('viewport')
const config = useRuntimeConfig()
const { data, status } = useFetch<StreamkistStats>('/streamkist/stats', {
	baseURL: config.public.apiBase,
	server: false,
	lazy: true,
	watch: false,
	retry: 0,
	timeout: 10000,
})
const progress = useStatsCountUp(viewport, data)
const fullCountFormat = new Intl.NumberFormat('en-US')
const items = computed(() =>
	statsLabels.map(({ key, label }) => ({
		key,
		label,
		animated: data.value ? formatStatCount(data.value[key], progress.value) : '—',
		final: data.value ? fullCountFormat.format(data.value[key]) : 'Unavailable',
	})),
)
</script>

<template>
	<section
		id="stats"
		ref="viewport"
		class="stats-section shell"
		aria-label="Streamkist statistics"
		:aria-busy="status === 'idle' || status === 'pending'"
	>
		<dl class="stats-grid">
			<div v-for="item in items" :key="item.key" class="stat">
				<dt class="stat-label">{{ item.label }}</dt>
				<dd class="stat-value">
					<span aria-hidden="true" class="stat-number">{{ item.animated }}</span>
					<span class="sr-only">{{ item.final }}</span>
				</dd>
			</div>
		</dl>
		<p v-if="status === 'error'" class="stats-status muted" role="status">Stats unavailable</p>
	</section>
</template>

<style scoped>
.stats-section {
	padding-block: 24px 80px;
}
.stats-grid {
	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));
	gap: 36px 24px;
	margin: 0;
	padding-block: 40px;
	border-block: 1px solid var(--line);
}
.stat {
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
}
.stat-value {
	order: -1;
	margin: 0 0 12px;
	color: var(--brand);
	font-size: clamp(32px, 4.5vw, 72px);
	font-weight: 750;
	font-variant-numeric: tabular-nums;
	line-height: 1;
	letter-spacing: -0.045em;
}
.stat-label {
	color: var(--muted);
	font-size: 15px;
}
.stats-status {
	margin-top: 16px;
	text-align: center;
	font-size: 13px;
}
@media (max-width: 767px) {
	.stats-section {
		padding-bottom: 40px;
	}
	.stats-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
	.stat-value {
		font-size: clamp(32px, 8vw, 56px);
	}
}
</style>
