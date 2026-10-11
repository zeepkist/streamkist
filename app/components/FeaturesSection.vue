<script setup lang="ts">
import { IconCategory, IconHistory, IconLayoutCards } from '@tabler/icons-vue'
import { features } from '~~/shared/content'

const featureIcons = { category: IconCategory, card: IconLayoutCards, history: IconHistory }
</script>

<template>
	<section id="features" class="features-section shell" aria-labelledby="features-title">
		<div class="section-heading" data-reveal>
			<div>
				<h2 id="features-title">Features</h2>
			</div>
		</div>
		<div class="feature-grid">
			<article v-for="feature in features" :key="feature.icon" class="feature" data-reveal>
				<div class="feature-top">
					<component :is="featureIcons[feature.icon]" :size="38" :stroke="1.5" aria-hidden="true" />
				</div>
				<h3>{{ feature.title }}</h3>
				<p class="muted">{{ feature.description }}</p>
			</article>
		</div>
	</section>
</template>
