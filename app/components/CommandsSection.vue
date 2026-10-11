<script setup lang="ts">
import { commands } from '~~/shared/content'
</script>

<template>
	<section id="commands" class="commands-section shell" aria-labelledby="commands-title">
		<div class="section-heading" data-reveal>
			<div>
				<h2 id="commands-title">Commands</h2>
			</div>
		</div>
		<div class="command-list">
			<article v-for="command in commands" :key="command.name" class="command-row" data-reveal>
				<div class="command-copy">
					<h3>{{ command.title }}</h3>
					<p class="muted">{{ command.description }}</p>
				</div>
				<div class="command-example">
					<code>{{ command.example }}</code
					><span class="micro muted">{{ command.permission }}</span>
				</div>
			</article>
		</div>
		<p class="permissions-note muted" data-reveal>
			Give Streamkist View Channel, Send Messages, and Embed Links in your chosen channel.
		</p>
	</section>
</template>
