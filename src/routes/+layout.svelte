<script lang="ts">
    import { resolve } from '$app/paths';
	import favicon from '$lib/assets/favicon.svg';
	import headshot from '$lib/assets/headshot.jpg';
    import { onMount } from 'svelte';

	const routeNameMap = [
		{
			path: "projects",
			name: "Projects"
		},
		{
			path: "experience",
			name: "Experience"
		}
	];

	let routeMapping: string | undefined = $state(undefined);

	let { children } = $props();

	onMount(() => {
		const val = routeNameMap.find(i => window.location.pathname.includes(i.path));
		routeMapping = val ? val.name : undefined;
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="top-nav">
	<button class="nav-button" onclick={() => window.location.assign(resolve('/'))}>
		<img class="circle-pfp" src={headshot} alt="">
		<h2 class="title">Jonathan Law's Portfolio</h2>
	</button>

	{#if routeMapping}
		<h3 class="page-title">{routeMapping}</h3>
	{/if}
</div>

{@render children()}

<style>
	@font-face {
		font-family: Fira-ExtraLight;
		src: url(/FiraSans-ExtraLight.ttf);
	}
	@font-face {
		font-family: Fira-Regular;
		src: url(/FiraSans-Regular.ttf);
	}

	:global(body) {
		background-color: #333;
	}

	.top-nav {
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		margin: 0.5em;
		padding: 0.5em 1em;
		border-radius: 12px;
		background-color: #000A;
		color: azure;
		font-family: "Fira-Regular";
		display: flex;
		vertical-align: middle;
	}

	.nav-button {
		display: flex;
		vertical-align: middle;
		color: azure;
		background-color: transparent;
		border: none;
		padding: 0;
		cursor: pointer;
	}

	.circle-pfp {
		border-radius: 50%;
		width: 3em;
	}

	.title {
		margin: auto auto auto 1em;
		font-family: "Fira-Regular";
	}

	.page-title {
		margin: auto 2em;
		font-family: "Fira-Regular";
		/* font-size: medium; */
		color: #CCC;
	}
</style>
