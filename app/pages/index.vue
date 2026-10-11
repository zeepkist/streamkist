<script setup lang="ts">
useScrollReveal()
</script>

<template>
	<div>
		<a class="skip-link" href="#main">Skip to content</a>
		<SiteHeader />
		<main id="main" tabindex="-1">
			<HeroSection />
			<DiscordDemo />
			<FeaturesSection />
			<CommandsSection />
			<PricingSection />
			<InviteSection />
		</main>
		<SiteFooter />
	</div>
</template>
