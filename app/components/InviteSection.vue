<script setup lang="ts">
import { IconArrowUpRight } from '@tabler/icons-vue'
import { inviteUrl } from '~~/shared/content'
</script>

<template>
	<section class="invite-section shell" aria-labelledby="invite-title" data-reveal>
		<h2 id="invite-title">Bring your<br /><span class="purple">community together.</span></h2>
		<a :href="inviteUrl" class="button"
			>Add Streamkist to Discord <IconArrowUpRight :size="20" aria-hidden="true"
		/></a>
	</section>
</template>
