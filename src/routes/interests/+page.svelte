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
		details?: string[];
		items?: string[];
	};

	const chunks: ChunkData[] = [
		{
			header: "Video games",
			details: [
				"I've been an avid gamer since I was young, with my first exposure being a Master System with Columns and "
				+ "Sonic 2. The SNES was where my love of gaming really took hold though, and from there I've owned "
				+ "most consoles at one point or another.",
				"While I definitely don't play as much these days, when I find a great new game to play, I still "
				+ "get sucked in and love devoting the time and effort to the experience. Occasionally I'll feel "
				+ "like a nostalgia hit, and retro games will be my focus for a bit.",
				"All-time Favourites:"
			],
			items: [
				"Super Metroid",
				"Child of Eden",
				"Tetris Attack",
				"Pacman CE 2",
				"Hades"
			]
		},
		{
			header: "Overseas Travel",
			details: [
				"Since my first trip to Japan in 2007, I've been a big fan of going on trips overseas, "
				+ "especially with friends or family. It makes for a great reason to research and explore "
				+ "different places, and immerse yourself in the different experiences that go along with that.",
				"While I haven't actually been to too many different countries, the ones I have been to regularly are "
				+ "pretty well travelled at this point, but I still love going to them!"
			]
		},
		{
			header: "Snowboarding",
			details: [
				"Following on from 'Overseas Travel', I first caught the snowboarding bug on a trip with a friend "
				+ "to Canada / Whistler. That trip spawned so many others to get better and and enjoy the sport.",
				"While I haven't been much lately, I do still really enjoy it and am always looking for an excuse "
				+ "to organise a trip with others to hit the slopes!"
			]
		},
		{
			header: "Bouldering / Indoor Rock Climbing",
			details: [
				"A relatively recent hobby, but one I really enjoy all the same. Similar to snowboarding, I really "
				+ "enjoy the activity with friends. I catch up with a group every month for a session, which fast "
				+ "became one of my most looked-forward to events on my calendar.",
				"We don't go hard, but the friendships, shared problem solving, and shared successes mean "
				+ "I can enjoy so many aspects of the activity, regardless of my personal fears or capabilities."
			]
		},
		{
			header: "Hiking / Long Walks",
			details: [
				"Very simple, but very valuable to my lifestyle and wellbeing. Walks offer me a time and place "
				+ "to process and figure things out, and I've come to rely on them for this over the years. "
				+ "Stepping out of the house, looking at different things - I find it helps to work through "
				+ "thoughts, or come up with solutions to problems.",
				"Hiking, while I don't go often, is something I enjoy with others - if walks allow me "
				+ "to process things, hikes have allowed me to catch up with and get to know others more, "
				+ "which is something I really enjoy and wish to do more of."
			]
		},
		{
			header: "Electronics / Software",
			details: [
				"As having a passion for video games might suggest, I do like to tinker and play with electronics "
				+ "and try out new software. In the past I was very keen on PC building - in particular figuring "
				+ "out small form factor builds was something I found rewarding. Those days are past, but I "
				+ "do still like to keep tabs on new hardware, especially uniquely designed computers or devices.",
				"Beyond that, Linux has recently become my daily driver outside of Mac, which has been slowly "
				+ "developing until I built up enough understanding and confidence to commit to it."
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

					{#each chunk.details as details}
						<p class="body-text">{details}</p>
					{/each}

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
		margin: 1em 0.5em;
	}

	li.body-text {
		margin: auto;
	}
</style>