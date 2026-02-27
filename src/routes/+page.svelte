<script lang="ts">
	import pfpImage from '$lib/assets/headshot.jpg';

	// state
	let innerWidth = $state(0);
	let innerHeight = $state(0);
	let isPortrait = $derived(innerWidth <= innerHeight);
	let chunkClass = $derived(isPortrait ? "chunk-portrait" : "chunk");

	interface ChunkData {
		header: string;
		text?: string;
		textList?: string[] | string[][];
		iconPath?: string;
	}

	const chunkData: ChunkData[] = [
		{
			header: "Jonathan Law",
			iconPath: pfpImage
		},
		{
			header: "Projects",
			text: "Primarily focussed on video games, I've worked on AAA console and PC titles, mobile free-to-play, and small team / individual indie titles over the years."
		},
		{
			header: "Experience",
			text: "Over 12 years experience as a software programmer in the games industry, with supporting roles in production and team leadership at different times."
		},
		{
			header: "Skills",
			textList: [
				["Strong programming capability"],
				["C# / .NET", "C++", "Javascript / Typescript", "Node.js", "Objective-C", "Java", "Python", "Svelte", "React", "AppScript"],
				["Strong Game Engine knowledge"],
				["Unity", "Unreal (UE5; from source; build tools)", "Godot"],
				["Prototyping"],
				["Game Jams", "Personal projects", "Feature ideation and testing", "Collaborative iteration"],
				["Production"],
				[
					"Running Scrum ceremonies (standup, stakeholder review, retrospective)",
					"Setting up project tracking software (Jira, Clickup)",
					"Collecting feedback throughout all phases of development and post-release",
					"Running playtests",
					"Storefront setup (iOS App Store, Play Store, Steam)",
					"Storefront automation tools development and integration",
					"CI setup and usage (Jenkins, Teamcity)",
					"Product releases / Storefront approvals"
				]
			]
		},
		{
			header: "Hobbies",
			text: "Other hobbies"
		}
	];
</script>

<!-- Bind innerWidth and innerHeight so we can pick layout based on aspect ratio -->
<svelte:window bind:innerWidth bind:innerHeight />


<div class="outer-container">
{#each chunkData as chunk}
	<div class={chunkClass}>
		{#if chunk.iconPath}
			<img class="circle-pfp" src={chunk.iconPath} alt="">
		{/if}

		<h2>{chunk.header}</h2>

		{#if chunk.text}
			<p>{chunk.text}</p>
		{/if}

		{#if chunk.textList}
			<div class="chunk-list">
				{#each chunk.textList as listItem}
					{#if Array.isArray(listItem) && listItem.length > 1}
						<ul>
						{#each listItem as subItem}
							<li>{subItem}</li>
						{/each}
						</ul>
					{:else}
						<li>{listItem}</li>
					{/if}
				{/each}
			</div>
		{/if}
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
		place-items: center;
	}

	.chunk, .chunk-portrait {
		font-family: "Fira-Regular";
		color: azure;
		border-radius: 8px;
		/* border: 1px solid #2C7; */
		padding: 0.5em 1em;
		margin-bottom: 1em;
		background-color: #000A;
		/* text-align: center; */
		width: 40em;
	}

	.chunk-portrait {
		width: 90%
	}

	.circle-pfp {
		border-radius: 50%;
		max-width: 5em;
	}

	.chunk-list {
		padding: 0 0 1em 1em;
		font-family: "Fira-ExtraLight";
	}

	p {
		font-family: "Fira-ExtraLight";
	}
</style>
