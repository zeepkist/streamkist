<script setup lang="ts">
import { IconBrandDiscord } from '@tabler/icons-vue'
import { inviteUrl } from '~~/shared/content'
</script>

<template>
	<header class="site-header">
		<div class="shell header-inner">
			<a href="#" class="wordmark" aria-label="Streamkist home"><BrandMark />Streamkist</a>
			<nav aria-label="Main navigation">
				<a href="#demo">See it live</a><a href="#commands">Commands</a
				><a href="#pricing">Pricing</a>
			</nav>
			<a :href="inviteUrl" class="button button-small button-discord"
				><IconBrandDiscord :size="20" aria-hidden="true" />Add to Discord</a
			>
		</div>
	</header>
</template>
