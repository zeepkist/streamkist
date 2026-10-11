<script setup lang="ts">
import { IconArrowDown, IconBrandDiscord } from '@tabler/icons-vue'
import { inviteUrl } from '~~/shared/content'
</script>

<template>
	<section class="hero" aria-labelledby="hero-title">
		<div aria-hidden="true" />
		<div class="shell">
			<h1 id="hero-title">
				Your games.<br /><span class="purple">Live in</span> Discord<span class="purple">.</span>
			</h1>
			<div class="hero-bottom">
				<div>
					<p class="hero-description">
						Showcase your game’s Twitch streaming community in your Discord server.
					</p>
					<p class="hero-plan">Free forever for 1 category.</p>
				</div>
				<div class="hero-actions">
					<a :href="inviteUrl" class="button button-discord"
						><IconBrandDiscord :size="20" aria-hidden="true" />Add to Discord</a
					><a href="#demo" class="text-link"
						>See how it works <IconArrowDown :size="18" aria-hidden="true"
					/></a>
				</div>
			</div>
		</div>
	</section>
</template>
