<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import headshot from '$lib/assets/headshot.jpg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="top-nav">
	<img class="circle-pfp" src={headshot} alt="">
	<h2 class="title">Jonathan Law's Portfolio</h2>
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

	.circle-pfp {
		border-radius: 50%;
		max-width: 3em;
	}

	.title {
		margin: auto 1em;
	}
</style>
