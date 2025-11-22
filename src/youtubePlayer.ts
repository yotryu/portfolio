import { HtmlContent, HtmlContentOptions } from "./htmlContent.js";
import * as THREE from "three";

"use strict"

export interface YoutubePlayerOptions extends HtmlContentOptions
{
	url: string;
}

export class YoutubePlayer extends HtmlContent
{
	protected _video: HTMLIFrameElement = null;


	constructor(attachTo: THREE.Object3D, options: YoutubePlayerOptions)
	{
		super(attachTo, options);

		this._video = document.createElement("iframe");
		this._video.width = this._options.maxWidth.toString();
		this._video.height = this._options.maxHeight.toString();
		this._video.src = options.url;
		this._video.allowFullscreen = true;
		this._video.style.border = "0";
		this._video.allow = "accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture";

		this._element.appendChild(this._video);

		this.update();
	}

	update()
	{
		super.update();

		if (this._canvasScaler == null)
		{
			return;
		}

		this._video.width = this._element.clientWidth + "px";
		this._video.height = this._element.clientHeight + "px";
	}
}