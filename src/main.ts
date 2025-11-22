import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {AppContext} from "./appContext.js";
import {LandingScreen} from "./landingScreen.js";
import { branchesMesh, branchMesh, leafMesh, treeTrunkMesh } from "./resources.js";
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
	const branchObject = appContext.meshManager.getLoadedMesh("leaf_branch.obj").getObjectByName("LeafBranch");
	const branchMesh = branchObject instanceof THREE.Mesh ? <THREE.Mesh>(branchObject) : null;
	const branches: THREE.Mesh[] = [];
	
	appContext.meshManager.getLoadedMesh("branches.obj").traverse(node =>
	{
		if (node instanceof THREE.Mesh)
		{
			branches.push(<THREE.Mesh>(node));
		}
	});

	const cameraControls = new OrbitControls(appContext.contentCamera, appContext.renderer.domElement);

	const tree = new TreeObject3D(appContext, {
		branchCount: new Utils.Range(30, 50),
		leafBranchCount: new Utils.Range(300, 400),
		leftBranchGeometry: branchMesh.geometry,
		leafGeometry: leafMesh.geometry,
		branchesGeometry: branches.map(n => n.geometry),
		leavesPerBranch: new Utils.Range(15, 20),
		trunkScene: appContext.meshManager.getLoadedMesh("willow_trunk.obj"),
		canopyOffset: new THREE.Vector3(0, 2, 0),
		canopySizeInner: new Utils.Range(3, 3),
		canopySizeOuter: new Utils.Range(12, 12)
	});

	appContext.contentScaler.add(tree);

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
		cameraControls.update();

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
	await appContext.meshManager.loadOBJ(branchesMesh);
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