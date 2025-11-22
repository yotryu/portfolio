import * as Particles from "./particleSystem.js";
import * as Animation from "./animation.js";
import * as THREE from "three";

"use strict"

export class GeoGridScreen
{
	constructor(context)
	{
		this.appContext = context;
		


		// register click listener so we can interact with items
		context.contentInteractManager.addClickListener(this.constructor.name, this.onItemClicked.bind(this));
	}

	dispose()
	{
		this.appContext.contentInteractManager.removeClickListener(this.constructor.name);
	}

	onItemClicked(rayHit)
	{
		
	}

	show(originData)
	{

	}

	hide(finishedCallback, originData)
	{
		finishedCallback(originData);
	}

	update(dt)
	{
		
	}
}