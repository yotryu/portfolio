import { AppScreen, Page } from "./appScreen.js";
import {LandingScreen, LandingScreenItem} from "./landingScreen.js";
import {LightningScreen} from "./lightningScreen.js";
import {GeoGridScreen} from "./geogridScreen.js";
import { AppContext } from "./appContext.js";

"use strict"

export interface NavData
{
	type: typeof AppScreen | typeof LandingScreen;
	title: string;
	path: string;
}

interface NextScreenData
{
	type: typeof AppScreen | typeof LandingScreen;
	index: number;
}

export const NavApps: NavData[] = 
[
	{
		type: LightningScreen,
		title: "Lightning Wallpaper",
		path: "/#lightning"
	},
	{
		type: GeoGridScreen,
		title: "Geo Prism Wallpaper",
		path: "/#geogrid"
	}
];

export const NavOther: NavData[] =
[
	{
		type: LandingScreen,
		title: "News",
		path: "/#news"
	},
	{
		type: LandingScreen,
		title: "About",
		path: "/#about"
	},
	{
		type: LandingScreen,
		title: "Contact",
		path: "/#contact"
	}
];

export class Navigation
{
	private _appContext: AppContext;
	private _siteUrl: string;
	private _lastUrl: string;
	private _currentPath: string;
	private _originData: Page | LandingScreenItem;

	private _landingScreen: LandingScreen;
	private _currentScreen: AppScreen | LandingScreen;
	private _nextScreen: NextScreenData;
	


	constructor(context: AppContext)
	{
		this._appContext = context;

		this._siteUrl = location.href.slice(0, location.href.lastIndexOf("/"));
		this._lastUrl = "";
		this._currentPath = "";
		this._originData = null;

		this._landingScreen = null;
		this._currentScreen = null;
		this._nextScreen = null;
	}

	init()
	{
		this._landingScreen = new LandingScreen(this._appContext);
		this._currentScreen = this._landingScreen;
		this._landingScreen.show();
	}

	getCurrentPath()
	{
		return this._currentPath;
	}

	setNewDestination(path: string, data: Page | LandingScreenItem)
	{
		this._originData = data;
		location.href = this._siteUrl + path;

		this.navigateToUrl(location.href);
	}

	getScreenTypeForUrl(options: NavData[], url: string): NextScreenData
	{
		for (let i = 0; i < options.length; ++i)
		{
			const current = options[i];

			if (url.includes(current.path))
			{
				return { type: current.type, index: i };
			}
		}

		return null;
	}

	private onHideDone(originData: Page | LandingScreenItem)
	{
		if (this._currentScreen != this._landingScreen)
		{
			// remove previous screen from memory
			this._currentScreen.dispose();
		}

		if (this._nextScreen.type == LandingScreen)
		{
			// special case, since this is the common root of all other "pages"
			this._currentScreen = this._landingScreen;
		}
		else
		{
			this._currentScreen = new this._nextScreen.type(this._appContext, null);
		}
		
		this._currentScreen.show(originData);
	}

	navigateToUrl(url: string)
	{
		this._currentPath = url.slice(url.lastIndexOf("/"));
		let nextScreen: NextScreenData = null;

		// attempt to navigate to an app screen
		nextScreen = this.getScreenTypeForUrl(NavApps, url) || null;

		if (nextScreen == null)
		{
			// no apps found, so try other
			nextScreen = this.getScreenTypeForUrl(NavOther, url) || null;
		}
		else
		{
			// special case - landing screen needs to give back the item to pass through
			this._originData = this._landingScreen.getItemAtIndex(nextScreen.index);
		}

		if (nextScreen == null)
		{
			// nothing found, so we're at landing
			nextScreen = { type: LandingScreen, index: -1 };
		}

		if (this._currentScreen instanceof nextScreen.type == false)
		{
			this._nextScreen = nextScreen;

			// need to navigate to a new screen, so tell the current screen to hide
			this._currentScreen.hide(this.onHideDone.bind(this), this._originData);
		}
		else if (this._currentScreen instanceof AppScreen && this._currentScreen.onPathChanged)
		{
			this._currentScreen.onPathChanged(this._currentPath);
		}

		this._originData = null;
		this._lastUrl = url;
	}

	update(dt: number)
	{
		if (location.href != this._lastUrl)
		{
			this.navigateToUrl(location.href);
		}

		if (this._currentScreen)
		{
			this._currentScreen.update(dt);
		}
	}
}