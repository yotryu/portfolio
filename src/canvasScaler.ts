import * as THREE from "three";
import * as Utils from "./libs/utils";

"use strict"

export interface AnchorableOptions
{
	refX?: number | Utils.OrientationValue;
	refY?: number | Utils.OrientationValue;
	anchorX?: number | Utils.OrientationValue;
	anchorY?: number | Utils.OrientationValue;
	negateScalerScale?: boolean;
}

export type AnchorableRepositionDelegate = (scaler: CanvasScaler) => void;

export class Anchorable extends THREE.Object3D
{
	private _options: AnchorableOptions;
	private _scaler: CanvasScaler;

	public RepositionCallback: AnchorableRepositionDelegate;


	constructor(options: AnchorableOptions, repositionCallback: AnchorableRepositionDelegate)
	{
		super();

		this._scaler = null;
		this._options = options;

		this.RepositionCallback = repositionCallback;
	}

	setOptions(options: AnchorableOptions)
	{
		for (const key in options)
		{
			this._options[key] = options[key];
		}

		this.updatePosition();
	}

	setScaler(scaler: CanvasScaler)
	{
		this._scaler = scaler;
	}

	options()
	{
		return this._options;
	}

	findScaler()
	{
		let check = this.parent;

		while (check != null)
		{
			if (check instanceof CanvasScaler)
			{
				this._scaler = check;
				break;
			}

			check = check.parent;
		}
	}

	updatePosition()
	{
		if (!this._scaler)
		{
			// try to find the scaler for this anchorable
			this.findScaler();
			
			if (!this._scaler)
			{
				// none in the hierarchy, so can't do anything at the moment
				return;
			}
		}

		const scaler = this._scaler;

		this.position.set(
			Utils.getOrientationValue(this._options.anchorX) * scaler.width() + Utils.getOrientationValue(this._options.refX) - scaler.halfWidth(),
			Utils.getOrientationValue(this._options.anchorY) * scaler.height() + Utils.getOrientationValue(this._options.refY) - scaler.halfHeight(),
			0);

		if (this._options.negateScalerScale)
		{
			this.position.set(this.position.x / scaler.scale.x, this.position.y / scaler.scale.y, this.position.z / scaler.scale.z);
			this.scale.set(1 / scaler.scale.x, 1 / scaler.scale.y, 1 / scaler.scale.z);
		}

		if (this.RepositionCallback)
		{
			this.RepositionCallback(scaler);
		}
	}
}


export type CanvasScalerNotifyDelegate = (scaler: CanvasScaler) => void;

export class CanvasScaler extends THREE.Object3D
{
	private _refWidth: number;
	private _refHeight: number;
	private _unprojectVec: THREE.Vector3;
	private _worldBottomLeft: THREE.Vector3;
	private _worldTopRight: THREE.Vector3;
	private _width: number;
	private _height: number;
	private _halfWidth: number;
	private _halfHeight: number;
	private _camera: THREE.Camera;
	private _canvas: HTMLCanvasElement;
	private _pixelsPerWorldUnit: number;
	private _notifies: CanvasScalerNotifyDelegate[];


	constructor(refWidth: number, refHeight: number, camera: THREE.Camera, canvas: HTMLCanvasElement)
	{
		super();

		this._refWidth = refWidth;
		this._refHeight = refHeight;
		this._unprojectVec = new THREE.Vector3();
		this._worldBottomLeft = new THREE.Vector3();
		this._worldTopRight = new THREE.Vector3();
		this._width = 0;
		this._height = 0;
		this._halfWidth = 0;
		this._halfHeight = 0;
		this._camera = camera;
		this._canvas = canvas;
		this._pixelsPerWorldUnit = 0;

		this._notifies = [];

		this.updateScale();
	}

	updateScale()
	{
		// bottom left
		this._unprojectVec.set(-1, -1, 0.5);
		this._unprojectVec.unproject(this._camera);
		this._unprojectVec.sub(this._camera.position).normalize();
		
		let distance = -this._camera.position.z / this._unprojectVec.z;
		this._worldBottomLeft.copy(this._camera.position).add(this._unprojectVec.multiplyScalar(distance));

		// top right
		this._unprojectVec.set(1, 1, 0.5);
		this._unprojectVec.unproject(this._camera);
		this._unprojectVec.sub(this._camera.position).normalize();
		
		distance = -this._camera.position.z / this._unprojectVec.z;
		this._worldTopRight.copy(this._camera.position).add(this._unprojectVec.multiplyScalar(distance));

		// convert canvas space to world space
		this._width = this._worldTopRight.x - this._worldBottomLeft.x;
		this._height = this._worldTopRight.y - this._worldBottomLeft.y;
		this._halfWidth = this._width * 0.5;
		this._halfHeight = this._height * 0.5;
		this._pixelsPerWorldUnit = this._canvas.clientWidth / this._width;

		const shortSize = this._width < this._height ? this._width : this._height;
		const shortRefSize = this._refWidth < this._refHeight ? this._refWidth : this._refHeight;

		const scale = shortSize / shortRefSize;
		this.scale.set(scale, scale, scale);

		// update width and height unscaled to compensate for the scaling that is now set
		this._width /= scale;
		this._height /= scale;
		this._halfWidth /= scale;
		this._halfHeight /= scale;

		this.traverse(obj =>
		{
			if (obj instanceof Anchorable)
			{
				obj.updatePosition();
			}
		});

		this._notifies.forEach(func =>
		{
			func(this);
		});
	}

	override add(obj: THREE.Object3D)
	{
		super.add(obj);

		obj.traverse(child =>
		{
			if (child instanceof Anchorable)
			{
				child.updatePosition();
			}
		});

		return this;
	}

	addNotify(notifyFunc: CanvasScalerNotifyDelegate, callNow: boolean)
	{
		this._notifies.push(notifyFunc);

		if (callNow)
		{
			notifyFunc(this);
		}
	}

	removeNotify(notifyFunc: CanvasScalerNotifyDelegate)
	{
		const index = this._notifies.findIndex((item) => notifyFunc == item);
		if (index >= 0)
		{
			this._notifies.splice(index, 1);
		}
	}

	width()
	{
		return this._width;
	}

	height()
	{
		return this._height;
	}

	halfWidth()
	{
		return this._halfWidth;
	}

	halfHeight()
	{
		return this._halfHeight;
	}

	pixelsPerWorldUnit()
	{
		return this._pixelsPerWorldUnit;
	}

	canvas()
	{
		return this._canvas;
	}
}