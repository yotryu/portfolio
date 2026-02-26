import * as Particles from "./particleSystem.js";
import * as Animation from "./libs/animation.js";
import * as THREE from "three";
import { Anchorable, CanvasScaler } from "./canvasScaler.js";
import * as Navigation from "./navigation.js";
import { TextBox } from "./textBox.js";
import { BackingFrame } from "./backingFrame.js";
import * as Resources from "./resources.js";
import * as Constants from "./constants.js";
import * as Utils from "./libs/utils.js";
import { AppContext } from "./appContext.js";
import { InteractManager } from "./interactManager.js";
import { Page } from "./appScreen.js";

"use strict"

const Pi2 = Math.PI * 2;

interface ItemOptions
{
	title: string,
	anchor: Anchorable;
	outerMesh: THREE.Mesh;
	iconMesh: THREE.Mesh;
	ringScene: THREE.Object3D<THREE.Object3DEventMap>;
	pathAxis: THREE.Vector3;
	pathSpeed: number;
	pathRadius: number;
	pathStartAngle: number;
	particleOptions: Particles.ParticleSystemOptions;
	animations: Animation.AnimationCollection;
}

export class LandingScreenItem
{
	private _scaler: CanvasScaler;
	private _interactManager: InteractManager;
	private _animations: Animation.AnimationCollection;
	private _animator: Animation.Animator;
	private _nextAnimation: Animation.AnimationTracks;
	private _anchor: Anchorable;
	private _anchorStart: THREE.Vector4;
	private _outerMesh: THREE.Mesh;
	private _iconMesh: THREE.Mesh;
	private _ring: THREE.Object3D<THREE.Object3DEventMap>;
	private _particles: Particles.ParticleSystem;
	private _group: THREE.Group;
	private _titleGroup: THREE.Group;
	private _backingFrame: BackingFrame;
	private _titleText: TextBox;
	private _axis: THREE.Vector3;
	private _angle: number;
	private _y: number;
	private _yScale: number;

	private _pathAxis: THREE.Vector3;
	private _pathAngle: number;
	private _pathSpeed: number;
	private _pathRadius: number;


	constructor(context: AppContext, options: ItemOptions)
	{
		this._scaler = context.contentScaler;
		this._interactManager = context.contentInteractManager;
		this._animations = options.animations;

		this._nextAnimation = null;

		const anchor = this._anchor = options.anchor;
		const anchorOpts = this._anchor.options();
		const anchorStart = this._anchorStart = new THREE.Vector4(
			Utils.getOrientationValue(anchorOpts.refX),
			Utils.getOrientationValue(anchorOpts.refY),
			Utils.getOrientationValue(anchorOpts.anchorX),
			Utils.getOrientationValue(anchorOpts.anchorY));

		this._outerMesh = options.outerMesh.clone();

		const outerMat = new THREE.MeshBasicMaterial({opacity: 0.2, blending: THREE.NormalBlending, transparent: true});
		this._outerMesh.traverse(node =>
		{
			if (node instanceof THREE.Mesh)
			{
				node.material = outerMat;
			}
		});

		this._iconMesh = options.iconMesh;

		this._ring = options.ringScene.clone();
		this._ring.scale.set(options.pathRadius, options.pathRadius, options.pathRadius);

		const ringMat = new THREE.MeshBasicMaterial({color: new THREE.Color(0.1, 0.1, 0.4), side: THREE.DoubleSide, depthWrite: false});
		this._ring.traverse(node =>
		{
			if (node instanceof THREE.Mesh)
			{
				node.material = ringMat;
			}
		});

		this._particles = new Particles.ParticleSystem(options.particleOptions);
		this._particles.rotateX(-Math.PI * 0.5);
		this._anchor.RepositionCallback = this._particles.setPointSizeFromCanvasScaler.bind(this._particles);

		this._pathAxis = options.pathAxis;
		this._pathAngle = options.pathStartAngle;
		this._pathSpeed = options.pathSpeed;
		this._pathRadius = options.pathRadius;

		const group = this._group = new THREE.Group();
		this._group.scale.set(0, 0, 0);
		this._group.position.set(options.pathRadius, 0, 0);

		this._group.add(this._particles);
		this._group.add(this._outerMesh);
			this._outerMesh.add(this._iconMesh);

		this._anchor.add(this._ring);
		this._anchor.add(this._group);

		const titleGroup = this._titleGroup = new THREE.Group();
		this._titleGroup.scale.set(0, 0, 0);
		this._titleGroup.position.set(0, -1, 0);

		const backingFrame = this._backingFrame = new BackingFrame(0.2);

		this._group.add(this._titleGroup);
			this._titleGroup.add(this._backingFrame);

		const titleText = this._titleText = new TextBox(this._titleGroup, 
		{
			cssClass: "textBody",
			maxWidth: 2, 
			worldX: 0,
			worldY: 0,
			pivotX: 0,
			pivotY: 0.5,
			text: options.title
		});
		this._titleText.onSizeChanged = function(width: number, height: number)
		{
			backingFrame.setSize(width + 0.2, height + 0.2);
			backingFrame.position.set(width * (-titleText.options.pivotX + 0.5), -height * (-titleText.options.pivotY + 0.5), 0);
		};

		this._axis = new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
		this._axis.normalize();

		this._angle = 0;
		this._y = (Math.random() + 0.5) * (Math.random() > 0.5 ? 1 : -1);
		this._yScale = Math.random() * 0.2 + 0.3;

		// animation binding
		this._animator = new Animation.Animator(
			{
				scale: 
				{
					update: function(value: number) { group.scale.set(value * 2, value * 2, value * 2); },
					undefinedGetter: function() { return group.scale.x; }
				},
				titleScale: 
				{
					update: function(value: number) { titleGroup.scale.set(value, value, value); },
					undefinedGetter: function() { return titleGroup.scale.x; }
				},
				position: 
				{
					update: function(value: THREE.Vector4) { anchor.setOptions({refX: value.x, refY: value.y, anchorX: value.z, anchorY: value.w}); },
					undefinedGetter: function() { return anchorStart; }
				},
				titlePos: 
				{
					update: function(value: THREE.Vector3) { titleGroup.position.set(value.x, value.y, value.z); }
				},
				titleWidth:
				{
					update: function(value: number) { titleText.setOptions({maxWidth: value}) },
				},
				yOffset:
				{
					update: function(value: number) { group.position.set(0, Math.sin(this.angle) * this.y * value, 0); }.bind(this)
				},
			}
		);
	}

	update(dt: number)
	{
		this._particles.update(dt);

		this._pathAngle += dt * this._pathSpeed;
		if (this._pathAngle >= Pi2)
		{
			this._pathAngle = this._pathAngle % Pi2;
		}

		const pos = new THREE.Vector3(this._pathRadius, 0, 0);
		pos.applyQuaternion(new THREE.Quaternion().setFromAxisAngle(this._pathAxis, this._pathAngle))
		this._group.position.set(pos.x, pos.y, pos.z);

		this._angle += dt * this._yScale;

		if (this._angle >= Pi2)
		{
			this._angle = this._angle % Pi2;
		}

		this._outerMesh.setRotationFromAxisAngle(this._axis, this._angle);

		if (this._animator.getCurrentTracks() != this._animations.enter && this._animator.getCurrentTracks() != this._animations.exit)
		{
			// this._group.position.set(0, Math.sin(this._angle) * this._y, 0);
		}

		this._backingFrame.update(dt);

		// animate current state
		this._animator.update(dt);

		// update the text last so it is in sync with the animation
		this._titleText.update();
	}

	show(delay: number)
	{
		this._interactManager.trackObject(this._outerMesh);

		if (this._scaler.children.includes(this._anchor))
		{
			// navigated back from this item's screen, so animate back to initial pos
			this.setAnimation(this._animations.exit, true);
			this._nextAnimation = this._animations.deselected;
		}
		else
		{
			// hidden, so we need to re-add and show
			this._scaler.add(this._anchor);

			this.setAnimation(this._animations.show, true, delay);
		}
	}

	hide()
	{
		const seekToEnd = this._animator.getCurrentTracks() == this._animations.show;

		this.setAnimation(this._animations.hide, true);

		if (seekToEnd)
		{
			this._animator.setTime(this._animator.getLength());
			this._animator.update(1);
		}
	}

	isAnimating()
	{
		return this._animator.isAnimating();
	}

	disableInteraction()
	{
		this._interactManager.untrackObject(this._outerMesh);
	}

	setAnimation(anim: Animation.AnimationTracks, force: boolean, delay: number | undefined = undefined)
	{
		if (this._animator.getCurrentTracks() == anim)
		{
			// trying to set the currently playing animation, so do nothing
			return;
		}

		if (this._animator.isAnimating() && force == false)
		{
			this._nextAnimation = anim;
			return;
		}

		this._animator.play(anim, this.onAnimationFinished.bind(this));

		if (delay)
		{
			this._animator.setTime(-delay);
		}
	}

	onAnimationFinished(finishedAnim)
	{
		if (finishedAnim == this._animations.hide)
		{
			// special case after being hidden
			this._scaler.remove(this._anchor);
		}
		else if (this._nextAnimation)
		{
			this.setAnimation(this._nextAnimation, true);

			this._nextAnimation = null;
		}
	}

	isAnimatorPlayingAnimation(anim: Animation.AnimationTracks)
	{
		return this._animator.getCurrentTracks() == anim;
	}

	outerMesh()
	{
		return this._outerMesh;
	}
}

export type LandingScreenHideFinishDelegate = (item: Page | LandingScreenItem) => void;

export class LandingScreen
{
	private _appContext: AppContext;
	private _items: LandingScreenItem[];
	private _animations: Animation.AnimationCollection;
	private _clickedItem: Page | LandingScreenItem;

	HideFinishedCallback: LandingScreenHideFinishDelegate;
	

	constructor(context: AppContext)
	{
		this._appContext = context;
		this._items = [];
		this.HideFinishedCallback = null;

		// define particle options
		const particleOptions: Particles.ParticleSystemOptions = 
		{
			useWorldPosition: true,
			emission:
			{
				rate: 10,
				shape: new Particles.ParticleSystemShapeRectangle(1.5, 0)
			},
			particles:
			{
				lifetime: new Utils.Range(1, 2),
				startSpeed: new Utils.Range(1.5, 2.5),
				startSize: new Utils.Range(0.2),
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
			texture: context.textureManager.load(Resources.particlePng)
		};

		// animations
		this._animations =
		{
			selected:
			{
				scale: 
				{
					anim: new Animation.AnimationTyped<number>(
					[
						new Animation.KeyframeNumber(0, 1, Animation.KeyframeType.InvExponential),
						new Animation.KeyframeNumber(1, 1.3)
					]),
					duration: 0.1
				},
				titleScale:
				{
					anim: new Animation.AnimationTyped<number>(
					[
						new Animation.KeyframeNumber(0, 0, Animation.KeyframeType.InvExponential),
						new Animation.KeyframeNumber(1, 1)
					]),
					duration: 0.2
				}
			},
			deselected:
			{
				scale: 
				{
					anim: new Animation.AnimationTyped<number>(
					[
						new Animation.KeyframeNumber(0, 1.3, Animation.KeyframeType.Exponential),
						new Animation.KeyframeNumber(1, 1)
					]),
					duration: 0.05
				},
				titleScale:
				{
					anim: new Animation.AnimationTyped<number>(
					[
						new Animation.KeyframeNumber(0, 1, Animation.KeyframeType.Exponential),
						new Animation.KeyframeNumber(1, 0)
					]),
					duration: 0.05
				}
			},
			show:
			{
				scale: 
				{
					anim: new Animation.AnimationTyped<number>(
					[
						new Animation.KeyframeNumber(0, 0, Animation.KeyframeType.InvExponential),
						new Animation.KeyframeNumber(1, 1)
					]),
					duration: 0.3
				}
			},
			hide:
			{
				scale: 
				{
					anim: new Animation.AnimationTyped<number>(
					[
						new Animation.KeyframeNumber(0, 1, Animation.KeyframeType.Exponential),
						new Animation.KeyframeNumber(1, 0)
					]),
					duration: 0.1
				}
			},
			enter:
			{
				position: 
				{
					anim: new Animation.AnimationTyped<THREE.Vector4>(
					[
						new Animation.KeyframeVec4(0, undefined, Animation.KeyframeType.Exponential),
						new Animation.KeyframeVec4(1, new THREE.Vector4(2.5, -1.5, 0, 1))
					]),
					duration: 0.3
				},
				titlePos:
				{
					anim: new Animation.AnimationTyped<THREE.Vector3>(
					[
						new Animation.KeyframeVec3(0, new THREE.Vector3(0, -1, 0), Animation.KeyframeType.Exponential),
						new Animation.KeyframeVec3(1, new THREE.Vector3(1.5, 0, 0)),
					]),
					duration: 0.3
				},
				titleWidth:
				{
					anim: new Animation.AnimationTyped<number>(
					[
						new Animation.KeyframeNumber(0, 2, Animation.KeyframeType.Exponential),
						new Animation.KeyframeNumber(1, 4),
					]),
					duration: 0.3
				},
				yOffset:
				{
					anim: new Animation.AnimationTyped<number>(
					[
						new Animation.KeyframeNumber(0, 1, Animation.KeyframeType.Exponential),
						new Animation.KeyframeNumber(1, 0),
					]),
					duration: 0.3
				},
				scale: 
				{
					anim: new Animation.AnimationTyped<number>(
					[
						new Animation.KeyframeNumber(0, undefined, Animation.KeyframeType.InvExponential),
						new Animation.KeyframeNumber(1, 1.3)
					]),
					duration: 0.1
				},
				titleScale:
				{
					anim: new Animation.AnimationTyped<number>(
					[
						new Animation.KeyframeNumber(0, undefined, Animation.KeyframeType.InvExponential),
						new Animation.KeyframeNumber(1, 1)
					]),
					duration: 0.2
				}
			},
			exit:
			{
				position: 
				{
					anim: new Animation.AnimationTyped<THREE.Vector4>(
					[
						new Animation.KeyframeVec4(0, new THREE.Vector4(2.5, -1.5, 0, 1), Animation.KeyframeType.Exponential),
						new Animation.KeyframeVec4(1, undefined)
					]),
					duration: 0.1
				},
				titlePos:
				{
					anim: new Animation.AnimationTyped<THREE.Vector3>(
					[
						new Animation.KeyframeVec3(0, new THREE.Vector3(1.5, 0, 0), Animation.KeyframeType.InvExponential),
						new Animation.KeyframeVec3(1, new THREE.Vector3(0, -1, 0)),
					]),
					duration: 0.1
				},
				titleWidth:
				{
					anim: new Animation.AnimationTyped<number>(
					[
						new Animation.KeyframeNumber(0, 4, Animation.KeyframeType.Exponential),
						new Animation.KeyframeNumber(1, 2),
					]),
					duration: 0.1
				},
				yOffset:
				{
					anim: new Animation.AnimationTyped<number>(
					[
						new Animation.KeyframeNumber(0, 0, Animation.KeyframeType.InvExponential),
						new Animation.KeyframeNumber(1, 1),
					]),
					duration: 0.1
				},
			}
		};

		// setup placeholder icon mesh and material
		const iconSize = 0.7;
		const iconGeom = new THREE.BoxGeometry(iconSize, iconSize, iconSize);
		const iconMaterial = new THREE.MeshBasicMaterial(
			{
				blending: THREE.NoBlending,
				side: THREE.FrontSide,
				color: new THREE.Color(1, 0, 0),
				transparent: true,
				stencilWrite: true,
				stencilRef: 1,
				stencilFunc: THREE.EqualStencilFunc,
				stencilZPass: THREE.KeepStencilOp
			}
		);

		const itemInc = 1 / (Navigation.NavApps.length + 1);
		let xAnchor = itemInc;
		let rad = 4;
		let startAngle = 0;
		const angleInc = Pi2 / (Navigation.NavApps.length);

		// setup menu items
		Navigation.NavApps.forEach(item =>
		{
			this._items.push(new LandingScreenItem(context, 
				{
					title: item.title,
					anchor: new Anchorable({refX: 0, refY: 0, anchorX: 0.5, anchorY: 0.5}, null),
					outerMesh: <THREE.Mesh>context.meshManager.getLoadedMesh(Resources.unitSphereMesh, "UnitSphere"),
					iconMesh: new THREE.Mesh(iconGeom, iconMaterial),
					particleOptions: particleOptions,
					ringScene: context.meshManager.getLoadedMesh(Resources.pathRingMesh),
					pathAxis: new THREE.Vector3(0, 1, 0),
					pathSpeed: new Utils.Range(0.05, 0.1).random(),
					pathRadius: rad,
					pathStartAngle: startAngle,
					animations: this._animations
				}
			));

			rad += 3;
			startAngle += angleInc;
			xAnchor += itemInc;
		});
	}

	dispose()
	{
		
	}

	onItemClicked(rayHit: THREE.Intersection<THREE.Object3D>)
	{
		if (rayHit == null)
		{
			return;
		}
		
		const index = this._items.findIndex(item => item.outerMesh() == rayHit.object);

		this._appContext.navigation.setNewDestination(Navigation.NavApps[index].path, this._items[index]);
	}

	getItemAtIndex(index: number)
	{
		return this._items[index];
	}

	show()
	{
		for (let i = 0; i < this._items.length; ++i)
		{
			this._items[i].show(i * 0.1);
		};

		// register click listener so we can interact with items
		this._appContext.contentInteractManager.addClickListener(this.constructor.name, this.onItemClicked.bind(this));
	}

	hide(finishedCallback: LandingScreenHideFinishDelegate, originData: Page | LandingScreenItem)
	{
		this.HideFinishedCallback = finishedCallback;
		this._clickedItem = originData;

		// originData will be one of this.items if we are navigating to an app, so keep that around and hide the rest
		this._items.forEach(item => 
		{
			if (item != originData)
			{
				item.hide();
			}
			else
			{
				item.setAnimation(this._animations.enter, false);
			}

			item.disableInteraction();
		});

		this._appContext.contentInteractManager.removeClickListener(this.constructor.name);
	}

	update(dt: number)
	{
		let hit = this._appContext.contentInteractManager.getFirstHit();
		let hideInProgress = false;

		for (let i = 0; i < this._items.length; ++i)
		{
			const current = this._items[i];
			current.update(dt);
			
			if (this.HideFinishedCallback == null)
			{
				if (hit && hit.object == current.outerMesh())
				{
					current.setAnimation(this._animations.selected, false);
				}
				else if (current.isAnimatorPlayingAnimation(this._animations.selected))
				{
					current.setAnimation(this._animations.deselected, false);
				}
			}
			else
			{
				hideInProgress = hideInProgress || current.isAnimating();
			}
		}

		if (this.HideFinishedCallback && hideInProgress == false)
		{
			this.HideFinishedCallback(this._clickedItem);

			this._clickedItem = null;
			this.HideFinishedCallback = null;
		}
	}
}