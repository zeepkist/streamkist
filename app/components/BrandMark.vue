<script setup lang="ts">
defineProps<{ avatar?: boolean }>()
</script>

<template>
	<img
		class="brand-mark"
		:class="{ 'brand-avatar': avatar }"
		src="/favicon.avif"
		:width="avatar ? 40 : 80"
		height="40"
		alt=""
		aria-hidden="true"
	/>
</template>
