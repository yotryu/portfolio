import * as THREE from "three";
import * as Animation from "./libs/animation.js";
import * as Constants from "./constants.js";
import { Anchorable } from "./canvasScaler.js";
import { TextBox } from "./textBox.js";

"use strict"

const Pi2 = Math.PI * 2;
const tempVec3 = new THREE.Vector3();

export class Page
{
	constructor(context, data, pip, pipInner, animations)
	{
		this.appContext = context;
		this.parent = null;
		this.content = [];
		this.animations = animations;
		this.pip = pip;
		this.pipInner = pipInner;
		this.targetPos = new THREE.Vector4();

		function lerp(min, max, ratio)
		{
			return ratio * (max - min) + min;
		}
		
		this.animator = new Animation.Animator(
		{
			page:
			{
				update: function(value)
				{
					this.contentGroup.scale.set(value, value, value);
					
					this.pip.getWorldPosition(tempVec3);
					this.contentGroup.position.set(lerp(tempVec3.x, 0, value), lerp(tempVec3.y, 0, value), 0);
				}.bind(this)
			},
			titleScale:
			{
				update: function(value) { this.titleGroup.scale.set(value, value, value); }.bind(this)
			},
			pipScale:
			{
				update: function(value) { this.pip.scale.set(value, value, value); }.bind(this)
			},
			pipInnerScale:
			{
				update: function(value) { this.pipInner.scale.set(value, value, value); }.bind(this)
			}
		});

		this.contentGroup = new THREE.Group();

		data.content.forEach(item =>
		{
			const content = new item.type(context, this.contentGroup, item);
			this.content.push(content);
		});

		this.titleGroup = new THREE.Group();
		this.titleGroup.scale.set(0, 0, 0);
		this.titleGroup.position.set(0, -1, 0);

		this.titleBackingFrame = new THREE.Mesh(Constants.geometry.unitPlane, Constants.materials.textBackingFrame);
		this.titleBackingInner = new THREE.Mesh(Constants.geometry.unitPlane, Constants.materials.textBackingInner);

		this.contentGroup.add(this.titleGroup);
			this.titleGroup.add(this.titleBackingFrame);
				this.titleBackingFrame.add(this.titleBackingInner);

		this.titleText = new TextBox(this.titleGroup, 
		{
			cssClass: "textBody",
			maxWidth: 2,
			worldX: 0,
			worldY: 0,
			pivotX: 0,
			pivotY: 0.5,
			text: data.title
		});
		this.titleText.onSizeChanged = function(width, height)
		{
			this.titleBackingFrame.scale.set(width + 0.3, height + 0.3, 1);
			this.titleBackingInner.scale.set((width + 0.1) / this.titleBackingFrame.scale.x, (height + 0.1) / this.titleBackingFrame.scale.y, 1);
			this.titleBackingFrame.position.set(width * (-this.titleText.pivotX + 0.5), -height * (-this.titleText.pivotY + 0.5), 0);
		}.bind(this);

		this.axis = new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
		this.axis.normalize();

		this.angle = 0;
		this.yScale = Math.random() * 0.2 + 0.3;
	}

	dispose()
	{
		this.content.forEach(item =>
		{
			item.dispose();
		});

		this.titleText.dispose();
	}

	onAnimationFinished(anim)
	{
		if (anim == this.animations.show)
		{
			this.playAnimation(this.animations.showTitle, false);
		}
		else if (anim == this.animations.deselected)
		{
			this.hideContent();
		}
	}

	playAnimation(anim, wait)
	{
		if (this.animator.animation == anim || (wait && this.animator.isAnimating()))
		{
			return;
		}

		this.animator.play(anim, this.onAnimationFinished.bind(this));
	}

	show()
	{
		if (this.contentGroup.parent != null)
		{
			this.showContent();

			return;
		}

		this.appContext.contentScaler.add(this.contentGroup);
		this.showContent();

		//this.appContext.contentInteractManager.trackObject(this.pip);
	}

	hide()
	{
		this.hideContent();

		this.appContext.contentScaler.remove(this.contentGroup);
		this.titleText.scale.set(0, 0, 0);

		this.appContext.contentInteractManager.untrackObject(this.pip);
	}

	showContent()
	{
		this.content.forEach(item =>
		{
			item.show();
		});
	}

	hideContent()
	{
		this.content.forEach(item =>
		{
			item.hide();
		});
	}

	processClick(clickedObj)
	{
		for (let i = 0; i < this.content.length; ++i)
		{
			const item = this.content[i];

			if (item.processClick)
			{
				item.processClick(clickedObj);
			}
		}
	}

	update(dt)
	{
		this.angle += dt * this.yScale;

		if (this.angle >= Pi2)
		{
			this.angle = this.angle % Pi2;
		}

		this.titleText.update();
		this.animator.update(dt);

		this.content.forEach(item =>
		{
			item.update(dt);
		});
	}
}

const itemAnimations =
{
	show: 
	{
		position:
		{
			anim: new Animation.Animation(
			[
				new Animation.KeyframeVec4(0, new THREE.Vector4(2.5, -1.5, 0, 1), Animation.KeyframeInvExponential),
				new Animation.KeyframeVec4(1, undefined)
			]),
			duration: { min: 0.3, max: 0.6 }
		}
	},
	showTitle:
	{
		titleScale:
		{
			anim: new Animation.Animation(
			[
				new Animation.Keyframe(0, 0, Animation.KeyframeInvExponential),
				new Animation.Keyframe(1, 1)
			]),
			duration: 0.2
		}
	},
	hoverPip: 
	{
		pipScale:
		{
			anim: new Animation.Animation(
			[
				new Animation.Keyframe(0, 1, Animation.KeyframeInvExponential),
				new Animation.Keyframe(1, 1.5)
			]),
			duration: 0.2
		}
	},
	unhoverPip: 
	{
		pipScale:
		{
			anim: new Animation.Animation(
			[
				new Animation.Keyframe(0, 1.5, Animation.KeyframeExponential),
				new Animation.Keyframe(1, 1)
			]),
			duration: 0.1
		}
	},
	selected: 
	{
		pipScale:
		{
			anim: new Animation.Animation(
			[
				new Animation.Keyframe(0, 1, Animation.KeyframeExponential),
				new Animation.Keyframe(1, 0.5)
			]),
			duration: 0.1
		},
		pipInnerScale:
		{
			anim: new Animation.Animation(
			[
				new Animation.Keyframe(0, 1, Animation.KeyframeExponential),
				new Animation.Keyframe(1, 0)
			]),
			duration: 0.1
		},
		page:
		{
			anim: new Animation.Animation(
			[
				new Animation.Keyframe(0, 0, Animation.KeyframeInvExponential),
				new Animation.Keyframe(1, 1)
			]),
			duration: 0.3
		}
	},
	deselected: 
	{
		pipScale:
		{
			anim: new Animation.Animation(
			[
				new Animation.Keyframe(0, 0.5, Animation.KeyframeExponential),
				new Animation.Keyframe(1, 1)
			]),
			duration: 0.05
		},
		pipInnerScale:
		{
			anim: new Animation.Animation(
			[
				new Animation.Keyframe(0, 0, Animation.KeyframeExponential),
				new Animation.Keyframe(1, 1)
			]),
			duration: 0.05
		},
		page:
		{
			anim: new Animation.Animation(
			[
				new Animation.Keyframe(0, 1, Animation.KeyframeExponential),
				new Animation.Keyframe(1, 0)
			]),
			duration: 0.1
		}
	},
}

export class AppScreen
{
	constructor(context, itemConfigs)
	{
		this.appContext = context;
		this.itemConfigs = itemConfigs;
		this.rootItem = null;
		this.shownItem = null;

		this.pages = [];
		this.pips = [];
		this.hideFinishedCallback = null;
		this.clickedItem = null;

		this.pipGroup = new Anchorable(0, 1.3, 0.5, 0);
		this.pipGroup.scale.set(0, 0, 0);

		this.appContext.contentScaler.add(this.pipGroup);

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

			this.pipGroup.add(pip);
				pip.add(pipInner);

			this.pips.push(pip);

			this.appContext.contentInteractManager.trackObject(pip);

			const item = new Page(context, value, pip, pipInner, itemAnimations);
			this.pages.push(item);
		});
	}

	dispose()
	{
		this.appContext.contentScaler.remove(this.pipGroup);

		this.pages.forEach(item =>
		{
			item.dispose();
		});
	}

	onItemClicked(rayHit)
	{
		if (rayHit == null)
		{
			for (let i = 0; i < this.pages.length; ++i)
			{
				this.pages[i].processClick(null);
			}

			return;
		}

		let index = this.pages.findIndex(item => item.pip == rayHit.object);
		if (index >= 0)
		{
			const path = this.appContext.navigation.currentPath;
			const prevPageIndex = path.indexOf(".");
			const rootPath = prevPageIndex >= 0 ? path.slice(0, prevPageIndex) : path;
			this.appContext.navigation.setNewDestination(rootPath + "." + this.itemConfigs[index].id, this.pages[index]);
		}
		else
		{
			// no pip selected, so try searching for thumbnails displayed
			for (let i = 0; i < this.pages.length; ++i)
			{
				this.pages[i].processClick(rayHit.object);
			}
		}
	}

	onPathChanged(newPath)
	{
		this.openItemContentsFromPath();
	}

	openItemContentsFromPath()
	{
		const path = this.appContext.navigation.currentPath;
		const itemStart = path.lastIndexOf(".");

		if (this.shownItem != null)
		{
			this.appContext.contentInteractManager.trackObject(this.shownItem.pip);
			this.shownItem.playAnimation(itemAnimations.deselected, false);
		}

		const itemId = itemStart >= 0 ? path.slice(itemStart + 1) : this.itemConfigs[0].id;
		const index = this.itemConfigs.findIndex(item => item.id == itemId);

		this.shownItem = this.pages[index];
		this.shownItem.show();

		this.appContext.contentInteractManager.untrackObject(this.shownItem.pip);
		this.shownItem.playAnimation(itemAnimations.selected, false);
	}

	show(originData)
	{
		this.rootItem = originData;

		const pos = new THREE.Vector4();
		const xInc = 1 / (this.pages.length + 1);
		const yRange = 0.4;
		const yHalfDiff = (1 - yRange) * 0.5;
		const yInc = yRange / this.pages.length;
		let x = xInc;
		let y = Math.random() * yRange + yHalfDiff;
		const yDir = Math.random() < 0.5 ? -1 : 1;

		this.pipGroup.scale.set(1, 1, 1);

		this.openItemContentsFromPath();

		this.appContext.contentInteractManager.addClickListener(this.constructor.name, this.onItemClicked.bind(this));
	}

	hide(finishedCallback, originData)
	{
		this.hideFinishedCallback = finishedCallback;
		this.clickedItem = originData;

		this.pages.forEach(item =>
		{
			item.hide();
		});

		finishedCallback(originData);

		this.appContext.contentInteractManager.removeClickListener(this.constructor.name);
	}

	update(dt)
	{
		const hit = this.appContext.contentInteractManager.getFirstHit();

		this.rootItem.update(dt);

		this.pages.forEach(item =>
		{
			item.update(dt);

			if (hit && hit.object == item.pip)
			{
				item.playAnimation(itemAnimations.hoverPip, true);
			}
			else if (item.animator.animation == itemAnimations.hoverPip)
			{
				item.playAnimation(itemAnimations.unhoverPip, true);
			}
		});
	}
}