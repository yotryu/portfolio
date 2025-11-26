import { Vector2, Vector3, Vector4 } from "three";
import * as Utils from "./utils.js";

"use strict"

const tempVec2 = new Vector2();
const tempVec3 = new Vector3();
const tempVec4 = new Vector4();

export enum KeyframeType
{
	Linear,
	Exponential,
	InvExponential
}

export type KeyframeValueFunc<Type> = () => Type;

class Keyframe<Type>
{
	time: number;
	value: Type;
	type: KeyframeType;


	constructor(time: number, value: Type, type: KeyframeType = KeyframeType.Linear)
	{
		this.time = time;
		this.value = value;
		this.type = type;
	}

	getValue(frame: Keyframe<Type>, valueFunc: KeyframeValueFunc<Type>)
	{
		if (typeof frame.value != "undefined")
		{
			return frame.value;
		}

		return valueFunc();
	}

	lerp(min: number, max: number, ratio: number)
	{
		return ratio * (max - min) + min;
	}

	lerpTyped(min: Type, max: Type, ratio: number): Type
	{
		// override in specific implementations
		return undefined;
	}

	evaluate(time: number, nextFrame: Keyframe<Type>, valueFunc: KeyframeValueFunc<Type>)
	{
		if (nextFrame == null || time <= this.time)
		{
			return this.getValue(this, valueFunc);
		}

		const thisValue = this.getValue(this, valueFunc);
		const nextValue = this.getValue(nextFrame, valueFunc);
		const timeRange = nextFrame.time - this.time;

		let ratio = (time - this.time) / timeRange;

		switch (this.type)
		{
			case KeyframeType.Exponential:
				ratio = ratio * ratio;
				break;

			case KeyframeType.InvExponential:
				ratio = 1 - ratio; // inverse
				ratio = ratio * ratio; // exponential
				ratio = 1 - ratio; // restore timing order
				break;

			default: break;
		}

		return this.lerpTyped(thisValue, nextValue, ratio);
	}
}

export class KeyframeNumber extends Keyframe<number>
{
	override lerpTyped(min: number, max: number, ratio: number)
	{
		return super.lerp(min, max, ratio);
	}
}

export class KeyframeVec2 extends Keyframe<Vector2>
{
	override lerpTyped(min: Vector2, max: Vector2, ratio: number)
	{
		tempVec2.x = super.lerp(min.x, max.x, ratio);
		tempVec2.y = super.lerp(min.y, max.y, ratio);

		return tempVec2;
	}
}

export class KeyframeVec3 extends Keyframe<Vector3>
{
	override lerpTyped(min: Vector3, max: Vector3, ratio: number)
	{
		tempVec3.x = super.lerp(min.x, max.x, ratio);
		tempVec3.y = super.lerp(min.y, max.y, ratio);
		tempVec3.z = super.lerp(min.z, max.z, ratio);

		return tempVec3;
	}
}

export class KeyframeVec4 extends Keyframe<Vector4>
{
	lerpTyped(min: Vector4, max: Vector4, ratio: number)
	{
		tempVec4.x = super.lerp(min.x, max.x, ratio);
		tempVec4.y = super.lerp(min.y, max.y, ratio);
		tempVec4.z = super.lerp(min.z, max.z, ratio);
		tempVec4.w = super.lerp(min.w, max.w, ratio);

		return tempVec4;
	}
}

export class Animation
{
	evaluate(time: number, valueFunc: any = null): any
	{
	}
}

export class AnimationTyped<Type> extends Animation
{
	private _keyframes: Keyframe<Type>[];

	
	constructor(keyframes: Keyframe<Type>[])
	{
		super();

		this._keyframes = keyframes;
	}

	override evaluate(time: number, valueFunc: KeyframeValueFunc<Type> = null)
	{
		// get current and next frames
		let current = null;
		let next = null;

		for (let i = 1; i < this._keyframes.length; ++i)
		{
			const check = this._keyframes[i];

			if (check.time > time)
			{
				current = this._keyframes[i - 1];
				next = check;

				break;
			}
		}

		if (current == null)
		{
			current = this._keyframes[this._keyframes.length - 1];
			return current.getValue(current, valueFunc);
		}

		return current.evaluate(time, next, valueFunc);
	}
}

export interface AnimationTrack
{
	anim: Animation;
	duration: number | Utils.Range;
}

export interface AnimatorBinding
{
	update: (value: any) => void;
	undefinedGetter?: () => any;
}

export type AnimationTracks = Record<string, AnimationTrack>;
export type AnimationCollection = Record<string, AnimationTracks>;
export type AnimatorBindingRecord = Record<string, AnimatorBinding>;
export type AnimatorDurationRecord = Record<string, number>;
export type AnimatorFinishDelegate = (anim: AnimationTracks) => void;

export class Animator
{
	private _animationTracks: AnimationTracks;
	private _bindings: AnimatorBindingRecord;
	private _timer: number;
	private _length: number;
	private _durations: AnimatorDurationRecord;
	private _stillAnimating: boolean;
	private _finishCallback: AnimatorFinishDelegate;


	constructor(bindings: AnimatorBindingRecord)
	{
		this._animationTracks = null;
		this._bindings = bindings;
		this._timer = 0;
		this._length = 0;
		this._stillAnimating = false;
		this._finishCallback = null;
		this._durations = {};
	}

	play(animationTracks: AnimationTracks, finishCallback: AnimatorFinishDelegate)
	{
		this._animationTracks = animationTracks;
		this._timer = 0;
		this._length = 0;
		this._stillAnimating = true;
		this._finishCallback = finishCallback;

		const getDuration = function(propDuration: number | Utils.Range)
		{
			if (typeof propDuration == "number")
			{
				// basic number provided, so simply return
				return propDuration;
			}

			// assuming this is an object with "min" and "max" values to do a random range
			const range = propDuration.max - propDuration.min;
			return Math.random() * range + propDuration.min;
		}

		for (const propertyName in this._animationTracks)
		{
			const animProp = this._animationTracks[propertyName];
			const duration = getDuration(animProp.duration);

			this._durations[propertyName] = duration;
			this._length = Math.max(this._length, duration);
		}
	}

	getLength()
	{
		return this._length;
	}

	isAnimating()
	{
		return this._stillAnimating;
	}

	getCurrentTracks()
	{
		return this._animationTracks;
	}

	setTime(time: number)
	{
		this._timer = time;
	}

	update(dt: number)
	{
		if (this._animationTracks == null || this._stillAnimating == false)
		{
			return;
		}

		this._timer += dt;

		this._stillAnimating = false;

		for (const propertyName in this._animationTracks)
		{
			if (this._bindings.hasOwnProperty(propertyName) == false)
			{
				continue;
			}

			const binding = this._bindings[propertyName];
			const animProp = this._animationTracks[propertyName];
			const ratio = Math.min(1, Math.max(0, this._timer / this._durations[propertyName]));
			const value = animProp.anim.evaluate(ratio, binding.undefinedGetter);

			binding.update(value);

			this._stillAnimating = this._stillAnimating || ratio < 1;
		}

		if (this._stillAnimating == false)
		{
			// just finished
			if (this._finishCallback)
			{
				this._finishCallback(this._animationTracks);
			}
		}
	}
}