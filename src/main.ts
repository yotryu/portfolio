import * as THREE from "three";
import {AppContext} from "./appContext.js";
import {LandingScreen} from "./landingScreen.js";
import { branchMesh, leafMesh, treeTrunkMesh } from "./resources.js";
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

	// testing
	const leafObject = appContext.meshManager.getLoadedMesh("leaf.obj").getObjectByName("Leaf");
	const leafMesh = leafObject instanceof THREE.Mesh ? <THREE.Mesh>(leafObject) : null;
	const branchObject = appContext.meshManager.getLoadedMesh("branch.obj").getObjectByName("Branch");
	const branchMesh = branchObject instanceof THREE.Mesh ? <THREE.Mesh>(branchObject) : null;

	const tree = new TreeObject3D({
		branchCount: new Utils.Range(150, 200),
		branchGeometry: branchMesh.geometry,
		leafGeometry: leafMesh.geometry,
		leavesPerBranch: new Utils.Range(13, 20),
		trunkScene: appContext.meshManager.getLoadedMesh("willow_trunk.obj"),
		canopyOffset: new THREE.Vector3(0, 2, 0),
		canopySizeInner: new Utils.Range(3, 3),
		canopySizeOuter: new Utils.Range(5.5, 5.5)
	});

	appContext.contentScaler.add(tree);

	function render(time)
	{
		const seconds = time * 0.001;
		let dt = 0;

		if (lastTime > 0)
		{
			dt = (seconds - lastTime);
		}
		lastTime = seconds;

		appContext.resizeCanvasesAsNeeded();

		appContext.contentInteractManager.update(dt);
		appContext.navigation.update(dt);

		tree.update(dt);

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

	await appContext.meshManager.loadOBJ(branchMesh);
	await appContext.meshManager.loadOBJ(leafMesh);
	await appContext.meshManager.loadOBJ(treeTrunkMesh);

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

	const minTime = 1000;
	const loadTime = window.performance.timing.domContentLoadedEventEnd-window.performance.timing.navigationStart;
	if (loadTime < minTime)
	{
		setTimeout(loadingFadeOut, minTime - loadTime);
	}
	else
	{
		loadingFadeOut();
	}
}

main();