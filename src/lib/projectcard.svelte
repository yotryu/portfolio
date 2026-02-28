<script lang="ts">
	import type { ProjectData } from "./types";
	import enterFullscreen from '$lib/assets/fullscreen_icon.svg';
	import exitFullscreen from '$lib/assets/exit_fullscreen_icon.svg';

	// state
	let innerWidth = $state(0);
	let innerHeight = $state(0);
	let isPortrait = $derived(innerWidth <= innerHeight);
	let chunkClass = $derived(isPortrait ? "chunk-portrait" : "chunk");

	let expandBottom = $state(true);

	let { data }: { data: ProjectData } = $props();

	let chunkHeight = $derived((40 / (data && data.aspect ? data.aspect : 1)).toString(10) + "em");
	let descriptionParagraphs = $derived(data.description.split("\n"));
</script>


<!-- Bind innerWidth and innerHeight so we can pick layout based on aspect ratio -->
<svelte:window bind:innerWidth bind:innerHeight />

<div class="outer-container">
	<div class={chunkClass}>
		{#if data.previewVideo}
			<video class="background-fill {expandBottom ? "low-brightness" : ""}" autoplay muted loop>
				<source src={data.previewVideo} type="video/mp4">
				Your browser does not support the video tag.
			</video>
		{:else if data.previewImage}
			<img class="background-fill {expandBottom ? "low-brightness" : ""}" src={data.previewImage} alt=""/>
		{/if}
		<div class="content">
			{#if expandBottom}
				<div class="top">
					<h2 class="title">{data.title}</h2>
					<p class="subtitle">{data.subtitle}</p>

					{#if data.tags && data.tags.length > 0}
						<div class="tag-container">
							{#each data.tags as tag}
								<button class="tag-button" onclick={() => tag.url ? window.open(tag.url) : {}}>{tag.text}</button>
							{/each}
						</div>
					{/if}
				</div>
			{/if}

			<div class="bottom">
				{#if expandBottom}
					<div class="bottom-content">
						{#each descriptionParagraphs as para}
						<p class="body-text">{para}</p>
						{/each}
					</div>
				{/if}
				<button class="small-button right" onclick={() => expandBottom = !expandBottom}>
					<img class="button-image" src={expandBottom ? enterFullscreen : exitFullscreen} alt=""/>
				</button>
			</div>
		</div>
	</div>
</div>

<style>
	@font-face {
		font-family: Fira-ExtraLight;
		src: url(/FiraSans-ExtraLight.ttf);
	}
	@font-face {
		font-family: Fira-Regular;
		src: url(/FiraSans-Regular.ttf);
	}

	.outer-container {
		/* display: grid; */
		/* place-items: center; */
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 10;
	}

	.blur-backdrop {
		backdrop-filter: blur(5px);
	}

	.chunk, .chunk-portrait {
		font-family: "Fira-Regular";
		color: azure;
		border-radius: 12px;
		/* border: 1px solid #2C7; */
		/* padding: 0.5em 1em 1em 1em; */
		background-color: #0008;
		/* text-align: center; */
		/* width: 40em; */
		/* max-height: 50em; */
		height: 100%;
		overflow: hidden;
		position: relative;
	}

	.chunk-portrait {
		/* width: calc(100% - 2em); */
	}

	.content {
		height: 100%;
		position: relative;
		margin: 0.5em;
		z-index: 1;
	}

	.right {
		position: absolute;
		right: 0;
		bottom: 0;
	}

	.small-button {
		font-size: normal;
		border: none;
		color: azure;
		vertical-align: middle;
		background-color: #000A;
		padding: 6px 6px 2px 6px;
		border-radius: 12px;
		/* width: 3em; */
		/* height: 2em; */
	}

	.small-button:hover {
		background-color: #333A;
	}

	.button-image {
		width: 32px;
		height: 32px;
		object-fit: contain;
	}

	.bottom {
		margin-top: auto;
		position: absolute;
		left: 0;
		right: 0;
		bottom: 1em;
	}

	.bottom-content {
		background-color: #000A;
		padding: 1px 1em;
		border-radius: 12px;
	}

	.top {
		margin: 0 0.5em;
	}

	.title {
		margin: 0.3em 0 0 0;
	}

	.subtitle {
		font-size: small;
		margin-top: 0.5em;
		/* margin-bottom: 2em; */
	}

	.tag-button {
		border-radius: 6px;
		border: 1px solid #DDFA;
		background-color: #000A;
		color: azure;
		font-family: "Fira-ExtraLight";
		margin-right: 0.5em;
		padding: 2px 8px;
	}

	.tag-button:hover {
		cursor: pointer;
		background-color: #777A;
	}

	.background-fill {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	.low-brightness {
		filter: brightness(50%);
		object-fit: cover;
	}

	.body-text {
		font-family: "Fira-ExtraLight";
		font-size: smaller;
		color: #BBB;
	}
</style>