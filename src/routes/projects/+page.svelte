<script lang="ts">
	import type { PageProps } from './$types';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import Projectcard from '$lib/projectcard.svelte';
    
    const activeItem = page.url.searchParams.get("active");

	// state
	let innerWidth = $state(0);
	let innerHeight = $state(0);
	let isPortrait = $derived(innerWidth <= innerHeight);
	let isNarrow = $derived(innerWidth * 1 <= innerHeight);
	let itemsContainerClass = $derived(isNarrow ? "items-container-portrait" : "items-container");
	let projectItemClass = $derived(isPortrait ? "project-item-portrait" : "project-item");
	let activeItemClass = $derived(isPortrait ? "active-item-portrait" : "active-item");

	let { data }: PageProps = $props();

	let activeData = $derived(data.projects.find(i => i.id == activeItem));
</script>

<!-- Bind innerWidth and innerHeight so we can pick layout based on aspect ratio -->
<svelte:window bind:innerWidth bind:innerHeight />


<div class="full">
	<!-- Project navigation list -->
	<div class={itemsContainerClass}>
		{#each data.projects as project}
			{@const greyClass = project.id != activeItem ? "greyscale" : ""}
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

	<!-- Active project display -->
	 {#if activeData}
		<div class={activeItemClass}>
			<Projectcard data={activeData}/>
		</div>
		
		{#if isNarrow}
			<button class="close-button right" onclick={() => window.location.assign(resolve('/projects'))}>X</button>
		{/if}
	{/if}
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

	.full {
		position: absolute;
		left: 0;
		top: 4.5em;
		right: 0;
		bottom: 0;
		padding: 0.5em;
	}

	.items-container, .items-container-portrait {
		width: 30%;
	}

	.items-container-portrait {
		width: 100%;
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
		/* width: 40em; */
		height: 10em;
		overflow: hidden;
		position: relative;
	}

	.project-item-portrait {
		width: 100%
	}

	.active-item, .active-item-portrait {
		position: absolute;
		left: calc(30% + 1em);
		top: 0.5em;
		right: 0.5em;
		bottom: 0.5em;
	}

	.active-item-portrait {
		left: 0.5em;
		z-index: 2;
	}

	.content {
		height: 100%;
		position: relative;
		margin: 0.5em;
		z-index: 1;
	}

	.right {
		position: absolute;
		right: 1em;
		top: 1em;
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
		filter: brightness(50%) grayscale(100%);
	}

	.greyscale:hover {
		filter: brightness(50%);
	}

	.body-text {
		font-family: "Fira-ExtraLight";
		font-size: smaller;
		color: #BBB;
	}
</style>