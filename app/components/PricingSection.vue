<script setup lang="ts">
import { IconArrowUpRight, IconCheck } from '@tabler/icons-vue'
import { inviteUrl, planFeatures, plans } from '~~/shared/content'
</script>

<template>
	<section id="pricing" class="pricing-section shell" aria-labelledby="pricing-title">
		<div class="section-heading" data-reveal>
			<div>
				<h2 id="pricing-title">Pricing</h2>
			</div>
			<p class="section-description muted">
				All features included. Plans differ only by number of games watched.
			</p>
		</div>
		<div class="pricing-grid">
			<article
				v-for="plan in plans"
				:key="plan.name"
				class="plan"
				:class="{ 'plan-extra': plan.name === 'Extra' }"
				data-reveal
			>
				<div class="plan-top">
					<h3>{{ plan.name }}</h3>
					<span class="plan-badge">{{ plan.available ? 'AVAILABLE NOW' : 'COMING SOON' }}</span>
				</div>
				<p class="plan-price">£{{ plan.price }}<span>/ month</span></p>
				<p class="micro muted">Per Discord server</p>
				<p class="plan-games">
					Watch <strong>{{ plan.games }} {{ plan.games === 1 ? 'game' : 'games' }}</strong>
				</p>
				<a v-if="plan.available" :href="inviteUrl" class="button button-outline"
					>Add to Discord <IconArrowUpRight :size="20" aria-hidden="true" /></a
				><button v-else type="button" disabled class="button button-disabled">Coming Soon</button>
				<ul class="plan-features">
					<li v-for="feature in planFeatures" :key="feature">
						<IconCheck class="purple" :size="18" aria-hidden="true" />{{ feature }}
					</li>
				</ul>
			</article>
		</div>
		<p class="pricing-note micro muted">
			Each watch pairs a Twitch game category with a Discord channel. Extra and Plus are planned.
			Purchases are not available yet.
		</p>
	</section>
</template>
