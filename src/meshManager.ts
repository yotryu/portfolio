import * as THREE from "three";
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js'
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

"use strict"

export type MeshGroupMap = Record<string, THREE.Group<THREE.Object3DEventMap>>;

export class MeshManager
{
	private _cache: MeshGroupMap = {};
	private _objLoader = new OBJLoader();
	// private _gltfLoader = new GLTFLoader();


	async loadOBJ(path: string)
	{
		const name = path;//path.split('\\').pop().split('/').pop();

		if (this._cache.hasOwnProperty(name))
		{
			return Promise.resolve(this._cache[name]);
		}

		return new Promise((resolve, reject) =>
		{
			this._objLoader.load(path, 
				(obj) => 
				{
					// console.log(`Loaded ${path}`);
					//mesh.material = new THREE.MeshBasicMaterial();
		
					this._cache[name] = obj;
		
					return resolve(obj);
				}, 
				undefined,
				(error) =>
				{
					console.error(error);
		
					return reject();
				});
		});
	}

	async loadOBJs(paths: string[])
	{
		for (const path of paths)
		{
			await this.loadOBJ(path)
				.catch(() =>
				{
					// failed to load mesh, so we'll exit now
					return Promise.reject();
				});
		}

		// successfully loaded all specified meshes, so alert
		return Promise.resolve();
	}

	// async loadGLTF(path: string)
	// {
	// 	return new Promise((resolve, reject) =>
	// 		this._gltfLoader.load(path, (gltf) => {
				
	// 			return resolve(gltf);
	// 		}, undefined,
	// 		(error) => {
	// 			console.error(error);
	// 			return reject(error);
	// 		})
	// 	);
	// }

	getLoadedMesh(name: string)
	{
		if (this._cache.hasOwnProperty(name))
		{
			return this._cache[name];
		}

		return null;
	}
}