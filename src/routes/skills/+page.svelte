<script lang="ts">
	import { resolve } from '$app/paths';

	// state
	let innerWidth = $state(0);
	let innerHeight = $state(0);
	let isPortrait = $derived(innerWidth <= innerHeight);
	let isNarrow = $derived(innerWidth * 1 <= innerHeight);
	let itemsContainerClass = $derived(isNarrow ? "items-container-portrait" : "items-container");
	let chunkClass = $derived(isPortrait ? "chunk-portrait" : "chunk");

	interface ChunkData {
		header: string;
		items: string[];
	};

	const chunks: ChunkData[] = [
		{
			header: "Strong Programming capability",
			items: [
				"C# / .NET",
				"C++",
				"Javascript / Typescript",
				"Node.js",
				"Objective-C / C++",
				"Java",
				"Python",
				"Svelte",
				"React",
				"AppScript"
			]
		},
		{
			header: "Strong Game Engine knowledge",
			items: [
				"Unity",
				"Unreal (UE5; from source; build tools)",
				"Godot"
			]
		},
		{
			header: "Prototyping",
			items: [
				"Game James",
				"Personal projects",
				"Feature ideation and testing",
				"Collaborative iteration"
			]
		},
		{
			header: "Production",
			items: [
				"Running Scrum ceremonies (standup, stakeholder review, retrospective)",
				"Setting up project tracking software (Jira, Clickup)",
				"Collecting feedback throughout all phases of development and post-release",
				"Running playtests",
				"Storefront setup (iOS App Store, Play Store, Steam)",
				"Storefront automation tools development and integration",
				"CI setup and usage (Jenkins, Teamcity)",
				"Product releases / Storefront approvals"
			]
		}
	];
</script>

<!-- Bind innerWidth and innerHeight so we can pick layout based on aspect ratio -->
<svelte:window bind:innerWidth bind:innerHeight />


<div class="full">
	<div class="outer-container">
		<div class={itemsContainerClass}>
			{#each chunks as chunk}
				<div class={chunkClass}>
					<h3 class="title">{chunk.header}</h3>
					<ul>
						{#each chunk.items as item}
							<li class="body-text">{item}</li>
						{/each}
					</ul>
				</div>
			{/each}
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
		place-items: start center;
	}

	.full {
		position: absolute;
		left: 0;
		top: 3.5em;
		right: 0;
		bottom: 0;
		padding: 0.5em;
		/* overflow: hidden; */
		font-family: "Fira-ExtraLight";
		color: azure;
	}

	.items-container, .items-container-portrait {
		width: 40em;
	}

	.items-container-portrait {
		width: 100%;
		position: relative;
	}

	.chunk, .chunk-portrait {
		color: azure;
		border-radius: 12px;
		/* border: 1px solid #2C7; */
		margin-bottom: 1em;
		padding: 0.5em 1em;
		background-color: #0008;
		/* text-align: center; */
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
		margin: 0.5em 0 0 0.5em;
		font-family: "Fira-Regular";
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
		/* color: #BBB; */
	}
</style>