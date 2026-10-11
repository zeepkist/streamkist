<script setup lang="ts">
import {
	IconChevronDown,
	IconHash,
	IconMoodSmile,
	IconPlayerPause,
	IconPlayerPlay,
	IconPlus,
	IconCirclePlus,
	IconRefresh,
} from '@tabler/icons-vue'
import { demoMembers, demoStages, demoStream, demoTitles, demoUsernames } from '~~/shared/content'
import { commandSubmitAt } from '~~/shared/command-typing'

const viewport = shallowRef<HTMLElement | null>(null)
const { stage, paused, reducedMotion, ready, playing, replay, select, setupElapsed } =
	useDemoPlayback(viewport)
const submitted = computed(() => stage.value > 0 || setupElapsed.value >= commandSubmitAt)
const member = shallowRef<(typeof demoMembers)[number]>(demoMembers[0])
const initial = computed(() => member.value.name.charAt(0).toUpperCase())
const avatarStyle = computed(() => ({ backgroundColor: member.value.color }))
const stream = shallowRef<{ streamer: string; title: string }>({
	streamer: demoStream.streamer,
	title: demoStream.title,
})

onMounted(() => {
	member.value = demoMembers[Math.floor(Math.random() * demoMembers.length)] ?? demoMembers[0]
	stream.value = {
		streamer: demoUsernames[Math.floor(Math.random() * demoUsernames.length)] ?? demoUsernames[0],
		title: demoTitles[Math.floor(Math.random() * demoTitles.length)] ?? demoTitles[0],
	}
})
</script>

<template>
	<section id="demo" ref="viewport" class="demo-section shell" aria-labelledby="demo-title">
		<div class="section-heading" data-reveal>
			<div>
				<h2 id="demo-title">Streamkist in <span class="purple">Discord</span></h2>
			</div>
			<p class="section-description muted">Fictional example data.</p>
		</div>
		<div class="discord-window" data-reveal>
			<aside class="discord-rail" aria-hidden="true">
				<BrandMark /><span class="server-orb">Z</span><span class="rail-line" /><span
					class="server-add"
					><IconPlus :size="24"
				/></span>
			</aside>
			<aside class="discord-sidebar" aria-label="Example server">
				<div class="server-name">
					The starting grid <IconChevronDown :size="18" aria-hidden="true" />
				</div>
				<p class="channel-label">COMMUNITY</p>
				<div class="channel muted"><IconHash :size="20" aria-hidden="true" /> general</div>
				<div class="channel active">
					<IconHash :size="20" aria-hidden="true" /> streams <span class="channel-unread" />
				</div>
				<div class="channel muted"><IconHash :size="20" aria-hidden="true" /> race-night</div>
				<div class="sidebar-bottom">
					<span class="member-avatar" :style="avatarStyle" aria-hidden="true">{{ initial }}</span
					><span
						><span class="member-name">{{ member.name }}</span
						><span class="micro muted">Online</span></span
					>
				</div>
			</aside>
			<div class="discord-chat">
				<div class="chat-header">
					<span class="chat-channel"
						><IconHash class="channel-hash" :size="22" aria-hidden="true" /> streams</span
					><span class="chat-topic">Twitch stream notifications</span
					><span class="demo-label">DEMO</span>
				</div>
				<div class="chat-body">
					<div class="channel-welcome">
						<span class="welcome-hash"><IconHash :size="30" aria-hidden="true" /></span>
						<h3>Welcome to #streams</h3>
						<p>Twitch streams for Zeepkist.</p>
					</div>
					<div class="date-separator"><span>Today</span></div>
					<div v-if="submitted" class="message user-message">
						<span class="member-avatar" :style="avatarStyle" aria-hidden="true">{{ initial }}</span>
						<div>
							<p class="message-author">{{ member.name }} <span>Today at 14:00</span></p>
							<p class="command-bubble">
								/add-stream-channel <span>category:</span>Zeepkist <span>channel:</span>#streams
							</p>
						</div>
					</div>
					<Transition name="message" mode="out-in"
						><div
							v-if="submitted"
							:key="stage < 2 ? 'confirmation' : 'card'"
							class="message bot-message"
						>
							<BrandMark />
							<div class="bot-content">
								<p class="message-author">
									Streamkist <span class="bot-tag">APP</span><span>Today at 14:00</span>
								</p>
								<div v-if="stage < 2" class="confirmation">
									<h3>Channel added</h3>
									<p>
										Now tracking <strong>Zeepkist</strong> Twitch streams in
										<strong>#streams</strong>
									</p>
									<span class="micro muted">Only you can see this · Streamkist</span>
								</div>
								<StreamCard
									v-else
									:stage="stage"
									:streamer="stream.streamer"
									:title="stream.title"
								/>
							</div></div
					></Transition>
				</div>
				<CommandSetup v-if="stage === 0 && !submitted" :elapsed="setupElapsed" />
				<div v-else class="mock-composer" aria-hidden="true">
					<IconCirclePlus :size="20" /> Message #streams<IconMoodSmile
						class="composer-end"
						:size="22"
					/>
				</div>
			</div>
		</div>
		<div v-if="ready" class="demo-controls">
			<div class="demo-stages" role="group" aria-label="Demo stage">
				<button
					v-for="(label, index) in demoStages"
					:key="label"
					type="button"
					:aria-pressed="stage === index"
					:class="{ selected: stage === index }"
					@click="select(index)"
				>
					<span class="stage-number">0{{ index + 1 }}</span
					>{{ label }}
				</button>
			</div>
			<div class="playback-controls">
				<button v-if="!reducedMotion && stage < 4" type="button" @click="paused = !paused">
					<IconPlayerPlay v-if="paused" :size="16" aria-hidden="true" />
					<IconPlayerPause v-else :size="16" aria-hidden="true" />
					{{ paused ? 'Resume' : 'Pause' }}</button
				><button type="button" @click="replay">
					Replay <IconRefresh :size="16" aria-hidden="true" />
				</button>
			</div>
		</div>
		<p class="demo-note micro muted">
			{{
				reducedMotion
					? 'Reduced motion enabled. Choose a stage to explore.'
					: playing
						? 'Demo plays automatically. Pause or select any stage.'
						: 'Example data only. No connection to Discord or Twitch.'
			}}
		</p>
	</section>
</template>
