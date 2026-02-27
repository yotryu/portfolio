<script lang="ts">
	import type { PageProps } from './$types';

	// state
	let innerWidth = $state(0);
	let innerHeight = $state(0);
	let isPortrait = $derived(innerWidth <= innerHeight);
	let chunkClass = $derived(isPortrait ? "chunk-portrait" : "chunk");

	let expandBottom = $state(true);

	let { data }: PageProps = $props();

	let chunkHeight = $derived((40 / (data && data.aspect ? data.aspect : 1)).toString(10) + "em");
</script>


<!-- Bind innerWidth and innerHeight so we can pick layout based on aspect ratio -->
<svelte:window bind:innerWidth bind:innerHeight />

<div class="outer-container">
	<div class={chunkClass} style="height: {chunkHeight};">
		{#if data.previewVideo}
			<video class="background-fill" autoplay muted loop>
				<source src={data.previewVideo} type="video/mp4">
				Your browser does not support the video tag.
			</video>
		{:else if data.previewImage}
			<img class="background-fill" src={data.previewImage} alt=""/>
		{/if}
		<div class="content">
			<div class="top">
				<h2 class="title">{data.title}</h2>
				<p class="subtitle">{data.subtitle}</p>
			</div>

			<div class="bottom">
				{#if expandBottom}
					<div class="bottom-content">
						{#each data.descriptionParagraphs as para}
						<p class="body-text">{para}</p>
						{/each}
					</div>
				{/if}
				<button class="small-button right" onclick={() => expandBottom = !expandBottom}>{expandBottom ? "▼" : "▲"}</button>
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
		display: grid;
		place-items: center;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 10;
	}

	.chunk, .chunk-portrait {
		font-family: "Fira-Regular";
		color: azure;
		border-radius: 12px;
		/* border: 1px solid #2C7; */
		/* padding: 0.5em 1em 1em 1em; */
		background-color: #0008;
		/* text-align: center; */
		width: 40em;
		max-height: 50em;
		overflow: hidden;
		position: relative;
	}

	.chunk-portrait {
		width: calc(100% - 2em);
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
		padding: 0 1em;
		border-radius: 12px;
		width: 3em;
		height: 2em;
	}

	.small-button:hover {
		background-color: #333A;
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
		margin-bottom: 2em;
	}

	.background-fill {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		z-index: -1;
	}

	.body-text {
		font-family: "Fira-ExtraLight";
		font-size: smaller;
		color: #BBB;
	}
</style>