import type { AllProjectData } from "./types";

export const FullProjectData: AllProjectData = {
	projects: [
		{
			id: "lightning-wallpaper",
			title: "Lightning Wallpaper",
			subtitle: "Dynamic lightning live wallpaper for Android",
			tags: [
				{
					"text": "Android",
					"url": ""
				}
			],
			aspect: 0.8,
			previewImage: "https://lh3.googleusercontent.com/d/1kE-W1FLbINb2of5cYfKugsfM8-Quik2d?authuser=0",
			previewVideo: "https://www.dropbox.com/scl/fi/s7cxsatjxm4ci0k7na5he/lightning-wallpaper-demo.mp4?rlkey=jsxyg3hli1ohzp6jzu09ztbgg&st=8g42o5ar&raw=1",
			description: "A personal project created after figuring a novel way to create dynamic lightning effects while working on Fruit Ninja.\nI thought the idea of having a unique lightning-type wallpaper which animates and shows something different all the time would be cool.\nMade with Android Studio (Java + OpenGL) and Pixelmator Pro."
		},
		{
			id: "geogrid-wallpaper",
			title: "Geo Grid Wallpaper",
			subtitle: "Abstract geometric art-inspired live wallpaper for Android",
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
			id: "starazius",
			title: "Starazius",
			subtitle: "Arcade style top-down shooter with roguelike elements",
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
			id: "cf",
			title: "Prototype 'CF'",
			subtitle: "'Collect Frenzy' concept with single input mechanic, single screen arcade game",
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
			id: "ps",
			title: "Prototype 'PS'",
			subtitle: "'Passive Shooter' concept with focus on patterns and execution skill",
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
			id: "travel-blog",
			title: "Travel Blog",
			subtitle: "Exploration of a custom photo album-like design for travel blogging",
			tags: [
				{
					"text": "Website",
					"url": "https://yotryu.github.io/travel-blog/"
				}
			],
			aspect: 1.5,
			previewImage: "https://lh3.googleusercontent.com/d/1IM2S5cOY3G0tXI50SsvnMSWQIWX8QMni?authuser=0",
			description: "A personal passion project to get more hands-on with modern web development.\nAfter an overseas trip with the family, I wanted a neat way to share memories. Having used other platforms in the past to do travel blogging with, I wanted to see if I could do something more unique, so used this as an opportunity to do just that.\nMade using Svelte kit, hosted on GitHub static sites."
		}
	]
};