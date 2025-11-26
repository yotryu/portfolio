import * as THREE from "three";
import * as Animation from "./libs/animation.js";
import * as Constants from "./constants.js";
import * as Utils from "./libs/utils.js";
import { Anchorable } from "./canvasScaler.js";
import { TextBox } from "./textBox.js";
import { AppContext } from "./appContext.js";
import { ContentData, ContentType } from "./pageContentTypes.js";
import { HtmlContent } from "./htmlContent.js";
import { LandingScreenItem } from "./landingScreen.js";

"use strict"

const Pi2 = Math.PI * 2;
const tempVec3 = new THREE.Vector3();


export interface PageContentTabData
{
	id: string;
	title: string;
	content: ContentData[];
}


export class Page extends THREE.Object3D
{
	private _appContext: AppContext;
	private _content: ContentType[];
	private _targetPos: THREE.Vector4;
	private _axis: THREE.Vector3;
	private _angle: number;
	private _yScale: number;
	private _contentGroup: THREE.Group;
	private _titleGroup: THREE.Group;
	private _pip: THREE.Mesh;
	private _pipInner: THREE.Mesh;
	private _titleBackingFrame: THREE.Mesh;
	private _titleBackingInner: THREE.Mesh;
	private _titleText: TextBox;
	private _animations: Animation.AnimationCollection;
	private _animator: Animation.Animator;


	constructor(context: AppContext, data: PageContentTabData, pip: THREE.Mesh, pipInner: THREE.Mesh, animations: Animation.AnimationCollection)
	{
		super();

		this._appContext = context;
		this._content = [];
		this._animations = animations;
		this._targetPos = new THREE.Vector4();

		const contentGroup = this._contentGroup = new THREE.Group();

		this._pip = pip;
		this._pipInner = pipInner;

		const titleGroup = this._titleGroup = new THREE.Group();
		this._titleGroup.scale.set(0, 0, 0);
		this._titleGroup.position.set(0, -1, 0);

		const titleBackingFrame = this._titleBackingFrame = new THREE.Mesh(Constants.geometry.unitPlane, Constants.materials.textBackingFrame);
		const titleBackingInner = this._titleBackingInner = new THREE.Mesh(Constants.geometry.unitPlane, Constants.materials.textBackingInner);

		this._contentGroup.add(this._titleGroup);
			this._titleGroup.add(this._titleBackingFrame);
				this._titleBackingFrame.add(this._titleBackingInner);

		const titleText = this._titleText = new TextBox(this._titleGroup, 
		{
			cssClass: "textBody",
			maxWidth: 2,
			worldX: 0,
			worldY: 0,
			pivotX: 0,
			pivotY: 0.5,
			text: data.title
		});
		this._titleText.onSizeChanged = function(width: number, height: number)
		{
			titleBackingFrame.scale.set(width + 0.3, height + 0.3, 1);
			titleBackingInner.scale.set((width + 0.1) / titleBackingFrame.scale.x, (height + 0.1) / titleBackingFrame.scale.y, 1);
			titleBackingFrame.position.set(width * (-titleText.options.pivotX + 0.5), -height * (-titleText.options.pivotY + 0.5), 0);
		};

		this._axis = new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
		this._axis.normalize();

		this._angle = 0;
		this._yScale = Math.random() * 0.2 + 0.3;

		// content
		data.content.forEach(item =>
		{
			const content = new item.type(context, this._contentGroup, item);
			this._content.push(content);
		});
		
		// animation bindings
		this._animator = new Animation.Animator(
		{
			page:
			{
				update: function(value: number)
				{
					contentGroup.scale.set(value, value, value);
					
					pip.getWorldPosition(tempVec3);
					contentGroup.position.set(Utils.lerp(tempVec3.x, 0, value), Utils.lerp(tempVec3.y, 0, value), 0);
				}
			},
			titleScale:
			{
				update: function(value: number) { titleGroup.scale.set(value, value, value); }
			},
			pipScale:
			{
				update: function(value: number) { pip.scale.set(value, value, value); }
			},
			pipInnerScale:
			{
				update: function(value: number) { pipInner.scale.set(value, value, value); }
			}
		});
	}

	dispose()
	{
		this._content.forEach(item =>
		{
			item.dispose();
		});

		this._titleText.dispose();
	}

	getPip()
	{
		return this._pip;
	}

	isAnimatorPlayingAnimation(anim: Animation.AnimationTracks)
	{
		return this._animator.getCurrentTracks() == anim;
	}

	onAnimationFinished(anim: Animation.AnimationTracks)
	{
		if (anim == this._animations.show)
		{
			this.playAnimation(this._animations.showTitle, false);
		}
		else if (anim == this._animations.deselected)
		{
			this.hideContent();
		}
	}

	playAnimation(anim: Animation.AnimationTracks, wait: boolean)
	{
		if (this._animator.getCurrentTracks() == anim || (wait && this._animator.isAnimating()))
		{
			return;
		}

		this._animator.play(anim, this.onAnimationFinished.bind(this));
	}

	show()
	{
		if (this._contentGroup.parent != null)
		{
			this.showContent();

			return;
		}

		this._appContext.contentScaler.add(this._contentGroup);
		this.showContent();

		//this.appContext.contentInteractManager.trackObject(this.pip);
	}

	hide()
	{
		this.hideContent();

		this._appContext.contentScaler.remove(this._contentGroup);
		this._titleText.scale.set(0, 0, 0);

		this._appContext.contentInteractManager.untrackObject(this._pip);
	}

	showContent()
	{
		this._content.forEach(item =>
		{
			item.show();
		});
	}

	hideContent()
	{
		this._content.forEach(item =>
		{
			item.hide();
		});
	}

	processClick(clickedObj: THREE.Object3D)
	{
		for (let i = 0; i < this._content.length; ++i)
		{
			const item = this._content[i];

			if (item.processClick)
			{
				item.processClick(clickedObj);
			}
		}
	}

	update(dt: number)
	{
		this._angle += dt * this._yScale;

		if (this._angle >= Pi2)
		{
			this._angle = this._angle % Pi2;
		}

		this._titleText.update();
		this._animator.update(dt);

		this._content.forEach(item =>
		{
			item.update(dt);
		});
	}
}

const itemAnimations: Animation.AnimationCollection =
{
	show: 
	{
		position:
		{
			anim: new Animation.AnimationTyped<THREE.Vector4>(
			[
				new Animation.KeyframeVec4(0, new THREE.Vector4(2.5, -1.5, 0, 1), Animation.KeyframeType.InvExponential),
				new Animation.KeyframeVec4(1, undefined)
			]),
			duration: new Utils.Range(0.3, 0.6)
		}
	},
	showTitle:
	{
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
	hoverPip: 
	{
		pipScale:
		{
			anim: new Animation.AnimationTyped<number>(
			[
				new Animation.KeyframeNumber(0, 1, Animation.KeyframeType.InvExponential),
				new Animation.KeyframeNumber(1, 1.5)
			]),
			duration: 0.2
		}
	},
	unhoverPip: 
	{
		pipScale:
		{
			anim: new Animation.AnimationTyped<number>(
			[
				new Animation.KeyframeNumber(0, 1.5, Animation.KeyframeType.Exponential),
				new Animation.KeyframeNumber(1, 1)
			]),
			duration: 0.1
		}
	},
	selected: 
	{
		pipScale:
		{
			anim: new Animation.AnimationTyped<number>(
			[
				new Animation.KeyframeNumber(0, 1, Animation.KeyframeType.Exponential),
				new Animation.KeyframeNumber(1, 0.5)
			]),
			duration: 0.1
		},
		pipInnerScale:
		{
			anim: new Animation.AnimationTyped<number>(
			[
				new Animation.KeyframeNumber(0, 1, Animation.KeyframeType.Exponential),
				new Animation.KeyframeNumber(1, 0)
			]),
			duration: 0.1
		},
		page:
		{
			anim: new Animation.AnimationTyped<number>(
			[
				new Animation.KeyframeNumber(0, 0, Animation.KeyframeType.InvExponential),
				new Animation.KeyframeNumber(1, 1)
			]),
			duration: 0.3
		}
	},
	deselected: 
	{
		pipScale:
		{
			anim: new Animation.AnimationTyped<number>(
			[
				new Animation.KeyframeNumber(0, 0.5, Animation.KeyframeType.Exponential),
				new Animation.KeyframeNumber(1, 1)
			]),
			duration: 0.05
		},
		pipInnerScale:
		{
			anim: new Animation.AnimationTyped<number>(
			[
				new Animation.KeyframeNumber(0, 0, Animation.KeyframeType.Exponential),
				new Animation.KeyframeNumber(1, 1)
			]),
			duration: 0.05
		},
		page:
		{
			anim: new Animation.AnimationTyped<number>(
			[
				new Animation.KeyframeNumber(0, 1, Animation.KeyframeType.Exponential),
				new Animation.KeyframeNumber(1, 0)
			]),
			duration: 0.1
		}
	},
}

export type AppScreenHideFinishDelegate = (item: Page | LandingScreenItem) => void;

export class AppScreen
{
	protected _appContext: AppContext;
	private _itemConfigs: PageContentTabData[];
	private _rootItem : Page | LandingScreenItem;
	private _shownItem: Page;
	private _clickedItem: Page | LandingScreenItem;

	private _pages: Page[];
	private _pips: THREE.Mesh[];
	private _pipGroup: Anchorable;

	HideFinishedCallback: AppScreenHideFinishDelegate;


	constructor(context: AppContext, itemConfigs: PageContentTabData[])
	{
		this._appContext = context;
		this._itemConfigs = itemConfigs;
		this._rootItem = null;
		this._shownItem = null;

		this._pages = [];
		this._pips = [];
		this.HideFinishedCallback = null;
		this._clickedItem = null;

		this._pipGroup = new Anchorable({refX: 0, refY: 1.3, anchorX: 0.5, anchorY: 0}, null);
		this._pipGroup.scale.set(0, 0, 0);

		this._appContext.contentScaler.add(this._pipGroup);

		const rot = Math.PI * 0.25;
		const pipSpacing = 1.8;
		const pipGroupWidth = (itemConfigs.length - 1) * pipSpacing;
		let x = -pipGroupWidth * 0.5;

		itemConfigs.forEach(value =>
		{
			const pip = new THREE.Mesh(Constants.geometry.appItemFrame, Constants.materials.landingCubeFrame);
			const pipInner = new THREE.Mesh(Constants.geometry.appItemInner, Constants.materials.landingCubeInner);

			pip.position.set(x, 0, 0);
			pip.rotation.set(rot, 0, rot);
			x += pipSpacing;

			this._pipGroup.add(pip);
				pip.add(pipInner);

			this._pips.push(pip);

			this._appContext.contentInteractManager.trackObject(pip);

			const item = new Page(context, value, pip, pipInner, itemAnimations);
			this._pages.push(item);
		});
	}

	dispose()
	{
		this._appContext.contentScaler.remove(this._pipGroup);

		this._pages.forEach(item =>
		{
			item.dispose();
		});
	}

	onItemClicked(rayHit: THREE.Intersection<THREE.Object3D>)
	{
		if (rayHit == null)
		{
			for (let i = 0; i < this._pages.length; ++i)
			{
				this._pages[i].processClick(null);
			}

			return;
		}

		let index = this._pips.findIndex(item => item == rayHit.object);
		if (index >= 0)
		{
			const path = this._appContext.navigation.getCurrentPath();
			const prevPageIndex = path.indexOf(".");
			const rootPath = prevPageIndex >= 0 ? path.slice(0, prevPageIndex) : path;
			this._appContext.navigation.setNewDestination(rootPath + "." + this._itemConfigs[index].id, this._pages[index]);
		}
		else
		{
			// no pip selected, so try searching for thumbnails displayed
			for (let i = 0; i < this._pages.length; ++i)
			{
				this._pages[i].processClick(rayHit.object);
			}
		}
	}

	onPathChanged(newPath: string)
	{
		this.openItemContentsFromPath();
	}

	openItemContentsFromPath()
	{
		const path = this._appContext.navigation.getCurrentPath();
		const itemStart = path.lastIndexOf(".");

		if (this._shownItem != null)
		{
			this._appContext.contentInteractManager.trackObject(this._shownItem.getPip());
			this._shownItem.playAnimation(itemAnimations.deselected, false);
		}

		const itemId = itemStart >= 0 ? path.slice(itemStart + 1) : this._itemConfigs[0].id;
		const index = this._itemConfigs.findIndex(item => item.id == itemId);

		this._shownItem = this._pages[index];
		this._shownItem.show();

		this._appContext.contentInteractManager.untrackObject(this._shownItem.getPip());
		this._shownItem.playAnimation(itemAnimations.selected, false);
	}

	show(originData: Page | LandingScreenItem)
	{
		this._rootItem = originData;

		const pos = new THREE.Vector4();
		const xInc = 1 / (this._pages.length + 1);
		const yRange = 0.4;
		const yHalfDiff = (1 - yRange) * 0.5;
		const yInc = yRange / this._pages.length;
		let x = xInc;
		let y = Math.random() * yRange + yHalfDiff;
		const yDir = Math.random() < 0.5 ? -1 : 1;

		this._pipGroup.scale.set(1, 1, 1);

		this.openItemContentsFromPath();

		this._appContext.contentInteractManager.addClickListener(this.constructor.name, this.onItemClicked.bind(this));
	}

	hide(finishedCallback: AppScreenHideFinishDelegate, originData: Page | LandingScreenItem)
	{
		this.HideFinishedCallback = finishedCallback;
		this._clickedItem = originData;

		this._pages.forEach(item =>
		{
			item.hide();
		});

		finishedCallback(originData);

		this._appContext.contentInteractManager.removeClickListener(this.constructor.name);
	}

	update(dt: number)
	{
		const hit = this._appContext.contentInteractManager.getFirstHit();

		this._rootItem.update(dt);

		this._pages.forEach(item =>
		{
			item.update(dt);

			if (hit && hit.object == item.getPip())
			{
				item.playAnimation(itemAnimations.hoverPip, true);
			}
			else if (item.isAnimatorPlayingAnimation(itemAnimations.hoverPip))
			{
				item.playAnimation(itemAnimations.unhoverPip, true);
			}
		});
	}
}