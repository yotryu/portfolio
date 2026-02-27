<script lang="ts">
	import type { PageProps } from './$types';
	import { resolve } from '$app/paths';

	// state
	let innerWidth = $state(0);
	let innerHeight = $state(0);
	let isPortrait = $derived(innerWidth <= innerHeight);
	let projectItemClass = $derived(isPortrait ? "project-item-portrait" : "project-item");

	let { data }: PageProps = $props();
</script>

<!-- Bind innerWidth and innerHeight so we can pick layout based on aspect ratio -->
<svelte:window bind:innerWidth bind:innerHeight />


<div class="outer-container">
	{#each data.projects as project}
		<div class={projectItemClass}>
			<button class="item-button" onclick={() => window.location.assign(resolve(`/projects/${project.id}`))}>
				<img class="background-fill greyscale" src={project.previewImage} alt=""/>
			</button>

			<div class="content" inert>
				<div class="bottom">
					<div class="bottom-content">
						<h3 class="title">{project.title}</h3>
						<p class="subtitle">{project.subtitle}</p>
					</div>
				</div>
			</div>
		</div>
	{/each}
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
		place-items: start center;
	}

	.project-item, .project-item-portrait {
		font-family: "Fira-Regular";
		color: azure;
		border-radius: 12px;
		/* border: 1px solid #2C7; */
		/* padding: 0.5em 1em 1em 1em; */
		background-color: #0008;
		/* text-align: center; */
		margin-bottom: 0.5em;
		width: 40em;
		height: 10em;
		overflow: hidden;
		position: relative;
	}

	.project-item-portrait {
		width: 100%
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

	.item-button {
		border: none;
		background-color: none;
		position: absolute;
		width: 100%;
		height: 100%;
	}

	.item-button:hover {
		cursor: pointer;
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
		margin: 0.5em 0 0 0;
	}

	.subtitle {
		font-size: small;
		margin-top: 0.5em;
		font-family: "Fira-ExtraLight";
		color: #BBB;
	}

	.background-fill {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.greyscale {
		filter: brightness(50%) grayscale(100%);
	}

	.greyscale:hover {
		filter: none;
	}

	.body-text {
		font-family: "Fira-ExtraLight";
		font-size: smaller;
		color: #BBB;
	}
</style>