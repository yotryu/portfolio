import * as THREE from "three";
import * as Constants from "./constants.js";
import * as Utils from "./libs/utils.js";
import { BackingFrame } from "./backingFrame.js";
import { Anchorable, AnchorableOptions, CanvasScaler, CanvasScalerNotifyDelegate } from "./canvasScaler.js";
import { TextBox } from "./textBox.js";
import { ImageLink, ImageLinkOptions } from "./imageLink.js";
import { YoutubePlayer } from "./youtubePlayer.js";
import { AppContext } from "./appContext.js";


export interface ContentData
{
	type: typeof ContentType;
	preventNotify?: boolean;
	anchorable?: AnchorableOptions;

	// for now collecting all variant data in here for simplicity
	text?: ContentTextData;
	thumbnail?: ContentThumbnailData;
	imageLink?: ContentImageLinkData;
	video?: ContentYoutubePlayerData;
	table?: ContentTableData;
}


export class ContentType
{
	protected _appContext: AppContext;
	protected _parent: THREE.Object3D;
	protected _data: ContentData;
	protected _anchor: Anchorable;
	protected _sizeChangeCallback: CanvasScalerNotifyDelegate;


	constructor(context: AppContext, parent: THREE.Object3D, data: ContentData)
	{
		this._appContext = context;
		this._parent = parent;
		this._data = data;
		this._anchor = null;

		this.setSizeChangeCb(this.onCanvasSizeChanged.bind(this));
	}

	setSizeChangeCb(sizeChangeCb: CanvasScalerNotifyDelegate)
	{
		this._appContext.contentScaler.removeNotify(this._sizeChangeCallback);
		
		this._sizeChangeCallback = sizeChangeCb;

		if (this._data.preventNotify != true && this._sizeChangeCallback != null)
		{
			this._appContext.contentScaler.addNotify(this._sizeChangeCallback, false);
		}
	}

	onCanvasSizeChanged(scaler: CanvasScaler)
	{
		const anchorData = this._data.anchorable;

		if (anchorData && this._anchor)
		{
			this._anchor.setOptions(
				{
					refX: Utils.getOrientationValue(anchorData.refX),
					refY: Utils.getOrientationValue(anchorData.refY),
					anchorX: Utils.getOrientationValue(anchorData.anchorX),
					anchorY: Utils.getOrientationValue(anchorData.anchorY)
				}
			);
		}
	}

	anchor()
	{
		return this._anchor;
	}

	show()
	{}

	hide()
	{}

	update(dt: number)
	{}

	processClick(clickedObj: THREE.Object3D)
	{}

	dispose()
	{
		this._appContext.contentScaler.removeNotify(this._sizeChangeCallback);
	}
}


export interface ContentTextData
{
	text: string;
	maxWidth: number | Utils.OrientationValue;
	worldX: number;
	worldY: number;
	pivotX: number | Utils.OrientationValue;
	pivotY: number | Utils.OrientationValue;
}

export class ContentText extends ContentType
{
	private _textGroup: THREE.Group;
	private _backingFrame: BackingFrame;
	private _text: TextBox;
	

	constructor(context: AppContext, parent: THREE.Object3D, data: ContentData)
	{
		super(context, parent, data);

		this.setSizeChangeCb(this.onCanvasSizeChanged.bind(this));

		const anchorData = data.anchorable;
		this._anchor = new Anchorable(
			{
				refX: Utils.getOrientationValue(anchorData.refX),
				refY: Utils.getOrientationValue(anchorData.refY),
				anchorX: Utils.getOrientationValue(anchorData.anchorX),
				anchorY: Utils.getOrientationValue(anchorData.anchorY)
			},
			null
		);

		const textData = data.text;
		this._textGroup = new THREE.Group();
		this._textGroup.scale.set(0, 0, 0);

		const backingFrame = this._backingFrame = new BackingFrame(0.2);

		this._anchor.add(this._textGroup);
			this._textGroup.add(this._backingFrame);

		const text = this._text = new TextBox(this._textGroup, 
		{
			cssClass: "textBody",
			maxWidth: Utils.getOrientationValue(textData.maxWidth),
			worldX: Utils.getOrientationValue(textData.worldX),
			worldY: Utils.getOrientationValue(textData.worldY),
			pivotX: Utils.getOrientationValue(textData.pivotX),
			pivotY: Utils.getOrientationValue(textData.pivotY),
			text: textData.text
		});
		this._text.onSizeChanged = function(width: number, height: number)
		{
			backingFrame.setSize(width + 0.1, height + 0.1);
			backingFrame.position.set(width * (-text.options.pivotX + 0.5), height * (-text.options.pivotY + 0.5), 0);
		};
	}

	override dispose()
	{
		super.dispose();

		this._text.dispose();
	}

	override onCanvasSizeChanged(scaler: CanvasScaler)
	{
		super.onCanvasSizeChanged(scaler);

		const textData = this._data.text;

		this._text.setOptions(
			{
				maxWidth: Utils.getOrientationValue(textData.maxWidth),
				pivotX: Utils.getOrientationValue(textData.pivotX),
				pivotY: Utils.getOrientationValue(textData.pivotY),
				worldX: Utils.getOrientationValue(textData.worldX),
				worldY: Utils.getOrientationValue(textData.worldY)
			}
		);
	}

	override show()
	{
		if (this._anchor.parent == null)
		{
			this._parent.add(this._anchor);
			this._anchor.updatePosition();

			this._textGroup.scale.set(1, 1, 1);
		}
	}

	override hide()
	{
		this._parent.remove(this._anchor);
		this._textGroup.scale.set(0, 0, 0);
	}

	override update(dt: number)
	{
		this._text.update();
	}
}


export interface ContentThumbnailData
{
	thumbPath: string;
	imagePath: string;
	maxWidth?: number | Utils.OrientationValue;
	maxHeight?: number | Utils.OrientationValue;
}

export class ContentThumbnail extends ContentType
{
	private _group: THREE.Group;
	private _fullDiv: HTMLDivElement;
	private _loadingDiv: HTMLDivElement;
	private _imagePath: string;
	private _thumbnailTexture: THREE.Texture<HTMLImageElement>;
	private _backingFrame: THREE.Mesh;
	private _thumbnail: THREE.Mesh;


	constructor(context: AppContext, parent: THREE.Object3D, data: ContentData)
	{
		super(context, parent, data);

		this.setSizeChangeCb(this.onCanvasSizeChanged.bind(this));

		const thumbData = data.thumbnail;
		const anchorData = data.anchorable;
		this._anchor = new Anchorable(
			{
				refX: Utils.getOrientationValue(anchorData.refX),
				refY: Utils.getOrientationValue(anchorData.refY),
				anchorX: Utils.getOrientationValue(anchorData.anchorX),
				anchorY: Utils.getOrientationValue(anchorData.anchorY)
			},
			null
		);

		this._group = new THREE.Group();
		this._group.scale.set(0, 0, 0);

		this._fullDiv = null;
		this._loadingDiv = null;
		this._imagePath = thumbData.imagePath;
		
		this._thumbnailTexture = new THREE.TextureLoader().load(thumbData.thumbPath, function(texture)
		{
			this.resizeThumbnail();
		}.bind(this));

		this._backingFrame = new THREE.Mesh(Constants.geometry.unitPlane, Constants.materials.textBackingFrame);
		this._thumbnail = new THREE.Mesh(Constants.geometry.unitPlane, new THREE.MeshBasicMaterial(
			{
				blending: THREE.NormalBlending,
				side: THREE.FrontSide,
				depthTest: true,
				transparent: true,
				map: this._thumbnailTexture
			}
		));

		this._anchor.add(this._group);
			this._group.add(this._backingFrame);
			this._group.add(this._thumbnail);
	}

	resizeThumbnail()
	{
		const thumbData = this._data.thumbnail;
		const aspect = this._thumbnailTexture.image.width / this._thumbnailTexture.image.height;
		const dataMaxWidth = Utils.getOrientationValue(thumbData.maxWidth);
		const dataMaxHeight = Utils.getOrientationValue(thumbData.maxHeight);
		let width = 1;
		let height = 1 / aspect;

		if (dataMaxWidth)
		{
			width = dataMaxWidth;
			height = width / aspect;
		}

		if (dataMaxHeight)
		{
			const maxHeight = dataMaxWidth ? Math.min(height, dataMaxHeight) : dataMaxHeight;
			height = maxHeight;
			width = height * aspect;
		}

		this._thumbnail.scale.set(width, height, 1);
		this._backingFrame.scale.set(width + 0.2, height + 0.2, 1);
	}

	override onCanvasSizeChanged(scaler: CanvasScaler)
	{
		super.onCanvasSizeChanged(scaler);
		
		this.resizeThumbnail();
	}

	override show()
	{
		if (this._anchor.parent == null)
		{
			this._parent.add(this._anchor);
			this._anchor.updatePosition();
		}

		this._group.scale.set(1, 1, 1);
		this._appContext.contentInteractManager.untrackObject(this._backingFrame);
		this._appContext.contentInteractManager.trackObject(this._backingFrame);
	}

	override hide()
	{
		this._parent.remove(this._anchor);
		this._group.scale.set(0, 0, 0);
		this._appContext.contentInteractManager.untrackObject(this._backingFrame);
	}

	override processClick(clickedObj: THREE.Object3D)
	{
		if (clickedObj == this._backingFrame)
		{
			this.showFullImage();
		}
		else
		{
			this.hideFullImage();
		}
	}

	showFullImage()
	{
		if (this._fullDiv != null)
		{
			return;
		}

		this._appContext.contentInteractManager.enabled = false;

		this._fullDiv = document.createElement("div");
		this._fullDiv.classList.add("overlay");

		this._loadingDiv = document.createElement("div");
		this._loadingDiv.classList.add("loading");

		const spinner = document.createElement("div");
		spinner.classList.add("spinner");

		const image = document.createElement("img");
		image.classList.add("fullImage");
		image.src = this._imagePath;

		if (image.complete == false)
		{
			image.addEventListener("load", function()
			{
				this._loadingDiv.style.animation = "fadeOut 0.3s ease";
				this._loadingDiv.addEventListener("animationend", () =>
					{
						this._loadingDiv.style.display = "none";
					},
					{ once: true } 
				);
			}.bind(this));

			this._loadingDiv.appendChild(spinner);
			this._fullDiv.appendChild(this._loadingDiv);
		}

		this._fullDiv.appendChild(image);

		document.body.appendChild(this._fullDiv);
	}

	hideFullImage()
	{
		if (this._fullDiv == null)
		{
			return;
		}

		document.body.removeChild(this._fullDiv);

		this._fullDiv = null;
		this._loadingDiv = null;

		this._appContext.contentInteractManager.enabled = true;
	}

	getInteractObject()
	{
		return this._backingFrame;
	}
}


export interface ContentImageLinkData
{
	maxWidth?: number | Utils.OrientationValue;
	maxHeight?: number | Utils.OrientationValue;
	pivotX?: number | Utils.OrientationValue;
	pivotY?: number | Utils.OrientationValue;
	worldX?: number | Utils.OrientationValue;
	worldY?: number | Utils.OrientationValue;

	imageLink: ImageLinkOptions;
}

export class ContentImageLink extends ContentType
{
	private _group: THREE.Group;
	private _image: ImageLink;


	constructor(context: AppContext, parent: THREE.Object3D, data: ContentData)
	{
		super(context, parent, data);

		this.setSizeChangeCb(this.onCanvasSizeChanged.bind(this));

		const imageData = data.imageLink;
		const anchorData = data.anchorable;
		this._anchor = new Anchorable(
			{
				refX: Utils.getOrientationValue(anchorData.refX),
				refY: Utils.getOrientationValue(anchorData.refY),
				anchorX: Utils.getOrientationValue(anchorData.anchorX),
				anchorY: Utils.getOrientationValue(anchorData.anchorY)
			},
			null
		);

		this._group = new THREE.Group();
		this._group.scale.set(0, 0, 0);

		this._image = new ImageLink(this._group, imageData.imageLink);

		this._group.add(this._image);
		this._anchor.add(this._group);
	}

	override dispose()
	{
		super.dispose();

		this._image.dispose();
	}

	override onCanvasSizeChanged(scaler: CanvasScaler)
	{
		super.onCanvasSizeChanged(scaler);

		const imageData = this._data.imageLink;

		this._image.setOptions(
			{
				maxWidth: Utils.getOrientationValue(imageData.maxWidth),
				maxHeight: Utils.getOrientationValue(imageData.maxHeight),
				pivotX: Utils.getOrientationValue(imageData.pivotX),
				pivotY: Utils.getOrientationValue(imageData.pivotY),
				worldX: Utils.getOrientationValue(imageData.worldX),
				worldY: Utils.getOrientationValue(imageData.worldY),
			}
		);
	}

	override show()
	{
		if (this._anchor.parent == null)
		{
			this._parent.add(this._anchor);
			this._anchor.updatePosition();
		}

		this._group.scale.set(1, 1, 1);
	}

	override hide()
	{
		this._parent.remove(this._anchor);
		this._group.scale.set(0, 0, 0);
	}

	override update(dt: number)
	{
		this._image.update();
	}
}


export interface ContentYoutubePlayerData
{
	url: string;
	maxWidth?: number | Utils.OrientationValue;
	maxHeight?: number | Utils.OrientationValue;
	pivotX?: number | Utils.OrientationValue;
	pivotY?: number | Utils.OrientationValue;
	worldX?: number | Utils.OrientationValue;
	worldY?: number | Utils.OrientationValue;
}

export class ContentYoutubePlayer extends ContentType
{
	private _group: THREE.Group;
	private _video: YoutubePlayer;


	constructor(context: AppContext, parent: THREE.Object3D, data: ContentData)
	{
		super(context, parent, data);

		this.setSizeChangeCb(this.onCanvasSizeChanged.bind(this));

		const videoData = data.video;
		const anchorData = data.anchorable;
		this._anchor = new Anchorable(
			{
				refX: Utils.getOrientationValue(anchorData.refX),
				refY: Utils.getOrientationValue(anchorData.refY),
				anchorX: Utils.getOrientationValue(anchorData.anchorX),
				anchorY: Utils.getOrientationValue(anchorData.anchorY)
			},
			null
		);

		this._group = new THREE.Group();
		this._group.scale.set(0, 0, 0);

		this._video = new YoutubePlayer(this._group, 
		{
			cssClass: "imageLink",
			maxWidth: Utils.getOrientationValue(videoData.maxWidth),
			maxHeight: Utils.getOrientationValue(videoData.maxHeight),
			pivotX: Utils.getOrientationValue(videoData.pivotX),
			pivotY: Utils.getOrientationValue(videoData.pivotY),
			worldX: Utils.getOrientationValue(videoData.worldX),
			worldY: Utils.getOrientationValue(videoData.worldY),
			url: videoData.url
		});

		this._anchor.add(this._group);
	}

	override dispose()
	{
		super.dispose();
		this._video.dispose();
	}

	override onCanvasSizeChanged(scaler: CanvasScaler)
	{
		super.onCanvasSizeChanged(scaler);

		const videoData = this._data.video;

		this._video.setOptions(
			{
				maxWidth: Utils.getOrientationValue(videoData.maxWidth),
				maxHeight: Utils.getOrientationValue(videoData.maxHeight),
				pivotX: Utils.getOrientationValue(videoData.pivotX),
				pivotY: Utils.getOrientationValue(videoData.pivotY),
				worldX: Utils.getOrientationValue(videoData.worldX),
				worldY: Utils.getOrientationValue(videoData.worldY),
			}
		)
	}

	override show()
	{
		if (this._anchor.parent == null)
		{
			this._parent.add(this._anchor);
			this._anchor.updatePosition();
		}

		this._group.scale.set(1, 1, 1);
	}

	override hide()
	{
		this._parent.remove(this._anchor);
		this._group.scale.set(0, 0, 0);
	}

	override update(dt: number)
	{
		this._video.update();
	}
}

const tableDefaultAnchorableData: AnchorableOptions = 
{
	refX: 0,
	refY: 0,
	anchorX: 0,
	anchorY: 0
};

export interface ContentTablePositionData
{
	xPercent: number,
	yPercent: number,
	xAdd: number,
	yAdd: number,
	widthPercent: number,
	widthAdd: number,
	heightAdd: number,
	pivotX: number,
	pivotY: number
}

export interface ContentTableData
{
	position: ContentTablePositionData;
	cellWidth: number;
	cellHeight: number;
	cellsIgnoreScalerScale?: boolean;
	cellData: ContentData[];
}

export class ContentTable extends ContentType
{
	private _group: THREE.Group;
	private _cells: ContentType[];


	constructor(context: AppContext, parent: THREE.Object3D, data: ContentData)
	{
		super(context, parent, data);

		this.setSizeChangeCb(this.onCanvasSizeChanged.bind(this));

		this._group = new THREE.Group();

		// create cell items
		this._cells = [];

		data.table.cellData.forEach(item =>
		{
			// add default anchorable data so the content set itself up with initial values that we can modify
			item.anchorable = tableDefaultAnchorableData;
			item.preventNotify = true;

			const content = new item.type(context, this._group, item);

			if (data.table.cellsIgnoreScalerScale)
			{
				content.anchor().setOptions({negateScalerScale: true});
			}

			this._cells.push(content);
		});

		this.onCanvasSizeChanged(this._appContext.contentScaler);
	}

	override dispose()
	{
		super.dispose();

		this._cells.forEach(item =>
		{
			item.dispose();
		});
	}

	override show()
	{
		if (this._group.parent == null)
		{
			this._parent.add(this._group);
			this._group.scale.set(1, 1, 1);

			this._cells.forEach(item =>
			{
				item.show();
			});
		}
	}

	override hide()
	{
		this._parent.remove(this._group);
		this._group.scale.set(0, 0, 0);

		this._cells.forEach(item =>
		{
			item.hide();
		});
	}

	override processClick(clickedObj: THREE.Object3D)
	{
		this._cells.forEach(item =>
		{
			item.processClick(clickedObj);
		});
	}

	override onCanvasSizeChanged(scaler: CanvasScaler)
	{
		super.onCanvasSizeChanged(scaler);

		const posData = this._data.table.position;

		// get orientation values
		const xPercent = Utils.getOrientationValue(posData.xPercent);
		const yPercent = Utils.getOrientationValue(posData.yPercent);
		const xAdd = Utils.getOrientationValue(posData.xAdd);
		const yAdd = Utils.getOrientationValue(posData.yAdd);
		const widthPercent = Utils.getOrientationValue(posData.widthPercent);
		const widthAdd = Utils.getOrientationValue(posData.widthAdd);
		const heightAdd = Utils.getOrientationValue(posData.heightAdd);
		const pivotX = Utils.getOrientationValue(posData.pivotX);
		const pivotY = Utils.getOrientationValue(posData.pivotY);

		const cellWidth = Utils.getOrientationValue(this._data.table.cellWidth);
		const cellHeight = Utils.getOrientationValue(this._data.table.cellHeight);

		// first calculate width and extrapolate height needed to fit cells
		const width = widthPercent * scaler.width() * scaler.scale.x + widthAdd;
		const cellsPerRow = Math.max(1, Math.floor(width / cellWidth));
		const rows = Math.ceil(this._cells.length / cellsPerRow);
		const height = cellHeight * rows;

		// now calculate cell start and increment values based on pivot and sizing
		const incX = pivotX <= 0.5 ? cellWidth : -cellWidth;
		const incY = pivotY <= 0.5 ? cellHeight : -cellHeight;
		const incXSign = Math.sign(incX);
		const incYSign = Math.sign(incY);
		const pivotYMultiplier = 0.5 - Math.abs(pivotY - 0.5);
		const yOffset = -height * incYSign * pivotYMultiplier;
		const cellYOffset = cellHeight * 0.5 * incYSign;
		let cellY = yOffset + cellYOffset;

		const pivotXMultiplier = 0.5 - Math.abs(pivotX - 0.5);
		let remaining = Math.min(cellsPerRow, this._cells.length);
		let rowWidth = Math.min(cellsPerRow, remaining) * cellWidth;
		let xOffset = -rowWidth * incXSign * pivotXMultiplier;
		let cellXOffset = cellWidth * 0.5 * incXSign;
		let cellX = xOffset + cellXOffset;

		// position content
		for (let i = 0; i < this._cells.length; ++i)
		{
			const item = this._cells[i];
			item.anchor().setScaler(scaler);
			item.anchor().setOptions(
				{ 
					refX: cellX + xAdd,
					refY: cellY + yAdd,
					anchorX: xPercent,
					anchorY: yPercent
				});

			--remaining;
			cellX += incX;
			if (remaining <= 0)
			{
				// start new row
				remaining = Math.min(cellsPerRow, this._cells.length - 1 - i);
				rowWidth = Math.min(cellsPerRow, remaining) * cellWidth;
				xOffset = -rowWidth * incXSign * pivotXMultiplier;
				cellX = xOffset + cellXOffset;
				cellY += incY;
			}
		}
	}

	override update(dt: number)
	{
		this._cells.forEach(item =>
		{
			item.update(dt);
		});
	}
}