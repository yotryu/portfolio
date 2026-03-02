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
		company: string;
		position: string;
		timeframe: string;
		items: string[];
	};

	const chunks: ChunkData[] = [
		{
			company: "The Tea Division",
			position: "Senior Programmer / Project Lead",
			timeframe: "October 2023 - December 2025",
			items: [
				"Identifying and making code adjustments to support Android, iOS, and Switch compilation of UE5 game (C++)",
				"Assist in the identification of mobile-specific UE5 material issues",
				"Implementing Android toolchain improvements in UE5 (C++ and C#)",
				"Implementing iOS toolchain improvements in UE5 (C++ and C#)",
				"Implementing support for Android and iOS UE5 builds through Teamcity CI (C# and Kotlin)",
				"Assisting in the implementation of On-Screen Controls functionality",
				"Implementing additional features for existing C# development and deployment tools",
				"Design and creation / implementation of new C# development tools",
				"Implementing Android Gauntlet (Automation) test runner improvements",
				"Lead team when working with external team (owners of the project)",
				"Liaising and coordinating work with external team",
				"Determining and defining tasks based on requests, requirements, ideation",
				"Running project planning meetings",
				"Implementation of new game features in Unity (C#)",
				"Collaborative design, problem solving, and programming to improve Unity game (C#)"
			]
		},
		{
			company: "The Eccentric Ape - A Dapper Labs Company",
			position: "Senior Programmer",
			timeframe: "December 2021 - September 2023",
			items: [
				"Assisting with feature enhancement of existing internal-use content creation pipelines (Node.js / Unity)",
				"Design and creation of new tools to improve ease-of-use, reliability, and performance of content creation pipelines (Node.js / Javascript / React.js)",
				"Assisting with the design and implementation of new tools to enable content creation for rendered and real-time outputs simultaneously (Unity / C#)",
				"Assisting with the creation of digital collectible content (Unity)",
				"Working with other teams to define and refine requirements through knowledge sharing across disciplines",
				"Conducting rollout of new tools and features for other team members to use, with demonstrations, documentation, and Q&A sessions",
				"Assisting with the design and prototyping of sports-based games (Unity)",
			]
		},
		{
			company: "The Eccentric Ape",
			position: "Contract Programmer",
			timeframe: "March 2020 - December 2021",
			items: [
				"Assisting with optimisation / conversion of game objects in Unreal (Blueprint to C++ and procedural object placement)",
				"Conducting performance analysis of optimisation options and producing recommendations from results",
				"Assisting with migration of collision / interaction system to bespoke system for increased performance",
				"Designing and prototyping quality settings management system for mobile game",
				"Assisting with design and implementation of various systems for mobile game (Unity / C# client and golang server)",
				"Prototype ideation and development for mobile basketball game (Unity)",
				"Prototype development on top down action game idea (input / camera / collision mechanics)",
				"Assisting with adjustments needed to port game to PC",
			]
		},
		{
			company: "Protostar Games",
			position: "Contract Programmer / Tools Developer",
			timeframe: "June 2019 - August 2019",
			items: [
				"Assisting with development on existing and new games using Unity (gameplay, polish, demo features)",
				"Assisting with development on existing tools to export models and textures from Blender using Python",
				"Assisting with application submission process for iOS and Google Play stores",
			]
		},
		{
			company: "Halfbrick Studios",
			position: "Programmer / Game Developer",
			timeframe: "July 2012 - November 2018",
			items: [
				"Designing and implementing software APIs for internal development",
				"Updating 3rd party (advertising, analytics, social) SDKs in existing mobile apps (iOS and Android / Google Play)",
				"Integrating new 3rd party SDKs and functionality for shared use across the company",
				"Participating and assisting in the design of new game features for apps (including gameplay, menus, meta-game systems and associated visuals)",
				"Implementing new game features for mobile games",
				"Designing and implementing tool / support applications for in-house use",
				"Assisting others with iOS application provisioning and certificate functionality",
				"Managing iOS application provisioning and certificate systems",
				"Configuration and management of online functionality for games using in-house and 3rd party tools",
				"Participating in Scrum ceremonies (stand-up, sprint planning, sprint reviews, retrospectives)",
				"Running Scrum ceremonies (as above)",
				"Configuration and management of project level workflow tracking (physical whiteboard, Trello, Jira)",
				"Designing and implementing client -server functionality (including real-time multiplayer) for mobile games",
				"Participating in Crucial Conversation workshops",
				"Applying Crucial Conversations training to resolve conflicts with and between other employees",
				"Implementing Google Big Data queries to extract analytic data for analysis of app performance",
				"Implementing visualisation for data analysis using Tableau",
				"Assisting others with use of Unity and in-house tools for game development",
				"Performing project level configuration and management of remote build, and Continuous Integration services",
				"Providing development and tools support for remote teams via email and live chat",
				"Documenting significant system design and usage",
			]
		},
		{
			company: "Queensland University of Technology (QUT)",
			position: "Research and Development Assistant",
			timeframe: "December 2011 - March 2012",
			items: [
				"Designing software for Unix based operating system (Mac OS X) based on guidelines",
				"Designing software for mobile device (iPad 2) based on guidelines",
				"Designing common, cross-platform interface",
				"Designing network communication layout between mobile and desktop devices",
				"Interfacing with ARToolkit SDK for iOS to produce an “Augmented Reality” application",
				"Implementing common, cross-platform software (including networking interface) and",
				"Graphical User Interface in C/C++",
				"Implementing OpenGL based application (with 3D and 2D elements) using constructed desktop application design in C/C ++",
				"Implementing OpenGL ES based application (with 3D and 2D elements) using constructed mobile device application design in C/C ++/Objective-C",
				"Implementing network communications between two software applications on different devices",
				"Implementing peer-to-peer audio chat between desktop application and mobile device application using OpenAL in C/C ++/Objective-C",
				"Implementing skeletal animation for 3D “avatars” in C/C++",
				"Working in an agile development environment with daily stand up meetings and weekly progress meetings",
				"Working in a collaborative environment to assist others on different projects",
			]
		},
		{
			company: "JB Hifi",
			position: "Software Advisor (Games)",
			timeframe: "October 2008 - February 2011",
			items: [
				"Performing stocktake activities (DVDs and Games)",
				"Processing DVD and Games stock for sale",
				"Merchandising stock according to plans (DVDs, games and accessories)",
				"Providing customer service (enquiries for DVDs, music and games)",
				"Performing trade-in games service",
				"Processing supplier invoices",
				"Performing disc cleaning service",
				"Processing CD/DVD music stock for sale",
				"Processing cash/EFTPOS transactions",
				"Troubleshooting hardware and software issues for customers",
				"Processing stock returns",
				"Delegating workload when filling in for coordinator"
			]
		},
		{
			company: "McDonalds",
			position: "Crew Chief / Crew Trainer / Crew Member",
			timeframe: "April 2003 - September 2008",
			items: [
				"Providing customer service (both front counter and McCafe)",
				"Cleaning of designated areas and equipment",
				"Processing of cash/EFTPOS transactions",
				"Preparing beverages in McCafe",
				"Training new crew in store procedures",
				"Verifying existing crew and their capabilities",
				"Working with managers to ensure small jobs were being carried out by crew (secondary jobs)",
				"Communicating changes in training procedures to trainers",
				"Working with the crew training manager to conduct meetings and address crew trainers",
				"Filing verification documents",
				"Being accountable for operation of shifts when shift managers are tending to other matters"
			]
		},
	];
</script>

<!-- Bind innerWidth and innerHeight so we can pick layout based on aspect ratio -->
<svelte:window bind:innerWidth bind:innerHeight />


<div class="full">
	<div class="outer-container">
		<div class={itemsContainerClass}>
			{#each chunks as chunk}
				<div class={chunkClass}>
					<h3 class="title">{chunk.company}</h3>
					<p class="subtitle right">{chunk.timeframe}</p>
					<p class="position-title">{chunk.position}</p>
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
		margin: 0.5em 0 0 0.3em;
		font-family: "Fira-Regular";
	}

	.subtitle, .position-title {
		font-size: small;
		margin-top: 0.5em;
		font-family: "Fira-ExtraLight";
		color: #BBB;
	}

	.position-title {
		/* font-size: medium; */
		margin-left: 0.5em;
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