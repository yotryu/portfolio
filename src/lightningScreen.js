import { AppScreen } from "./appScreen.js";
import { Anchorable } from "./canvasScaler.js";
import { ImageLink } from "./imageLink.js";
import * as ContentTypes from "./pageContentTypes.js";
import * as Constants from "./constants.js";

"use strict"

const screenshotWidth = 1.2;
const screenshotHeight = screenshotWidth * 1.778;
const padding = 0.5;

const itemConfigs = 
[
	{
		id: "overview",
		title: "Overview",
		content:
		[
			{
				type: ContentTypes.ContentYoutubePlayer,
				anchorable:
				{
					refX: { l: 0, p: 0 },
					refY: { l: -7, p: 0 },
					anchorX: { l: 0.5, p: 0.5 },
					anchorY: { l: 1, p: 0.5 },
				},
				video:
				{
					maxWidth: { l: 10, p: 12 },
					maxHeight: { l: 6, p: 7.2 },
					worldX: 0,
					worldY: 0,
					pivotX: 0.5,
					pivotY: 0.5,
					url: "https://www.youtube.com/embed/RPINykWhxd8"
				}
			},
			{
				type: ContentTypes.ContentText,
				anchorable: 
				{
					refX: { l: 5, p: 5 },
					refY: { l: -2.8, p: -3 },
					anchorX: { l: 0, p: 0 },
					anchorY: { l: 1, p: 1 },
				},
				text:
				{
					maxWidth: 8,
					worldX: 0,
					worldY: 0,
					pivotX: 0,
					pivotY: 1,			
					text: "The most dynamic and unique lightning wallpaper there is!"
				}
			},
			{
				type: ContentTypes.ContentText,
				anchorable: 
				{
					refX: { l: 0, p: 0 },
					refY: { l: 3.5, p: 2.8 },
					anchorX: { l: 0.5, p: 0.5 },
					anchorY: { l: 0, p: 0 },
				},
				text:
				{
					maxWidth: { l: 12, p: 12 },
					worldX: 0,
					worldY: 0,
					pivotX: { l: 0.5, p: 0.5 },
					pivotY: { l: 0.5, p: 0 },			
					text: "Every time the lightning changes you will see a completely unique bolt light up your device – fully dynamic calculation means no two versions will look the same!"
				}
			}
		]
	},
	{
		id: "screenshots",
		title: "Screenshots",
		content:
		[
			{
				type: ContentTypes.ContentTable,
				position:
				{
					xPercent: 0.5,
					yPercent: 0.5,
					xAdd: 0,
					yAdd: 0,
					widthPercent: 1,
					widthAdd: 0,
					heightAdd: 0,
					pivotX: 0.5,
					pivotY: 0.51
				},
				cellWidth: screenshotWidth + padding,
				cellHeight: screenshotHeight + padding,
				cellsIgnoreScalerScale: true,
				cellData:
				[
					// omit anchorable since table will fill it in
					{
						type: ContentTypes.ContentThumbnail,
						thumbnail:
						{
							maxWidth: screenshotWidth,
							maxHeight: screenshotHeight,
							thumbPath: "/resources/screenshots/lightning/5_01.jpg",
							imagePath: "/resources/screenshots/lightning/5_01.png"
						}
					},
					{
						type: ContentTypes.ContentThumbnail,
						thumbnail:
						{
							maxWidth: screenshotWidth,
							maxHeight: screenshotHeight,
							thumbPath: "/resources/screenshots/lightning/5_02.jpg",
							imagePath: "/resources/screenshots/lightning/5_02.png"
						}
					},
					{
						type: ContentTypes.ContentThumbnail,
						thumbnail:
						{
							maxWidth: screenshotWidth,
							maxHeight: screenshotHeight,
							thumbPath: "/resources/screenshots/lightning/5_03.jpg",
							imagePath: "/resources/screenshots/lightning/5_03.png"
						}
					},
					{
						type: ContentTypes.ContentThumbnail,
						thumbnail:
						{
							maxWidth: screenshotWidth,
							maxHeight: screenshotHeight,
							thumbPath: "/resources/screenshots/lightning/5_04.jpg",
							imagePath: "/resources/screenshots/lightning/5_04.png"
						}
					},
					{
						type: ContentTypes.ContentThumbnail,
						thumbnail:
						{
							maxWidth: screenshotWidth,
							maxHeight: screenshotHeight,
							thumbPath: "/resources/screenshots/lightning/5_05.jpg",
							imagePath: "/resources/screenshots/lightning/5_05.png"
						}
					},
					{
						type: ContentTypes.ContentThumbnail,
						thumbnail:
						{
							maxWidth: screenshotWidth,
							maxHeight: screenshotHeight,
							thumbPath: "/resources/screenshots/lightning/5_06.jpg",
							imagePath: "/resources/screenshots/lightning/5_06.png"
						}
					},
					{
						type: ContentTypes.ContentThumbnail,
						thumbnail:
						{
							maxWidth: screenshotWidth,
							maxHeight: screenshotHeight,
							thumbPath: "/resources/screenshots/lightning/5_07.jpg",
							imagePath: "/resources/screenshots/lightning/5_07.png"
						}
					},
					{
						type: ContentTypes.ContentThumbnail,
						thumbnail:
						{
							maxWidth: screenshotWidth,
							maxHeight: screenshotHeight,
							thumbPath: "/resources/screenshots/lightning/5_08.jpg",
							imagePath: "/resources/screenshots/lightning/5_08.png"
						}
					},
					{
						type: ContentTypes.ContentThumbnail,
						thumbnail:
						{
							maxWidth: screenshotWidth,
							maxHeight: screenshotHeight,
							thumbPath: "/resources/screenshots/lightning/5_09.jpg",
							imagePath: "/resources/screenshots/lightning/5_09.png"
						}
					},
				]
			}
		]
	},
	{
		id: "privacy",
		title: "Privacy Policy",
		content: 
		[
			{
				type: ContentTypes.ContentText,
				anchorable: 
				{
					refX: { l: 5, p: 5 },
					refY: { l: -2.6, p: -2.6 },
					anchorX: { l: 0, p: 0 },
					anchorY: { l: 1, p: 1 },
				},
				text:
				{
					maxWidth: 3,
					worldX: 0,
					worldY: 0,
					pivotX: 0,
					pivotY: 1,			
					text: "Privacy Policy"
				}
			},
			{
				type: ContentTypes.ContentText,
				anchorable: 
				{
					refX: { l: 1, p: 1 },
					refY: { l: 2, p: 3 },
					anchorX: { l: 0, p: 0 },
					anchorY: { l: 0.5, p: 0.5 },
				},
				text:
				{
					maxWidth: { l: 12, p: 8 },
					worldX: 0,
					worldY: 0,
					pivotX: { l: 0, p: 0 },
					pivotY: { l: 0.5, p: 0.5 },			
					text: "This Privacy Policy applies to the 'Lightning Wallpaper' app provided by Jonathan Marc Law (ABN 85 500 736 817). This will be referred to as the 'Product' on this page."
				}
			},
			{
				type: ContentTypes.ContentText,
				anchorable: 
				{
					refX: { l: -1, p: -1 },
					refY: { l: 0, p: 0 },
					anchorX: { l: 1, p: 1 },
					anchorY: { l: 0.5, p: 0.5 },
				},
				text:
				{
					maxWidth: { l: 12, p: 8 },
					worldX: 0,
					worldY: 0,
					pivotX: { l: 1, p: 1 },
					pivotY: { l: 0.5, p: 0.5 },
					text: "No data of any kind (personally identifiable or otherwise) is collected or stored by Jonathan Marc Law in relation to your use of the Product."
				}
			},
			{
				type: ContentTypes.ContentText,
				anchorable: 
				{
					refX: { l: 1, p: 1 },
					refY: { l: -2, p: -3 },
					anchorX: { l: 0, p: 0 },
					anchorY: { l: 0.5, p: 0.5 },
				},
				text:
				{
					maxWidth: { l: 12, p: 8 },
					worldX: 0,
					worldY: 0,
					pivotX: { l: 0, p: 0 },
					pivotY: { l: 0.5, p: 0.5 },			
					text: "Data will be saved and stored on your device for the sole purpose of recording your configuration options for use with the Product."
				}
			},
			{
				type: ContentTypes.ContentText,
				anchorable: 
				{
					refX: { l: 0, p: -1 },
					refY: { l: -4, p: -5 },
					anchorX: { l: 0.5, p: 1 },
					anchorY: { l: 0.5, p: 0.5 },
				},
				text:
				{
					maxWidth: { l: 4, p: 4 },
					worldX: 0,
					worldY: 0,
					pivotX: { l: 0.5, p: 1 },
					pivotY: { l: 0.5, p: 0.5 },			
					text: "That’s it! Enjoy the app!"
				}
			}
		]
	}
];

export class LightningScreen extends AppScreen
{
	constructor(context)
	{
		super(context, itemConfigs);

		this.appStoreAnchor = new Anchorable(-2, -1.5, 1, 1);
		this.appStoreLink = new ImageLink(this.appStoreAnchor, 
		{
			cssClass: "imageLink",
			maxWidth: 4,
			maxHeight: 1.5,
			worldX: 0,
			worldY: 0,
			pivotX: 0.5,
			pivotY: 0.5,
			imagePath: Constants.playStoreBadgePng, 
			linkUrl: "https://play.google.com/store/apps/details?id=com.jonathanlaw.lightningwallpaper"
		});

		this.appContext.contentScaler.add(this.appStoreAnchor);
	}

	dispose()
	{
		super.dispose();

		this.appStoreLink.dispose();
		this.appContext.contentScaler.remove(this.appStoreAnchor);
	}

	update(dt)
	{
		super.update(dt);

		this.appStoreLink.update();
	}
}