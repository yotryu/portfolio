import * as THREE from "three";
import { CanvasScaler } from "./canvasScaler.js";

"use strict"

export interface HtmlContentOptions
{
	maxWidth?: number;
	maxHeight?: number;
	pivotX?: number;
	pivotY?: number;
	worldX: number;
	worldY: number;
	cssClass?: string;
}

export class HtmlContent extends THREE.Object3D
{
	protected _options: HtmlContentOptions = null;
	protected _element: HTMLElement = null;
	protected _canvasScaler: CanvasScaler = null;
	protected _haveOptionsChanged: boolean = false;

	protected static tempScale = new THREE.Vector3();
	protected static tempPos = new THREE.Vector3();


	constructor(attachTo: THREE.Object3D, options: HtmlContentOptions)
	{
		super();

		this._options = options;

		this._element = document.createElement("div");
		this._element.classList.add(options.cssClass);
		this._element.style.height = options.maxHeight ? options.maxHeight.toString() : "";
		this._element.style.width = options.maxWidth ? options.maxWidth.toString() : "";

		document.body.appendChild(this._element);

		attachTo.add(this);
		(this as THREE.Object3D).position.set(options.worldX, options.worldY, 0);

		this._canvasScaler = null;
		this._haveOptionsChanged = false;

		this.update();
	}

	dispose()
	{
		document.body.removeChild(this._element);

		if (this.parent)
		{
			this.parent.remove(this);
		}
	}

	setOptions(options: HtmlContentOptions)
	{
		// only update values we've been given
		for (let key in options)
		{
			this._options[key] = options[key];
		}
		
		(this as THREE.Object3D).position.set(this._options.worldX, this._options.worldY, 0);

		this._haveOptionsChanged = true;
	}

	findCanvasScaler()
	{
		if (this._canvasScaler)
		{
			return;
		}

		let checkParent = (this as THREE.Object3D).parent;
		while (checkParent && this._canvasScaler == null)
		{
			if (checkParent instanceof CanvasScaler)
			{
				this._canvasScaler = checkParent;
			}

			checkParent = checkParent.parent;
		}
	}

	update()
	{
		// store the temp transform values regardless, as subclasses may want to use this
		(this as THREE.Object3D).getWorldScale(HtmlContent.tempScale);
		(this as THREE.Object3D).getWorldPosition(HtmlContent.tempPos);

		this.findCanvasScaler();

		if (this._canvasScaler == null)
		{
			return;
		}

		this._element.style.width = Math.round(this._canvasScaler.pixelsPerWorldUnit() * this._options.maxWidth * HtmlContent.tempScale.x) + "px";

		if (this._options.maxHeight)
		{
			this._element.style.height = Math.round(this._canvasScaler.pixelsPerWorldUnit() * this._options.maxHeight * HtmlContent.tempScale.y) + "px";
		}

		let clientWidth = this._element.clientWidth;
		let clientHeight = this._element.clientHeight;
		let left = this._canvasScaler.canvas().width * 0.5 + this._canvasScaler.pixelsPerWorldUnit() * HtmlContent.tempPos.x - clientWidth * this._options.pivotX;
		let top = this._canvasScaler.canvas().height * 0.5 - this._canvasScaler.pixelsPerWorldUnit() * HtmlContent.tempPos.y - clientHeight * (1 - this._options.pivotY);

		if (left < 0)
		{
			// recalculate width based on how much has gone off screen
			clientWidth = Math.max(0, left + clientWidth);
			left = 0;

			this._element.style.width = clientWidth + "px";
		}

		if (left + clientWidth > this._canvasScaler.canvas().width)
		{
			// recalculate width based on how much has gone off screen
			clientWidth = this._canvasScaler.canvas().width - left;
			this._element.style.width = clientWidth + "px";
		}

		this._element.style.left = left + "px";
		this._element.style.top = top + "px";

		this._haveOptionsChanged = false;
	}
}