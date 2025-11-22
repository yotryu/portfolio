import * as THREE from "three";

"use strict"

const landingCubeFrameSize = 2;
const landingCubeInnerSize = landingCubeFrameSize - 0.2;
const appItemFrameSize = 0.7;
const appItemInnerSize = appItemFrameSize - 0.2;

export const playStoreBadgePng = "https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png";

export const geometry =
{
	landingCubeFrame: new THREE.BoxGeometry(landingCubeFrameSize, landingCubeFrameSize, landingCubeFrameSize),
	landingCubeInner: new THREE.BoxGeometry(landingCubeInnerSize, landingCubeInnerSize, landingCubeInnerSize),
	appItemFrame: new THREE.BoxGeometry(appItemFrameSize, appItemFrameSize, appItemFrameSize),
	appItemInner: new THREE.BoxGeometry(appItemInnerSize, appItemInnerSize, appItemInnerSize),
	unitPlane: new THREE.PlaneGeometry(1, 1),
};

export const materials = 
{
	landingCubeFrame: new THREE.MeshBasicMaterial(
		{
			blending: THREE.NoBlending,
			side: THREE.BackSide,
			transparent: true,
			depthWrite: false
		}),
	landingCubeInner: new THREE.MeshBasicMaterial(
		{
			blending: THREE.NoBlending,
			side: THREE.BackSide,
			color: 0,
			transparent: true,
			depthWrite: false,
			stencilWrite: true,
			stencilRef: 1,
			stencilFunc: THREE.AlwaysStencilFunc,
			stencilZPass: THREE.ReplaceStencilOp
		}),
	textBackingFrame: new THREE.MeshBasicMaterial(
		{
			blending: THREE.NoBlending,
			side: THREE.FrontSide,
			transparent: true,
			depthWrite: false,
			depthTest: false
		}),
	textBackingInner: new THREE.MeshBasicMaterial(
		{
			blending: THREE.NoBlending,
			side: THREE.FrontSide,
			color: 0,
			transparent: true,
			depthWrite: false,
			depthTest: false,
			stencilWrite: true,
			stencilRef: 1,
			stencilFunc: THREE.AlwaysStencilFunc,
			stencilZPass: THREE.ReplaceStencilOp
		}),
};