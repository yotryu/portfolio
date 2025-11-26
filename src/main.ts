import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {AppContext} from "./appContext.js";
import {LandingScreen} from "./landingScreen.js";
import { branchesMesh, branchMesh, leafMesh, treeTrunkMesh, unitSphereMesh } from "./resources.js";
import { TreeObject3D } from "./treeObject.js";
import * as Utils from "./libs/utils.js";

"use strict"

let canvas: HTMLCanvasElement;
let appContext: AppContext;

function setupRenderer(renderer: THREE.WebGLRenderer, clear: boolean)
{
	renderer.autoClearColor = clear;
	renderer.autoClearStencil = clear;
}

function startRendering()
{
	let lastTime = 0;

	function render(time)
	{
		const seconds = time * 0.001;
		let dt = 0;

		if (lastTime > 0)
		{
			dt = Math.min(seconds - lastTime, 1);
		}
		lastTime = seconds;

		appContext.resizeCanvasesAsNeeded();

		appContext.contentInteractManager.update(dt);
		appContext.navigation.update(dt);

		setupRenderer(appContext.renderer, true);
		appContext.renderer.render(appContext.contentScene, appContext.contentCamera);

		setupRenderer(appContext.renderer, false);
		appContext.renderer.render(appContext.hudScene, appContext.hudCamera);

		requestAnimationFrame(render);
	}

	requestAnimationFrame(render);
}

async function main()
{
	const loading = document.querySelector<HTMLElement>("#loading");
	canvas = document.querySelector<HTMLCanvasElement>("#threeCanvas");

	appContext = new AppContext(canvas);

	await appContext.meshManager.loadOBJ(unitSphereMesh);

	function loadingFadeOut()
	{
		loading.style.animation = "fadeOut 0.3s ease";
		loading.addEventListener("animationend", () =>
			{
				loading.style.display = "none";
				startRendering();
			},
			{ once: true } 
		);
	}

	loadingFadeOut();

	// const minTime = 0;
	// const loadTime = window.performance.timing.domContentLoadedEventEnd-window.performance.timing.navigationStart;
	// if (loadTime < minTime)
	// {
	// 	setTimeout(loadingFadeOut, minTime - loadTime);
	// }
	// else
	// {
	// 	loadingFadeOut();
	// }
}

main();