import { HtmlContent, HtmlContentOptions } from "./htmlContent.js";
import * as THREE from "three";

"use strict"

export interface ImageLinkOptions extends HtmlContentOptions
{
	linkUrl: string;
	imagePath: string;
}

export class ImageLink extends HtmlContent
{
	protected _a: HTMLAnchorElement = null;
	protected _image: HTMLImageElement = null;


	constructor(attachTo: THREE.Object3D, options: ImageLinkOptions)
	{
		super(attachTo, options);

		this._a = document.createElement("a");
		this._a.classList.add("imageLink");
		this._a.href = options.linkUrl;
		this._a.target = "_blank";

		this._image = document.createElement("img");
		this._image.classList.add("resizeImage");
		this._image.src = options.imagePath;

		this._a.appendChild(this._image);
		this._element.appendChild(this._a);

		this._canvasScaler = null;
	}

	update()
	{
		super.update();

		if (this._canvasScaler == null)
		{
			return;
		}

		this._a.style.width = this._element.clientWidth + "px";
		this._a.style.height = this._element.clientHeight + "px";
	}
}