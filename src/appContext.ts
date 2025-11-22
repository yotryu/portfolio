import * as THREE from "three";
import { CanvasScaler } from "./canvasScaler.js";
import { MeshManager } from "./meshManager.js";
import { TextureManager } from "./textureManager.js";
import { InteractManager } from "./interactManager.js";
import { Navigation } from "./navigation.js";
import * as Utils from "./libs/utils.js";

"use strict"

export class AppContext
{
	canvas: HTMLCanvasElement;
	contentCamera: THREE.PerspectiveCamera;
	hudCamera: THREE.PerspectiveCamera;
	contentScene: THREE.Scene;
	hudScene: THREE.Scene;
	contentScaler: CanvasScaler;
	hudScaler: CanvasScaler;
	renderer: THREE.WebGLRenderer;
	contentInteractManager: InteractManager;
	meshManager: MeshManager;
	textureManager: TextureManager;
	navigation: Navigation;


	constructor(canvas: HTMLCanvasElement)
	{
		const near = 0.1;
		const far = 1000;
		const aspect = canvas.clientWidth / canvas.clientHeight;

		let fov = 60;
		const contentCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);
		contentCamera.position.z = 10;
		contentCamera.lookAt(0, 0, 0);

		fov = 10;
		const hudCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);
		hudCamera.position.z = 10;
		hudCamera.lookAt(0, 0, 0);

		const contentScene = new THREE.Scene();
		contentScene.background = new THREE.Color(0x000000);

		const hudScene = new THREE.Scene();

		const refWidth = 20;
		const refHeight = 15;

		const contentScaler = new CanvasScaler(refWidth, refHeight, contentCamera, canvas);
		contentScene.add(contentScaler);

		const hudScaler = new CanvasScaler(refWidth, refHeight, hudCamera, canvas);
		hudScene.add(hudScaler);

		const renderer = new THREE.WebGLRenderer({canvas, antialias: true});
		renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
		renderer.sortObjects = false;

		const meshManager = new MeshManager();
		const textureManager = new TextureManager();
		const contentInteractManager = new InteractManager(contentScaler, textureManager, contentCamera);
		const navManager = new Navigation(this);

		this.canvas = canvas;
		this.contentCamera = contentCamera;
		this.hudCamera = hudCamera;
		this.contentScene = contentScene;
		this.hudScene = hudScene;
		this.contentScaler = contentScaler;
		this.hudScaler = hudScaler;
		this.renderer = renderer;
		this.contentInteractManager = contentInteractManager;
		this.meshManager = meshManager;
		this.textureManager = textureManager;
		this.navigation = navManager;

		// needs to happen after context properties are set, as this creates the LandingScreen which needs them
		navManager.init();
	}

	resizeCanvasesAsNeeded()
	{
		let {clientWidth, clientHeight} = this.canvas;

		if (clientWidth != this.canvas.width || clientHeight != this.canvas.height)
		{
			const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
		
			this.contentCamera.aspect = aspect;
			this.contentCamera.updateProjectionMatrix();

			this.hudCamera.aspect = aspect;
			this.hudCamera.updateProjectionMatrix();

			this.contentScaler.updateScale();
			this.hudScaler.updateScale();

			this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight, false);
		}
	}
}