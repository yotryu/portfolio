import * as THREE from "three";
import { HtmlContent, HtmlContentOptions } from "./htmlContent.js"

"use strict"

export interface TextBoxOptions extends HtmlContentOptions
{
	text: string;
}

export type TextBoxSizeChangedDelegate = (width: number, height: number) => void;

export class TextBox extends HtmlContent
{
	protected _text: HTMLLabelElement = null;
	protected _trackingWidth: number = 0;
	protected _trackingHeight: number = 0;
	
	public onSizeChanged: TextBoxSizeChangedDelegate;


	constructor(attachTo: THREE.Object3D, options: TextBoxOptions)
	{
		super(attachTo, options);

		this._trackingWidth = 0;
		this._trackingHeight = 0;

		this._text = document.createElement("label");
		this._text.textContent = options.text;

		this._element.appendChild(this._text);

		this.onSizeChanged = null;
	}

	update()
	{
		const haveOptionsChanged = this._haveOptionsChanged;

		super.update();

		this._element.style.fontSize = 3 * HtmlContent.tempScale.x + "vh";

		if (this._canvasScaler == null)
		{
			return;
		}

		const { clientWidth, clientHeight } = this._element;

		if (clientWidth != this._trackingWidth || clientHeight != this._trackingHeight || haveOptionsChanged)
		{
			this._trackingWidth = clientWidth;
			this._trackingHeight = clientHeight;

			if (this.onSizeChanged)
			{
				this.onSizeChanged(clientWidth / this._canvasScaler.pixelsPerWorldUnit() / HtmlContent.tempScale.x, clientHeight / this._canvasScaler.pixelsPerWorldUnit() / HtmlContent.tempScale.y);
			}
		}
	}
}