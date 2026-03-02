import type { AllProjectData } from "./types";

export const FullProjectData: AllProjectData = {
	projects: [
		// {
		// 	id: "portfolio-site",
		// 	title: "Portfolio Site",
		// 	subtitle: "Showcasing the projects I've worked on, and work history - this site!",
		// 	categories: ["Web", "Indie"],
		// 	tags: [
		// 		{
		// 			"text": "Website",
		// 			"url": "https://yotryu.github.io/portfolio/"
		// 		}
		// 	],
		// 	aspect: 1.5,
		// 	previewImage: "https://lh3.googleusercontent.com/d/1BlTnRaol04eIvpCQGlE2oMdl99DSwxfC?authuser=0",
		// 	description: "Something I've not had before this point, but with my recent foray into Github static pages and Svelte, I thought it time to set something up.\nMade using Svelte kit (Typescript), hosted on GitHub static sites."
		// },
		{
			id: "travel-blog",
			title: "Travel Blog",
			subtitle: "Exploration of a custom photo album-like design for travel blogging",
			categories: ["Web", "Indie"],
			tags: [
				{
					"text": "Website",
					"url": "https://yotryu.github.io/travel-blog/"
				}
			],
			aspect: 1.5,
			previewImage: "https://lh3.googleusercontent.com/d/1-8lBnu-7cLbPLC4njVXXGloI3WYRc3jl?authuser=0",
			description: "A personal passion project to get more hands-on with modern web development.\nAfter an overseas trip with the family, I wanted a neat way to share memories. Having used other platforms in the past to do travel blogging with, I wanted to see if I could do something more unique, so used this as an opportunity to do just that.\nMade using Svelte kit (Typescript), hosted on GitHub static sites."
		},
		{
			id: "vanguard-exiles",
			title: "Vanguard Exiles",
			subtitle: "Post-apocalyptic auto-battler 'board' game designed by Richard Garfield",
			categories: ["Game", "Professional"],
			tags: [
				{
					"text": "Steam",
					"url": "https://store.steampowered.com/app/2745490/Vanguard_Exiles/"
				}
			],
			aspect: 1.5,
			previewImage: "https://lh3.googleusercontent.com/d/1UFIq-ODxg42vDShO_OzUntaPs8Qf-PpR?authuser=0",
			description: "A personal passion project to get more hands-on with modern web development.\nAfter an overseas trip with the family, I wanted a neat way to share memories. Having used other platforms in the past to do travel blogging with, I wanted to see if I could do something more unique, so used this as an opportunity to do just that.\nMade using Svelte kit, hosted on GitHub static sites."
		},
		{
			id: "ps",
			title: "Prototype 'PS'",
			subtitle: "'Passive Shooter' concept with focus on patterns and execution skill",
			categories: ["Game", "Indie"],
			tags: [
				{
					"text": "Android",
					"url": ""
				},
				{
					"text": "Desktop",
					"url": ""
				}
			],
			aspect: 0.8,
			previewImage: "https://lh3.googleusercontent.com/d/1ryQ4BJF1Yy_jyKin5jdaoTNCKapT3Bz1?authuser=0",
			previewVideo: "https://www.dropbox.com/scl/fi/exgltnsau6gpc8ohx0t89/ps_portfolio_preview.mp4?rlkey=yyq902sdqptzininm7mt6fssw&st=54oquqng&raw=1",
			description: "With 'CF' shelved, I wanted to apply some of the visual design ideas in a more traditional input experience.\nAgain the approach was to quickly 'polish' a core experience to see how it would feel.\nThe game involves collecting / bumping into things of the same colour, and avoiding the opposite colour. Fill the gauge and you enter 'attack' mode where enemies fire bullets which when collected, shoot back at them.\nThere is a miniboss / challenge system, as well as run upgrades and bosses with more traditional bullet-hell type patterns.\nThis prototype felt much more fun and is one I would like to continue.\nMade in Unity with Blender, Pixelmator Pro, and FL Studio."
		},
		{
			id: "geogrid-wallpaper",
			title: "Geo Grid Wallpaper",
			subtitle: "Abstract geometric art-inspired live wallpaper for Android",
			categories: ["App", "Indie"],
			tags: [
				{
					"text": "Android",
					"url": ""
				}
			],
			aspect: 0.8,
			previewImage: "https://lh3.googleusercontent.com/d/16L12-25fGPiitDXFVzRC4g3M_PE8v57Y?authuser=0",
			previewVideo: "https://www.dropbox.com/scl/fi/jdn1qesf1jt4r6cje6r3e/Geo-Prism-Live-Wallpaper-demo.mp4?rlkey=937vp272svrh8kggtlftitw6g&st=eunhr39u&raw=1",
			description: "Another personal project, this time created after exploring background designs for 'CF'.\nWhile that prototype game was shelved, the background design was something I really liked and thought would work well as a live wallpaper.\nMany options and shapes turned it into an app which I have used as my wallpaper for years now.\nMade with Android Studio (Java + OpenGL) and Blender."
		},
		{
			id: "sackboy",
			title: "Sackboy: A Big Adventure",
			subtitle: "Platforming adventure set in the LittleBigPlanet universe",
			categories: ["Game", "Professional"],
			tags: [
				{
					"text": "PlayStation",
					"url": "https://www.playstation.com/en-us/games/sackboy-a-big-adventure/"
				},
				{
					"text": "Steam",
					"url": "https://store.steampowered.com/app/1599660/Sackboy_A_Big_Adventure/"
				}
			],
			aspect: 1.5,
			previewImage: "https://lh3.googleusercontent.com/d/1LP-6gD9Gm2kVRsENm_S4N5Sj94NsLgET?authuser=0",
			// previewVideo: "https://www.dropbox.com/scl/fi/jdn1qesf1jt4r6cje6r3e/Geo-Prism-Live-Wallpaper-demo.mp4?rlkey=937vp272svrh8kggtlftitw6g&st=eunhr39u&raw=1",
			description: "This was a huge project being made by Sumo Digital. I was brought on to assist The Eccentric Ape (TEA) in optimisation of the game before its launch on PlayStation platforms.\nMost of the work for the PlayStation release involved converting Unreal Blueprints to C++ and optimising functionality based on guidelines.\nFollowing from this, TEA worked on the PC / Steam port, during which most of my effort was on all the different types of gamepad controls to be supported, and making sure player drop-in and drop-out worked well with a combination of local (when a new gamepad is connected) and networked players.\nMade in Unreal (UE5).\nDeveloped by Sumo Digital. Game by Sony Interactive Entertainment / PlayStation Studios"
		},
		{
			id: "cf",
			title: "Prototype 'CF'",
			subtitle: "'Collect Frenzy' concept with single input mechanic, single screen arcade game",
			categories: ["Game", "Indie"],
			tags: [
				{
					"text": "Android",
					"url": ""
				},
				{
					"text": "Desktop",
					"url": ""
				}
			],
			aspect: 0.8,
			previewImage: "https://lh3.googleusercontent.com/d/164D3FVTNEDwFP5-4e5NxaGHIAkygsh9J?authuser=0",
			previewVideo: "https://www.dropbox.com/scl/fi/gge4imtrv3h31rcl5qzcn/cf_portfolio_preview.mp4?rlkey=kruopo4mrzd93mthw8u04uryr&st=f1jjwy9i&raw=1",
			description: "After Starazius, I wanted to try a simple abstract idea polished early to see how that might work.\nThere is only one input mechanic - move around the circle. The rest of the game involves collecting bits for points and to progress, and avoiding obstacles. Challenge phases were added to support awarding gems, which upon collecting all rewarded a jackpot inspired by pinball.\nThe controls never felt right, so I shelved the project to reuse some visual ideas later.\nMade in Unity with Blender, Pixelmator Pro, and FL Studio."
		},
		{
			id: "starazius",
			title: "Starazius",
			subtitle: "Arcade style top-down shooter with roguelike elements",
			categories: ["Game", "Indie"],
			tags: [
				{
					"text": "Android",
					"url": ""
				},
				{
					"text": "iOS",
					"url": ""
		 		},
				{
					"text": "Steam",
					"url": "https://store.steampowered.com/app/1157100/Starazius/"
				}
			],
			aspect: 1.5,
			previewImage: "https://lh3.googleusercontent.com/d/1f6Mz_8l55LFC0t1ZxEgpS16shCqK9UHv?authuser=0",
			previewVideo: "https://www.dropbox.com/scl/fi/etorpa5oiwfh03bbn6xpo/starazius_portfolio_preview.mp4?rlkey=cikzo6rt35iemsrp5ohgd9f9h&st=u2xfv2i9&raw=1",
			description: "My first solo developer effort.\nInspired by Star Fox, Galaga (Legions), Downwell, and bullet-hells.\nThe game combines elements from these inspirations for a score and achievement focused experience.\nThe ambitious timeframe (~8 months) means it has quite a few rough edges, but I'm proud of it all the same.\nMade in Unity with Blender, Pixelmator Pro, and FL Studio."
		},
		{
			id: "literally-mowing",
			title: "It's Literally Just Mowing",
			subtitle: "Calm game about mowing lawns and the simple life",
			categories: ["Game", "Contract"],
			tags: [
				{
					"text": "Android",
					"url": "https://play.google.com/store/apps/details?id=com.protostar.mowing"
				},
				{
					"text": "iOS",
					"url": "https://apps.apple.com/us/app/its-literally-just-mowing/id1458309993"
		 		}
			],
			aspect: 0.8,
			previewImage: "https://lh3.googleusercontent.com/d/1LryR7101U_2bmc9WSp48EvxrXWx2NczM?authuser=0",
			// previewVideo: "https://www.dropbox.com/scl/fi/etorpa5oiwfh03bbn6xpo/starazius_portfolio_preview.mp4?rlkey=cikzo6rt35iemsrp5ohgd9f9h&st=u2xfv2i9&raw=1",
			description: "Another small supporting position, this time assisting with some polish and extra collectable features.\nThe game features critters which can be 'collected' in your journal - I assisted with some of the behaviours of these critters, as well as some of the wind effects (particularly on the trees).\nMade in Unity.\nGame ⓒ Protostar Games"
		},
		{
			id: "super-starfish",
			title: "Super Starfish",
			subtitle: "Interstellar aquarium builder + endless runner with cool trippy visuals",
			categories: ["Game", "Contract"],
			tags: [
				{
					"text": "Android",
					"url": "https://play.google.com/store/apps/details?id=com.protostar.starfish"
				},
				{
					"text": "iOS",
					"url": "https://apps.apple.com/us/app/super-starfish/id1298839048"
		 		}
			],
			aspect: 1.5,
			previewImage: "https://lh3.googleusercontent.com/d/1nVUo6PoA4eFVGUgbT1-yJ8RGXwDVsmD9?authuser=0",
			// previewVideo: "https://www.dropbox.com/scl/fi/etorpa5oiwfh03bbn6xpo/starazius_portfolio_preview.mp4?rlkey=cikzo6rt35iemsrp5ohgd9f9h&st=u2xfv2i9&raw=1",
			description: "A small stint on Super Starfish, but I assisted with getting a 'zen' viewing mode working. Players could enter the mode to simply enjoy the 'aquarium' they had built, watching the fish swim about and the plants move in the currents.\nMade in Unity.\nGame ⓒ Protostar Games"
		},
		{
			id: "fruit-ninja-2",
			title: "Fruit Ninja 2",
			subtitle: "Multiplayer + powerup focused follow-up to Fruit Ninja",
			categories: ["Game", "Professional"],
			tags: [
				{
					"text": "Android",
					"url": "https://play.google.com/store/apps/details?id=com.halfbrick.fruitninjax"
				},
				{
					"text": "iOS",
					"url": "https://apps.apple.com/us/app/fruit-ninja-2/id1330898775"
		 		},
			],
			aspect: 1.5,
			previewImage: "https://lh3.googleusercontent.com/d/1sCbU-UC74n11MM9YsC1r1ss5Q9ag_6Hk?authuser=0",
			// previewVideo: "https://www.dropbox.com/scl/fi/s7cxsatjxm4ci0k7na5he/lightning-wallpaper-demo.mp4?rlkey=jsxyg3hli1ohzp6jzu09ztbgg&st=8g42o5ar&raw=1",
			description: "After working on updates for the original Fruit Ninja for quite a while, an opportunity arose to work on a multiplayer-focused follow up.\nI was part of the original team for Fruit Ninja 2, working alongside a small group of passionate devs to bring multiplayer with user-triggerable powerups / abilities to the Fruit Ninja® universe.\nI was involved from the start through early access, but ultimately left the company before the v1.0 release.\nMade in Unity with Photon networking (at the time at least).\nGame ⓒ Halfbrick Studios"
		},
		{
			id: "lightning-wallpaper",
			title: "Lightning Wallpaper",
			subtitle: "Dynamic lightning live wallpaper for Android",
			categories: ["App", "Indie"],
			tags: [
				{
					"text": "Android",
					"url": ""
				}
			],
			aspect: 1.5,
			previewImage: "https://lh3.googleusercontent.com/d/1kE-W1FLbINb2of5cYfKugsfM8-Quik2d?authuser=0",
			previewVideo: "https://www.dropbox.com/scl/fi/s7cxsatjxm4ci0k7na5he/lightning-wallpaper-demo.mp4?rlkey=jsxyg3hli1ohzp6jzu09ztbgg&st=8g42o5ar&raw=1",
			description: "A personal project created after figuring a novel way to create dynamic lightning effects while working on Fruit Ninja.\nI thought the idea of having a unique lightning-type wallpaper which animates and shows something different all the time would be cool.\nMade with Android Studio (Java + OpenGL) and Pixelmator Pro."
		},
		{
			id: "fruit-ninja",
			title: "Fruit Ninja",
			subtitle: "Touchscreen gaming smash hit",
			categories: ["Game", "Professional"],
			tags: [
				{
					"text": "Android",
					"url": "https://play.google.com/store/apps/details?id=com.halfbrick.fruitninja"
				},
				{
					"text": "iOS",
					"url": "https://apps.apple.com/us/app/fruit-ninja-classic/id362949845"
		 		},
			],
			aspect: 1.5,
			previewImage: "https://lh3.googleusercontent.com/d/1Y1-zrps0K0coa9olor6HWekmxkN_yPN7?authuser=0",
			// previewVideo: "https://www.dropbox.com/scl/fi/s7cxsatjxm4ci0k7na5he/lightning-wallpaper-demo.mp4?rlkey=jsxyg3hli1ohzp6jzu09ztbgg&st=8g42o5ar&raw=1",
			description: "The original fruit slicing touchscreen game.\nI implemented many of the blade and dojo abilities which came a while after the game was originally released, as well as new and seasonal content.\nWhile the foundations were largely there and left untouched, the team I worked with contributed many new ideas to the experience.\nMade with in-house engine and tools.\nGame ⓒ Halfbrick Studios"
		},
	]
};