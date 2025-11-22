import * as THREE from "three";

"use strict"

export class TextureManager
{
	private _cache = {};


	load(path: string)
	{
		if (this._cache.hasOwnProperty(path))
		{
			return this._cache[path];
		}

		const texture = new THREE.TextureLoader().load(path);
		this._cache[path] = texture;

		return texture;
	}
}