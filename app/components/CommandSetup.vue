<script setup lang="ts">
import { IconHash } from '@tabler/icons-vue'
import { commandTypingFrame } from '~~/shared/command-typing'

const props = defineProps<{ elapsed: number }>()
const frame = computed(() => commandTypingFrame(props.elapsed))
const matchingInput = computed(() =>
	(frame.value.channel ? frame.value.channelValue : frame.value.categoryValue).toUpperCase(),
)
</script>

<template>
	<div class="command-setup" aria-label="Mock command setup">
		<div v-if="frame.suggestions.length && !frame.submitted" class="mock-autocomplete">
			<p class="autocomplete-heading">OPTIONS MATCHING {{ matchingInput }}</p>
			<ul :aria-label="frame.channel ? 'Mock channel suggestions' : 'Mock category suggestions'">
				<li
					v-for="(suggestion, index) in frame.suggestions"
					:key="suggestion"
					:class="{ highlighted: index === 0 }"
				>
					<IconHash v-if="frame.channel" :size="18" aria-hidden="true" />
					{{ suggestion }}
				</li>
			</ul>
		</div>
		<div class="mock-composer typing-composer">
			<span class="typed-command">
				<span class="command-name"
					>{{ frame.fieldsReady ? '/add-stream-channel' : frame.text
					}}<span v-if="!frame.fieldsReady" class="typing-caret" aria-hidden="true"
				/></span>
				<template v-if="frame.fieldsReady">
					{{ ' '
					}}<span class="command-field" :class="{ active: !frame.channel }"
						><span class="field-label">category:</span>{{ frame.categoryValue
						}}<span v-if="!frame.channel" class="typing-caret" aria-hidden="true" /></span
					>{{ ' '
					}}<span class="command-field" :class="{ active: frame.channel }"
						><span class="field-label">channel:</span>{{ frame.channelValue
						}}<span
							v-if="frame.channel && !frame.submitted"
							class="typing-caret"
							aria-hidden="true"
					/></span>
				</template>
			</span>
			<!-- Reserve the widest command layout before its fields appear. -->
			<span class="command-layout-reserve" aria-hidden="true">
				<span class="command-name">/add-stream-channel</span>
				<span class="command-field-reserve"
					><span class="field-label">category:</span>Trackmania<span class="typing-caret"
				/></span>
				<span class="command-field-reserve"
					><span class="field-label">channel:</span>#streams<span class="typing-caret"
				/></span>
			</span>
		</div>
	</div>
</template>
