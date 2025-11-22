import * as THREE from "three";
import * as Constants from "./constants.js";

"use strict"

const frameSize = 0.2;

export class BackingFrame extends THREE.Object3D
{
	protected _width: number = 0;
	protected _height: number = 0;
	protected _padding: number = 0;
	protected _offset: THREE.Vector2;
	protected _frame: THREE.Mesh;
	protected _backingQuad: THREE.Mesh;

	constructor(padding: number)
	{
		super();

		this._padding = padding;
		this._offset = new THREE.Vector2(0, 0);

		this._frame = new THREE.Mesh(Constants.geometry.unitPlane, Constants.materials.textBackingFrame);
		this._backingQuad = new THREE.Mesh(Constants.geometry.unitPlane, Constants.materials.textBackingInner);

		(this as THREE.Object3D).add(this._frame);
		(this as THREE.Object3D).add(this._backingQuad);
	}

	setSize(width, height)
	{
		this._width = width + this._padding;
		this._height = height + this._padding;

		this._frame.scale.set(this._width + frameSize, this._height + frameSize, 1);
		this._backingQuad.scale.set(this._width, this._height, 1);
	}

	update(dt)
	{
		// if (this.outerCubes == null)
		// {
		// 	return;
		// }

		// this.angle += dt * 0.2;

		// for (let i = 0; i < this.outerCubes.count; ++i)
		// {
		// 	this.outerCubes.getMatrixAt(i, tempMatrix);

		// 	tempVector.setFromMatrixPosition(tempMatrix);
		// 	tempMatrix.compose(tempVector, tempQuat, unitVector);

		// 	this.outerCubes.setMatrixAt(i, tempMatrix);
		// 	this.innerCubes.setMatrixAt(i, tempMatrix);
		// }

		// this.outerCubes.instanceMatrix.needsUpdate = true;
		// this.innerCubes.instanceMatrix.needsUpdate = true;
	}
}