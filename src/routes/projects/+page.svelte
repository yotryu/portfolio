<script lang="ts">
	import { resolve } from '$app/paths';
	import Projectcard from '$lib/projectcard.svelte';
    import type { ProjectData } from '$lib/types';
	import { FullProjectData } from '$lib/projectsData';
    import { onMount } from 'svelte';

	// state
	let innerWidth = $state(0);
	let innerHeight = $state(0);
	let isPortrait = $derived(innerWidth <= innerHeight);
	let isNarrow = $derived(innerWidth * 1 <= innerHeight);
	let itemsContainerClass = $derived(isNarrow ? "items-container-portrait" : "items-container");
	let projectItemClass = $derived(isPortrait ? "project-item-portrait" : "project-item");
	let activeItemClass = $derived(isPortrait ? "active-item-portrait" : "active-item");

	const data = FullProjectData;

	let activeData: ProjectData | undefined = $state(undefined);
	
	onMount(() => {
		const activeItem = new URLSearchParams(window.location.search).get("active") || "";
		activeData = data.projects.find(i => i.id == activeItem);
	});
</script>

<!-- Bind innerWidth and innerHeight so we can pick layout based on aspect ratio -->
<svelte:window bind:innerWidth bind:innerHeight />


<div class="full">
	<!-- Project navigation list -->
	<div class={itemsContainerClass}>
		{#each data.projects as project}
			{@const greyClass = !activeData || project.id != activeData.id ? "greyscale" : ""}
			<div class={projectItemClass}>
				<button class="item-button" onclick={() => window.location.assign(resolve(`/projects`) + `?active=${project.id}`)}>
					<img class="background-fill {greyClass}" src={project.previewImage} alt=""/>
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
</div>

<!-- Active project display -->
{#if activeData}
<div class="full blur-backdrop">
	<div class={activeItemClass}>
		<Projectcard data={activeData}/>
		<button class="close-button right" onclick={() => window.location.assign(resolve('/projects'))}>X</button>
	</div>
	
</div>
{/if}


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

	.full {
		position: absolute;
		left: 0;
		top: 3.5em;
		right: 0;
		bottom: 0;
		/* padding: 0.5em; */
	}

	.blur-backdrop {
		backdrop-filter: blur(5px);
	}

	.items-container, .items-container-portrait {
		display: grid;
		grid-template-columns: auto auto auto;
		/* width: 30%; */
	}

	.items-container-portrait {
		grid-template-columns: calc(100% - 1em);
		/* width: 100%; */
	}

	.project-item, .project-item-portrait {
		font-family: "Fira-Regular";
		color: azure;
		border-radius: 12px;
		/* border: 1px solid #2C7; */
		/* padding: 0.5em 1em 1em 1em; */
		background-color: #0008;
		/* text-align: center; */
		margin: 0.5em;
		/* width: 40em; */
		height: 10em;
		overflow: hidden;
		position: relative;
	}

	.project-item-portrait {
		width: 100%
	}

	.active-item, .active-item-portrait {
		position: relative;
		/* text-align: center; */
		margin: 0.5em auto;
		max-width: 60em;
		height: calc(100% - 1em);
		z-index: 2;
	}

	.active-item-portrait {
		position: absolute;
		left: 0.5em;
		right: 0.5em;
		top: 0em;
		bottom: 0em;
		max-width: unset;
		height: unset;
	}

	.content {
		height: 100%;
		position: relative;
		margin: 0.5em;
		/* z-index: 1; */
	}

	.right {
		position: absolute;
		right: 0.5em;
		top: 0.5em;
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

	.close-button {
		font-family: "Fira-Regular";
		font-size: large;
		border: none;
		background-color: #000A;
		color: azure;
		z-index: 11;
		border-radius: 1em;
		width: 2em;
		height: 2em;
		cursor: pointer;
	}

	.close-button:hover {
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
		filter: brightness(40%);
	}

	.greyscale:hover {
		filter: brightness(100%);
	}

	.body-text {
		font-family: "Fira-ExtraLight";
		font-size: smaller;
		color: #BBB;
	}
</style>