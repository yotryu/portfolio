<script lang="ts">
	import circleX from '$lib/assets/circle-x.svg';
	import xIcon from '$lib/assets/x.svg';
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

		const images: NodeListOf<HTMLImageElement> = document.querySelectorAll("img[data-src]");
		images.forEach((img: HTMLImageElement, index) => {
			setTimeout(() => img.src = img.dataset.src ? img.dataset.src : "", index * 100);
		});
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
					<img class="background-fill fade-in {greyClass}" loading="lazy" data-src={project.previewImage} alt="" onload={(evt) => (<HTMLElement>(evt.target)).style.opacity = "1"}/>
				</button>

				<div class="content" inert>
					{#if project.categories && project.categories.length > 0}
						<div class="tag-container">
							{#each project.categories as cat, index}
								<span class="{index == project.categories.length - 1 ? "tag-last" : "tag"}">{cat}</span>
							{/each}
						</div>
					{/if}
					
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

	<div class="footer">
		<p>All Rights to their respective owners. See details of each project for attribution info.</p>
	</div>
</div>

<!-- Active project display -->
{#if activeData}
<div class="full-overlay blur-backdrop">
	<div class="full-overlay overlay-with-nav">
		<div class={activeItemClass}>
			<Projectcard data={activeData}/>
			<button class="close-button right" onclick={() => window.location.assign(resolve('/projects'))}>
				<img src={xIcon} alt="X"/>
			</button>
		</div>
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

	.full, .full-overlay {
		position: absolute;
		left: 0;
		top: 3.5em;
		right: 0;
		bottom: 0;
		/* padding: 0.5em; */
	}

	.full-overlay {
		position: fixed;
		top: 0;
	}

	.overlay-with-nav {
		top: 3.5em;
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
		height: 20em;
		overflow: hidden;
		position: relative;
	}

	.project-item-portrait {
		width: 100%;
		height: 15em;
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
		background-color: #000A;
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
		border-radius: 12px;
		width: 2em;
		height: 2em;
		padding: 6px;
		cursor: pointer;
	}

	.close-button:hover {
		background-color: #333A;
	}

	.tag-container {
		position: absolute;
		top: 0;
		right: 0;
	}

	.tag, .tag-last {
		border-radius: 6px;
		border: none;
		background-color: #000A;
		color: #DDD;
		font-family: "Fira-ExtraLight";
		font-size: small;
		/* margin-right: 0.5em; */
		padding: 2px 8px;
	}

	.tag {
		margin-right: 6px;
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

	.fade-in {
		opacity: 0;
		transition: all 0.3s ease;
	}

	.body-text {
		font-family: "Fira-ExtraLight";
		font-size: smaller;
		color: #BBB;
	}

	.footer {
		margin: auto;
		text-align: center;
		font-family: "Fira-ExtraLight";
		font-size: smaller;
		color: #BBB;
	}
</style>