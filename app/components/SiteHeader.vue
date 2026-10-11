<script setup lang="ts">
import { IconArrowUpRight } from '@tabler/icons-vue'
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
			<a :href="inviteUrl" class="button button-small"
				>Add to Discord <IconArrowUpRight :size="20" aria-hidden="true"
			/></a>
		</div>
	</header>
</template>
