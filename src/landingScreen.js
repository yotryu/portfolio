import * as Particles from "./particleSystem.js";
import * as Animation from "./libs/animation.js";
import * as THREE from "three";
import { Anchorable } from "./canvasScaler.js";
import * as Navigation from "./navigation.js";
import { TextBox } from "./textBox.js";
import { BackingFrame } from "./backingFrame.js";
import * as Resources from "./resources.js";
import * as Constants from "./constants.js";
import * as Utils from "./libs/utils.js";

"use strict"

const Pi2 = Math.PI * 2;

class Item
{
	constructor(context, options)
	{
		this.scaler = context.contentScaler;
		this.interactManager = context.contentInteractManager;
		this.animations = options.animations;
		this.animator = new Animation.Animator(
			{
				scale: 
				{
					update: function(value) { this.group.scale.set(value, value, value); }.bind(this),
					undefinedGetter: function() { return this.group.scale.x; }.bind(this)
				},
				titleScale: 
				{
					update: function(value) { this.titleGroup.scale.set(value, value, value); }.bind(this),
					undefinedGetter: function() { return this.titleGroup.scale.x; }.bind(this)
				},
				position: 
				{
					update: function(value) { this.anchor.setPosition(value.x, value.y, value.z, value.w); }.bind(this),
					undefinedGetter: function() { return this.anchorStart; }.bind(this)
				},
				titlePos: 
				{
					update: function(value) { this.titleGroup.position.set(value.x, value.y, value.z); }.bind(this),
				},
				titleWidth:
				{
					update: function(value) { this.titleText.maxWidth = value; }.bind(this),
				},
				yOffset:
				{
					update: function(value) { this.group.position.set(0, Math.sin(this.angle) * this.y * value, 0); }.bind(this)
				},
			}
		);

		this.nextAnimation = null;

		this.anchor = options.anchor;
		this.anchorStart = new THREE.Vector4(this.anchor.refX, this.anchor.refY, this.anchor.anchorX, this.anchor.anchorY);

		this.outerMesh = options.outerMesh;
		this.innerMesh = options.innerMesh;
		this.iconMesh = options.iconMesh;

		this.particles = new Particles.ParticleSystem(options.particleOptions);
		this.particles.rotateX(-Math.PI * 0.5);
		this.anchor.repositionCallback = this.particles.setPointSizeFromCanvasScaler.bind(this.particles);

		this.group = new THREE.Group();
		this.group.scale.set(0, 0, 0);

		this.group.add(this.particles);
		this.group.add(this.outerMesh);
			this.outerMesh.add(this.innerMesh);
			this.outerMesh.add(this.iconMesh);

		this.anchor.add(this.group);

		this.titleGroup = new THREE.Group();
		this.titleGroup.scale.set(0, 0, 0);
		this.titleGroup.position.set(0, -1, 0);

		this.backingFrame = new BackingFrame(0.2);

		this.group.add(this.titleGroup);
			this.titleGroup.add(this.backingFrame);

		this.titleText = new TextBox(this.titleGroup, 
		{
			cssClass: "textBody",
			maxWidth: 2, 
			worldX: 0,
			worldY: 0,
			pivotX: 0,
			pivotY: 0.5,
			text: options.title
		});
		this.titleText.onSizeChanged = function(width, height)
		{
			this.backingFrame.setSize(width + 0.2, height + 0.2);
			this.backingFrame.position.set(width * (-this.titleText.pivotX + 0.5), -height * (-this.titleText.pivotY + 0.5), 0);
		}.bind(this);

		this.axis = new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
		this.axis.normalize();

		this.angle = 0;
		this.y = (Math.random() + 0.5) * (Math.random() > 0.5 ? 1 : -1);
		this.yScale = Math.random() * 0.2 + 0.3;
	}

	update(dt)
	{
		this.particles.update(dt);

		this.angle += dt * this.yScale;

		if (this.angle >= Pi2)
		{
			this.angle = this.angle % Pi2;
		}

		this.outerMesh.setRotationFromAxisAngle(this.axis, this.angle);

		if (this.animator.animation != this.animations.enter && this.animator.animation != this.animations.exit)
		{
			this.group.position.set(0, Math.sin(this.angle) * this.y, 0);
		}

		this.backingFrame.update(dt);

		// animate current state
		this.animator.update(dt);

		// update the text last so it is in sync with the animation
		this.titleText.update();
	}

	show(delay)
	{
		this.interactManager.trackObject(this.outerMesh);

		if (this.scaler.children.includes(this.anchor))
		{
			// navigated back from this item's screen, so animate back to initial pos
			this.setAnimation(this.animations.exit, true);
			this.nextAnimation = this.animations.deselected;
		}
		else
		{
			// hidden, so we need to re-add and show
			this.scaler.add(this.anchor);

			this.setAnimation(this.animations.show, true, delay);
		}
	}

	hide()
	{
		const seekToEnd = this.animator.animation == this.animations.show;

		this.setAnimation(this.animations.hide, true);

		if (seekToEnd)
		{
			this.animator.timer = this.animator.getLength();
			this.animator.update(1);
		}
	}

	isAnimating()
	{
		return this.animator.isAnimating();
	}

	disableInteraction()
	{
		this.interactManager.untrackObject(this.outerMesh);
	}

	setAnimation(anim, force, delay)
	{
		if (this.animator.animation == anim)
		{
			// trying to set the currently playing animation, so do nothing
			return;
		}

		if (this.animator.isAnimating() && force == false)
		{
			this.nextAnimation = anim;
			return;
		}

		this.animator.play(anim, this.onAnimationFinished.bind(this));

		if (delay)
		{
			this.animator.timer = -delay;
		}
	}

	onAnimationFinished(finishedAnim)
	{
		if (finishedAnim == this.animations.hide)
		{
			// special case after being hidden
			this.scaler.remove(this.anchor);
		}
		else if (this.nextAnimation)
		{
			this.setAnimation(this.nextAnimation, true);

			this.nextAnimation = null;
		}
	}
}

export class LandingScreen
{
	constructor(context)
	{
		this.appContext = context;
		this.items = [];
		this.hideFinishedCallback = null;

		// define particle options
		const particleOptions = 
		{
			emission:
			{
				rate: 10,
				shape: new Particles.ParticleSystemShapeRectangle(1.9, 0)
			},
			particles:
			{
				lifetime: new Utils.Range(1, 2),
				startSpeed: new Utils.Range(1.5, 2.5),
				startSize: new Utils.Range(0.7),
				sizeAnim: new Animation.Animation(
					[
						new Animation.Keyframe(0, 1),
						new Animation.Keyframe(0.3, 1, Animation.KeyframeExponential),
						new Animation.Keyframe(1, 0)
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
		const animations =
		{
			selected:
			{
				scale: 
				{
					anim: new Animation.Animation(
					[
						new Animation.Keyframe(0, 1, Animation.KeyframeInvExponential),
						new Animation.Keyframe(1, 1.3)
					]),
					duration: 0.1
				},
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
			deselected:
			{
				scale: 
				{
					anim: new Animation.Animation(
					[
						new Animation.Keyframe(0, 1.3, Animation.KeyframeExponential),
						new Animation.Keyframe(1, 1)
					]),
					duration: 0.05
				},
				titleScale:
				{
					anim: new Animation.Animation(
					[
						new Animation.Keyframe(0, 1, Animation.KeyframeExponential),
						new Animation.Keyframe(1, 0)
					]),
					duration: 0.05
				}
			},
			show:
			{
				scale: 
				{
					anim: new Animation.Animation(
					[
						new Animation.Keyframe(0, 0, Animation.KeyframeInvExponential),
						new Animation.Keyframe(1, 1)
					]),
					duration: 0.3
				}
			},
			hide:
			{
				scale: 
				{
					anim: new Animation.Animation(
					[
						new Animation.Keyframe(0, 1, Animation.KeyframeExponential),
						new Animation.Keyframe(1, 0)
					]),
					duration: 0.1
				}
			},
			enter:
			{
				position: 
				{
					anim: new Animation.Animation(
					[
						new Animation.KeyframeVec4(0, undefined, Animation.KeyframeExponential),
						new Animation.KeyframeVec4(1, new THREE.Vector4(2.5, -1.5, 0, 1))
					]),
					duration: 0.3
				},
				titlePos:
				{
					anim: new Animation.Animation(
					[
						new Animation.KeyframeVec3(0, new THREE.Vector3(0, -1, 0), Animation.KeyframeExponential),
						new Animation.KeyframeVec3(1, new THREE.Vector3(1.5, 0, 0)),
					]),
					duration: 0.3
				},
				titleWidth:
				{
					anim: new Animation.Animation(
					[
						new Animation.Keyframe(0, 2, Animation.KeyframeExponential),
						new Animation.Keyframe(1, 4),
					]),
					duration: 0.3
				},
				yOffset:
				{
					anim: new Animation.Animation(
					[
						new Animation.Keyframe(0, 1, Animation.KeyframeExponential),
						new Animation.Keyframe(1, 0),
					]),
					duration: 0.3
				},
				scale: 
				{
					anim: new Animation.Animation(
					[
						new Animation.Keyframe(0, undefined, Animation.KeyframeInvExponential),
						new Animation.Keyframe(1, 1.3)
					]),
					duration: 0.1
				},
				titleScale:
				{
					anim: new Animation.Animation(
					[
						new Animation.Keyframe(0, undefined, Animation.KeyframeInvExponential),
						new Animation.Keyframe(1, 1)
					]),
					duration: 0.2
				}
			},
			exit:
			{
				position: 
				{
					anim: new Animation.Animation(
					[
						new Animation.KeyframeVec4(0, new THREE.Vector4(2.5, -1.5, 0, 1), Animation.KeyframeExponential),
						new Animation.KeyframeVec4(1, undefined)
					]),
					duration: 0.1
				},
				titlePos:
				{
					anim: new Animation.Animation(
					[
						new Animation.KeyframeVec3(0, new THREE.Vector3(1.5, 0, 0), Animation.KeyframeInvExponential),
						new Animation.KeyframeVec3(1, new THREE.Vector3(0, -1, 0)),
					]),
					duration: 0.1
				},
				titleWidth:
				{
					anim: new Animation.Animation(
					[
						new Animation.Keyframe(0, 4, Animation.KeyframeExponential),
						new Animation.Keyframe(1, 2),
					]),
					duration: 0.1
				},
				yOffset:
				{
					anim: new Animation.Animation(
					[
						new Animation.Keyframe(0, 0, Animation.KeyframeInvExponential),
						new Animation.Keyframe(1, 1),
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

		// setup menu items
		Navigation.NavApps.forEach(item =>
		{
			this.items.push(new Item(context, 
				{
					title: item.title,
					anchor: new Anchorable(0, 0, xAnchor, 0.5),
					outerMesh: new THREE.Mesh(Constants.geometry.landingCubeFrame, Constants.materials.landingCubeFrame),
					innerMesh: new THREE.Mesh(Constants.geometry.landingCubeInner, Constants.materials.landingCubeInner),
					iconMesh: new THREE.Mesh(iconGeom, iconMaterial),
					particleOptions: particleOptions,
					animations: animations
				}
			));

			xAnchor += itemInc;
		});
	}

	onItemClicked(rayHit)
	{
		if (rayHit == null)
		{
			return;
		}
		
		const index = this.items.findIndex(item => item.outerMesh == rayHit.object);

		this.appContext.navigation.setNewDestination(Navigation.NavApps[index].path, this.items[index]);
	}

	getItemAtIndex(index)
	{
		return this.items[index];
	}

	show()
	{
		for (let i = 0; i < this.items.length; ++i)
		{
			this.items[i].show(i * 0.1);
		};

		// register click listener so we can interact with items
		this.appContext.contentInteractManager.addClickListener(this.constructor.name, this.onItemClicked.bind(this));
	}

	hide(finishedCallback, originData)
	{
		this.hideFinishedCallback = finishedCallback;
		this.clickedItem = originData;

		// originData will be one of this.items if we are navigating to an app, so keep that around and hide the rest
		this.items.forEach(item => 
		{
			if (item != originData)
			{
				item.hide();
			}
			else
			{
				item.setAnimation(item.animations.enter, false);
			}

			item.disableInteraction();
		});

		this.appContext.contentInteractManager.removeClickListener(this.constructor.name);
	}

	update(dt)
	{
		let hit = this.appContext.contentInteractManager.getFirstHit();
		let hideInProgress = false;

		for (let i = 0; i < this.items.length; ++i)
		{
			const current = this.items[i];
			current.update(dt);
			
			if (this.hideFinishedCallback == null)
			{
				if (hit && hit.object == current.outerMesh)
				{
					current.setAnimation(current.animations.selected, false);
				}
				else if (current.animator.animation == current.animations.selected)
				{
					current.setAnimation(current.animations.deselected, false);
				}
			}
			else
			{
				hideInProgress = hideInProgress || current.isAnimating();
			}
		}

		if (this.hideFinishedCallback != null && hideInProgress == false)
		{
			this.hideFinishedCallback(this.clickedItem);

			this.clickedItem = null;
			this.hideFinishedCallback = null;
		}
	}
}