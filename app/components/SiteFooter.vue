<script setup lang="ts">
import { IconArrowUpRight } from '@tabler/icons-vue'
</script>

<template>
	<footer class="site-footer shell">
		<a href="#" class="wordmark"><BrandMark />Streamkist</a>
		<nav aria-label="Footer">
			<a href="#commands">Commands</a><a href="#pricing">Pricing</a
			><a href="https://zeepki.st"
				>ZeepCentraal <IconArrowUpRight :size="16" aria-hidden="true"
			/></a>
		</nav>
		<p class="footer-disclaimer micro muted">
			Streamkist is an independent bot. Not affiliated with Discord or Twitch.
		</p>
	</footer>
</template>
