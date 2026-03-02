<script lang="ts">
	import pfpImage from '$lib/assets/headshot.jpg';
	import { resolve } from '$app/paths';

	// state
	let innerWidth = $state(0);
	let innerHeight = $state(0);
	let isPortrait = $derived(innerWidth <= innerHeight);
	let chunkClass = $derived(isPortrait ? "chunk-portrait" : "chunk");
	let rowClass = $derived(isPortrait ? "row-portrait" : "row");
	let profileClass = $derived(isPortrait ? "profile-portrait" : "profile");
	let projectsClass = $derived(isPortrait ? "projects-portrait" : "projects");
	let experienceClass = $derived(isPortrait ? "experience-portrait" : "experience");
	let skillsClass = $derived(isPortrait ? "skills-portrait" : "skills");
	let hobbiesClass = $derived(isPortrait ? "hobbies-portrait" : "hobbies");

	interface ChunkData {
		linkId?: string;
		header: string;
		text?: string;
		textList?: string[] | string[][];
		iconPath?: string;
	}

	const chunkData: ChunkData[] = [
		{
			linkId: "/projects",
			header: "Projects",
			text: "Primarily focused on video games, I've worked on AAA console and PC titles, mobile free-to-play, and small team / individual indie titles over the years."
		},
		{
			linkId: "/experience",
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
	<div class="bg-container">
		<video class="bg-video" autoplay muted loop>
			<source src="https://www.dropbox.com/scl/fi/czrdhlm4o01rx86kf41l6/portfolio_collage_loop.mp4?rlkey=t6am0iz6g1oa9zyjz7mcypbip&st=u9qzl719&raw=1" type="video/mp4">
			Your browser does not support the video tag.
		</video>
	</div>
	<!-- Profile -->
	<div class={rowClass}>
		<div class={profileClass}>
			<img class="circle-pfp" src={pfpImage} alt="">
			<!-- <h2 class="title">Jonathan Law</h2> -->
			<p>Hi, I'm Jonathan, a software developer with a huge passion for video games who loves to make things with other passionate and awesome people!</p>
		</div>
	</div>

	<!-- Projects and Experience -->
	<div class="{rowClass} flex">
		<button class={projectsClass} onclick={() => window.location.assign(resolve("/projects"))}>
			<h3 class="title">Projects</h3>
		</button>
	</div>

	<div class="{rowClass} flex">
		<button class={skillsClass} onclick={() => window.location.assign(resolve("/experience"))}>
			<h3 class="title">Experience</h3>
		</button>

		<button class={skillsClass} onclick={() => window.location.assign(resolve("/skills"))}>
			<h3 class="title">Skills</h3>
		</button>

		<button class={hobbiesClass} onclick={() => window.location.assign(resolve("/interests"))}>
			<h3 class="title">Interests</h3>
		</button>
	</div>
</div>

<!-- <div class="outer-container">
{#each chunkData as chunk}
	{@const buttonClass = chunk.linkId ? "chunk-button" : "no-button"}
	<div class={chunkClass}>
		<button class={buttonClass} onclick={() => chunk.linkId ? window.location.assign(resolve(`${chunk.linkId}`)) : {}}>
			<div>
				{#if chunk.iconPath}
					<img class="circle-pfp" src={chunk.iconPath} alt="">
				{/if}

				<h2 class="title">{chunk.header}</h2>

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
		</button>
	</div>
{/each}
</div> -->


<style>
	@font-face {
		font-family: Fira-ExtraLight;
		src: url(/FiraSans-ExtraLight.ttf);
	}
	@font-face {
		font-family: Fira-Regular;
		src: url(/FiraSans-Regular.ttf);
	}

	.top-nav {
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		margin: 0.5em;
		padding: 0.5em 1em;
		border-radius: 12px;
		background-color: #000D;
		color: azure;
		font-family: "Fira-Regular";
		display: flex;
		vertical-align: middle;
	}
	
	.outer-container {
		display: grid;
		place-items: center;
		overflow: hidden;
		margin-top: 3.5em;
	}

	.bg-container {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		overflow: hidden;
		z-index: -1;
	}

	.bg-video {
		object-fit: cover;
		width: 100%;
		height: 100%;
		filter: brightness(70%);
	}

	.profile, .profile-portrait {
		font-family: "Fira-Regular";
		color: azure;
		border-radius: 12px;
		/* border: 1px solid #2C7; */
		padding: 0.5em 1em;
		background-color: #000D;
		text-align: center;
	}

	.profile-portrait {
		/* width: calc(100%); */
	}

	.row, .row-portrait {
		width: 40em;
		position: relative;
		margin-bottom: 1em;
		display: flex;
	}

	.row-portrait {
		width: 100%;
		display: block;
		/* display: flex; */
	}

	.flex {
		display: flex;
	}

	.projects, .projects-portrait, .experience, .experience-portrait, .skills, .skills-portrait, .hobbies, .hobbies-portrait {
		font-family: "Fira-Regular";
		color: azure;
		border-radius: 12px;
		border: none;
		padding: 0.5em 1em;
		/* margin-bottom: 1em; */
		/* margin-right: 1em; */
		background-color: #000D;
		text-align: center;
		/* width: calc(50% - 2em); */
		width: 100%;
		height: 3em;
		/* position: relative; */
		cursor: pointer;
	}

	.projects-portrait {
		/* width: 100%; */
		margin-right: unset;
		/* margin-bottom: 1em; */
	}

	.experience, .experience-portrait {
		margin-right: unset;
	}

	.experience-portrait {
		/* width: unset; */
	}

	.skills, .skills-portrait, .hobbies, .hobbies-portrait {
		width: 50%;
		height: unset;
	}

	.skills, .skills-portrait {
		margin-right: 1em;
	}

	.projects:hover, .profile-portrait:hover, .experience:hover, .experience-portrait:hover, .skills:hover, .skills-portrait:hover, .hobbies:hover, .hobbies-portrait:hover {
		background-color: #444D;
	}

	.circle-pfp {
		border-radius: 50%;
		margin-top: 1em;
		width: 6em;
	}

	.chunk-list {
		padding: 0 0 1em 1em;
		font-family: "Fira-ExtraLight";
	}

	.title {
		margin: 0;
		padding: 0;
	}

	.top {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		padding: 1em;
	}

	.bottom {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 1em 1em 0.5em 1em;
	}

	.chunk-button, .no-button {
		border: none;
		background-color: transparent;
		text-align: unset;
		color: unset;
	}

	.chunk-button:hover {
		cursor: pointer;
	}

	p {
		font-family: "Fira-ExtraLight";
	}
</style>
