import * as THREE from "three";
import * as Resources from "./resources.js";
import * as Particles from "./particleSystem.js";
import * as Animation from "./libs/animation.js";
import * as Utils from "./libs/utils.js";
import { TextureManager } from "./textureManager.js";
import { Anchorable, CanvasScaler } from "./canvasScaler.js";

"use strict"


export interface InteractManagerTouch
{
	identifier: number;
	clientX: number;
	clientY: number;
	startTime: number;
	allowClick: boolean;
}

export type InteractManagerClickDelegate = (hit: THREE.Intersection<THREE.Object3D>) => void;

export class InteractManager
{
	enabled: boolean = false;

	private _activeTouches: InteractManagerTouch[];
	private _trackedObjects: THREE.Mesh[];
	private _interactPoint: THREE.Vector2;
	private _raycaster: THREE.Raycaster;
	private _hitObjects: THREE.Intersection<THREE.Object3D>[];
	private _clickCamera: THREE.Camera;
	private _canvasScaler: CanvasScaler;
	private _anchor: Anchorable;
	private _hoverParticles: Particles.ParticleSystem;

	private _onClickListeners: {};


	constructor(scaler: CanvasScaler, textureManager: TextureManager, clickCamera: THREE.Camera)
	{
		this.enabled = true;
		this._activeTouches = [];
		this._trackedObjects = [];
		this._interactPoint = new THREE.Vector2(-2, -2);
		this._raycaster = new THREE.Raycaster();
		this._hitObjects = [];
		this._onClickListeners = {};
		this._clickCamera = clickCamera;
		this._canvasScaler = scaler;

		const particleOptions: Particles.ParticleSystemOptions = 
		{
			emission:
			{
				rate: 30,
				shape: new Particles.ParticleSystemShapeRectangle(1, 0)
			},
			particles:
			{
				lifetime: new Utils.Range(0.3, 0.6),
				startSpeed: new Utils.Range(2, 4),
				startSize: new Utils.Range(0.5),
				sizeAnim: new Animation.AnimationTyped<number>(
					[
						new Animation.KeyframeNumber(0, 1),
						new Animation.KeyframeNumber(0.3, 1, Animation.KeyframeType.Exponential),
						new Animation.KeyframeNumber(1, 0)
					]
				),
				startAngle: new Utils.Range(Math.PI / 4),
			},
			blending: THREE.NormalBlending,
			transparent: true,
			depthTest: true,
			useWorldPosition: true,
			texture: textureManager.load(Resources.particlePng)
		};

		this._anchor = new Anchorable({refX: 0, refY: 0, anchorX: 0.5, anchorY: 0.5}, null);
		this._hoverParticles = new Particles.ParticleSystem(particleOptions);
		this._hoverParticles.rotateX(-Math.PI * 0.5);
		this._hoverParticles.pause();
		this._anchor.RepositionCallback = this._hoverParticles.setPointSizeFromCanvasScaler.bind(this._hoverParticles);

		this._canvasScaler.add(this._anchor);
			this._anchor.add(this._hoverParticles);

		window.addEventListener("mouseover", this.onMouseOver.bind(this), false);
		window.addEventListener("mouseout", this.onMouseOut.bind(this), false);
		window.addEventListener("mousemove", this.onMouseMove.bind(this), false);
		window.addEventListener("click", this.onMouseClick.bind(this), false);
		window.addEventListener("touchstart", this.onTouchStart.bind(this), { passive: false } );
		window.addEventListener("touchmove", this.onTouchMove.bind(this), { passive: false } );
		window.addEventListener("touchend", this.onTouchEnd.bind(this), { passive: false } );
		window.addEventListener("touchcancel", this.onTouchCancel.bind(this), { passive: false } );
	}

	onMouseOver(event: MouseEvent)
	{
		this._hoverParticles.play();

		this.updateInteractPosition(event);
	}

	onMouseOut(event: MouseEvent)
	{
		this._hoverParticles.pause();
	}

	onMouseMove(event: MouseEvent)
	{
		this.updateInteractPosition(event);
	}

	onMouseClick(event: PointerEvent | undefined = undefined)
	{
		const hit = this.getFirstHit();

		for (const key in this._onClickListeners)
		{
			const value = this._onClickListeners[key];
			if (value)
			{
				value(hit);
			}
		}
	}

	getActiveTouchById(id: number)
	{
		for (let i = 0; i < this._activeTouches.length; ++i)
		{
			const touch = this._activeTouches[i];
			if (touch.identifier == id)
			{
				return i;
			}
		}

		return -1;
	}

	copyTouch({ identifier, clientX, clientY }, target: InteractManagerTouch)
	{
		if (target == null)
		{
			target = { identifier, clientX, clientY, startTime: Date.now(), allowClick: true };
		}
		else
		{
			target.identifier = identifier;
			target.clientX = clientX;
			target.clientY = clientY;
			target.allowClick = false;
		}

		return target;
	}

	onTouchStart(event: TouchEvent)
	{
		event.preventDefault();

		this._hoverParticles.play();

		let touches = event.changedTouches;
		for (let i = 0; i < touches.length; ++i)
		{
			const current = this.copyTouch(touches[i], null);
			this._activeTouches.push(current);

			this.updateInteractPosition(current);
		}
	}

	onTouchMove(event: TouchEvent)
	{
		event.preventDefault();

		let touches = event.changedTouches;
		for (let i = 0; i < touches.length; ++i)
		{
			const idx = this.getActiveTouchById(touches[i].identifier);
			if (idx < 0)
			{
				continue;
			}

			const current = this._activeTouches[idx];
			this.copyTouch(touches[i], current);

			this.updateInteractPosition(current);
		}
	}

	onTouchEnd(event: TouchEvent)
	{
		event.preventDefault();

		let touches = event.changedTouches;
		for (let i = 0; i < touches.length; ++i)
		{
			const idx = this.getActiveTouchById(touches[i].identifier);
			if (idx < 0)
			{
				continue;
			}

			const current = this._activeTouches[idx];

			if (current.allowClick && Date.now() - current.startTime < 500)
			{
				// 0.2s time window to activate "tap" behaviour - make sure we have valid hit data
				this.update(0);
				this.onMouseClick();
			}

			this._interactPoint.x = -2;
			this._interactPoint.y = -2;

			this._activeTouches.splice(idx, 1);
		}

		if (this._activeTouches.length <= 0)
		{
			this._hoverParticles.pause();
		}
	}

	onTouchCancel(event: TouchEvent)
	{
		event.preventDefault();

		let touches = event.changedTouches;
		for (let i = 0; i < touches.length; ++i)
		{
			const idx = this.getActiveTouchById(touches[i].identifier);
			if (idx < 0)
			{
				continue;
			}

			this._interactPoint.x = -2;
			this._interactPoint.y = -2;

			this._activeTouches.splice(idx, 1);
		}

		if (this._activeTouches.length <= 0)
		{
			this._hoverParticles.pause();
		}
	}

	addClickListener(key: string, func: InteractManagerClickDelegate)
	{
		this._onClickListeners[key] = func;
	}

	removeClickListener(key: string)
	{
		delete this._onClickListeners[key];
	}

	trackObject(obj: THREE.Mesh)
	{
		this._trackedObjects.push(obj);
	}

	untrackObject(obj: THREE.Mesh)
	{
		const index = this._trackedObjects.indexOf(obj);
		if (index >= 0)
		{
			this._trackedObjects.splice(index, 1);
		}
	}

	getFirstHit()
	{
		return this._hitObjects.length > 0 ? this._hitObjects[0] : null;
	}

	updateInteractPosition(data: MouseEvent | InteractManagerTouch)
	{
		this._interactPoint.x = (data.clientX / window.innerWidth) * 2 - 1;
		this._interactPoint.y = -(data.clientY / window.innerHeight) * 2 + 1;

		this._hoverParticles.position.set(this._interactPoint.x * this._canvasScaler.halfWidth(), this._interactPoint.y * this._canvasScaler.halfHeight(), 0);
		this._hoverParticles.updateMatrixWorld();
	}

	update(dt: number)
	{
		this._hoverParticles.update(dt);

		this._hitObjects.length = 0;

		if (this.enabled)
		{
			this._raycaster.setFromCamera(this._interactPoint, this._clickCamera);
			this._raycaster.intersectObjects(this._trackedObjects, false, this._hitObjects);
		}

		const hit = this.getFirstHit();
		if (hit)
		{
			// hover detected
			document.body.style.cursor = "pointer";
		}
		else
		{
			document.body.style.cursor = "";
		}
	}
}