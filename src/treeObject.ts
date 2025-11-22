import * as THREE from "three";
import * as Utils from "./libs/utils";
import { AppContext } from "./appContext";
import * as Constants from "./constants";

"use strict"

const vertexShader = `
// uniforms
uniform float time;
// uniform vec3 force;
uniform vec2 forceLookupOffset;
uniform float forceLookupRange;
uniform float forceLookupTweak;
uniform sampler2D forceTex;

// attributes we get from geometry
// attribute vec3 color;
// attribute float alpha;
// attribute float size;
// attribute float rotation;

varying vec3 vColor;
// varying float vAlpha;

// varying float vSin;
// varying float vCos;

// vertex shader main
void main() 
{
	mat4 MIMat = modelMatrix * instanceMatrix;
	mat4 MVIMat = viewMatrix * MIMat;
	float xRatio = ((MIMat[3].x - forceLookupOffset.x) / forceLookupRange) + forceLookupTweak + (MIMat[3].x / (forceLookupRange * 0.5)) * 0.1;
	vec2 uv = vec2(xRatio, 0.5);
	vec3 force = texture2D(forceTex, uv).rgb;

	// set position
	vec3 pos = position;
	float scale = abs(pos.y / 4.0);
	vec3 windOffset = vec3(instanceMatrix[3].x * 0.5, pos.y, pos.z) + (force * scale * scale);
	vec3 adjustDir = normalize(windOffset);
	vec3 targetPos = vec3(vec2(adjustDir.xy) * abs(pos.y), pos.z);
	pos = vec3(targetPos.x + pos.x, targetPos.y, targetPos.z);
	gl_Position = projectionMatrix * MVIMat * vec4(pos, 1.0);

	// set color
	vColor = vec3(0.5, 0.25, 0.08);
}
`;

const fragmentShader = `
// params we get from vertex shader
// varying float vAlpha;
varying vec3 vColor;
// varying float vSin;
// varying float vCos;

// diffuse texture
//uniform sampler2D _texture;

// fragment shader main
void main() 
{
	// float mid = 0.5;
	// vec2 rotated = vec2(vCos * (gl_PointCoord.x - mid) + vSin * (gl_PointCoord.y - mid) + mid,
	// 					vCos * (gl_PointCoord.y - mid) - vSin * (gl_PointCoord.x - mid) + mid);
	vec4 textureCol = vec4(1, 1, 1, 1);

	// get color with texture
	gl_FragColor = vec4(vColor, 1) * textureCol;
	// gl_FragColor = textureCol;
}
`;


export interface TreeBranchOptions
{
	leafCount: number;
	positionCenter: THREE.Vector3;
	positionSize: Utils.Range;
}

export class TreeBranch extends THREE.Object3D
{
	leaves: THREE.Vector3[];


	constructor(options: TreeBranchOptions)
	{
		super();

		// pick direction to position with
		let posDir = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
		posDir.normalize(); // on sphere

		// ensure positive Y
		posDir.y = Math.abs(posDir.y);

		// branch pos from dir and possible position dist
		let pos = new THREE.Vector3(options.positionCenter.x, options.positionCenter.y, options.positionCenter.z);
		pos.addScaledVector(posDir, options.positionSize.random());

		this.position.set(pos.x, pos.y, pos.z);
		// this.setRotationFromEuler(new THREE.Euler(0, Math.random() * Math.PI * 2, 0));

		// leaves
		this.leaves = new Array<THREE.Vector3>(options.leafCount);
		for (let i = 0; i < this.leaves.length; ++i)
		{
			const x = Math.sign(Math.random() - 0.5) * 0.05;
			const y = (Math.random() * -4);
			this.leaves[i] = new THREE.Vector3(x, y, 0);
		}
	}
}


export interface TreeOptions
{
	trunkScene: THREE.Object3D<THREE.Object3DEventMap>;
	branchGeometry: THREE.BufferGeometry;
	leafGeometry: THREE.BufferGeometry;

	canopyOffset: THREE.Vector3;
	canopySizeInner: Utils.Range;
	canopySizeOuter: Utils.Range;

	branchCount: Utils.Range;
	leavesPerBranch: Utils.Range;
}


export class TreeObject3D extends THREE.Object3D
{
	private _appContext: AppContext;

	private _trunkScene: THREE.Object3D<THREE.Object3DEventMap>;
	private _branchInstancedMesh: THREE.InstancedMesh;
	private _leafInstancedMesh: THREE.InstancedMesh;
	private _branchMaterial: THREE.ShaderMaterial;

	private _branches: TreeBranch[];
	private _leafCount: number;

	private _time: number;
	private _force: THREE.Vector3;
	private _impulse: THREE.Vector3;
	private _impulseRange: Utils.Range;
	private _impulseDuration: number;
	private _impulseDurationRange: Utils.Range;
	private _acceleration: THREE.Vector3;

	private _forceIncrements: number;
	private _forceIncrementInterval: number;
	private _forceIncrementTimer: number;
	private _forceOnX: Float32Array;
	private _forceTexture: THREE.DataTexture;

	private _canopySizeRange: Utils.Range;
	private _canopyOffset: THREE.Vector3;

	private _dummy: THREE.Object3D;


	constructor(appContext: AppContext, options: TreeOptions)
	{
		super();

		this._appContext = appContext;

		this._time = 0;
		this._force = new THREE.Vector3(0, 0, 0);
		this._impulse = new THREE.Vector3(0, 0, 0);
		this._impulseRange = new Utils.Range(4, 8);
		this._impulseDuration = 0;
		this._impulseDurationRange = new Utils.Range(1, 2);
		this._acceleration = new THREE.Vector3(0, 0, 0);

		this._dummy = new THREE.Object3D();

		// get our numbers first
		const branchCount = options.branchCount.randomInt();
		this._canopySizeRange = new Utils.Range(options.canopySizeInner.random(), options.canopySizeOuter.random());
		this._canopyOffset = options.canopyOffset;

		this._branches = new Array<TreeBranch>(branchCount);
		this._leafCount = 0;

		this._forceIncrements = 20;
		this._forceIncrementInterval = 0.1;
		this._forceIncrementTimer = 0;

		this._forceOnX = new Float32Array(this._forceIncrements * 1 * 4); // x * y * components

		this._forceTexture = new THREE.DataTexture(this._forceOnX, this._forceIncrements, 1, THREE.RGBAFormat, THREE.FloatType, undefined, undefined, undefined, THREE.LinearFilter, THREE.LinearFilter);
		this._forceTexture.needsUpdate = true;
		
		// add light
		const dirLight = new THREE.DirectionalLight();
		dirLight.position.set(-5, 5, 5);
		dirLight.target.position.set(0, 0, 0);
		this.add(dirLight);

		const ambientLight = new THREE.AmbientLight(new THREE.Color(1, 1, 1), 0.2);
		this.add(ambientLight);

		// add trunk
		const trunkMat = new THREE.MeshPhongMaterial({color: new THREE.Color(0.6, 0.3, 0.1)});
		this._trunkScene = options.trunkScene.clone();
		this._trunkScene.position.set(6, -4, 0);
		this._trunkScene.scale.set(1.3, 1.3, 1.3);

		this._trunkScene.traverse(node =>
		{
			if (node instanceof THREE.Mesh)
			{
				node.material = trunkMat;
			}
		});

		this.add(this._trunkScene);

		// branches mesh
		const uniforms = {
			time: {value: 0},
			forceLookupOffset: {value: new THREE.Vector2(options.canopyOffset.x - this._canopySizeRange.max)},
			forceLookupRange: {value: this._canopySizeRange.max * 2},
			forceLookupTweak: {value: 0},
			// force: {value: this._force},
			forceTex: {value: this._forceTexture}
		};

		this._branchMaterial = new THREE.ShaderMaterial(
		{
			uniforms:       uniforms,
			vertexShader:   vertexShader,
			fragmentShader: fragmentShader,
			transparent:    false,
			blending:       THREE.NormalBlending,
			vertexColors:   true,
			depthWrite:     true,
			depthTest:      true
		});

		this._branchInstancedMesh = new THREE.InstancedMesh(options.branchGeometry, this._branchMaterial, this._branches.length);
		this.add(this._branchInstancedMesh);
	
		// create branches to find out how many we need, and how many leaves we'll have
		for (let i = 0; i < branchCount; ++i)
		{
			const branchLeafCount = options.leavesPerBranch.randomInt();
			this._leafCount += branchLeafCount;
			this._branches[i] = new TreeBranch({leafCount: branchLeafCount, positionCenter: options.canopyOffset, positionSize: this._canopySizeRange});
		}

		// leaves mesh
		const leafMat = new THREE.MeshBasicMaterial({blending: THREE.NormalBlending, side: THREE.DoubleSide, depthWrite: true, depthTest: true});
		this._leafInstancedMesh = new THREE.InstancedMesh(options.leafGeometry, leafMat, this._leafCount);
		this._leafInstancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
		this.add(this._leafInstancedMesh);

		// init all instance matrices
		let leafIndex = 0;
		
		// branches
		const redRange = new Utils.Range(0, 0);
		const greenRange = new Utils.Range(0.6, 0.8);
		const blueRange = new Utils.Range(0.05, 0.15);
		// const redRange = new Utils.Range(0.6, 0.9);
		// const greenRange = new Utils.Range(0.1, 0.2);
		// const blueRange = new Utils.Range(0.4, 0.6);
		for (let b = 0; b < this._branches.length; ++b)
		{
			const branch = this._branches[b];
			const branchPos = branch.position;

			this._dummy.position.set(branchPos.x, branchPos.y, branchPos.z);
			this._dummy.scale.set(1, 1, 1);
			this._dummy.setRotationFromEuler(this._branches[b].rotation);

			this._dummy.updateMatrix();
			this._branchInstancedMesh.setMatrixAt(b, this._dummy.matrix);

			const leafColour = new THREE.Color(redRange.random(), greenRange.random(), blueRange.random());

			// leaves
			for (let i = 0; i < branch.leaves.length; ++i)
			{
				const leaf = branch.leaves[i];
				this._dummy.position.set(leaf.x + branchPos.x, leaf.y + branchPos.y, leaf.z + branchPos.z);
				this._dummy.scale.set(1, 1, 1);

				this._dummy.updateMatrix();
				this._leafInstancedMesh.setMatrixAt(leafIndex, this._dummy.matrix);
				this._leafInstancedMesh.setColorAt(leafIndex, leafColour);

				++leafIndex;
			}
		}

		// force update to get initial force data calculated and set
		this.update(1, true);
	}

	lerp(a: number, b: number, t: number)
	{
		return a + (b - a) * t;
	}

	update(dt: number, setAllForceValues?: boolean)
	{
		const prevTime = this._time;

		this._time += dt;

		this._branchMaterial.uniforms.time.value = this._time;

		if (this._impulseDuration <= 0 && Math.floor(prevTime) != Math.floor(this._time) && Math.random() < 0.2)
		{
			this._impulse.x = this._impulseRange.random();
			this._impulseDuration = this._impulseDurationRange.random();
		}

		this._impulseDuration -= dt;
		if (this._impulseDuration > 0)
		{
			this._acceleration.addScaledVector(this._impulse, dt);
		}

		// acceleration always drops opposite to force
		this._acceleration.addScaledVector(new THREE.Vector3(this._force.x, 0, this._force.z).multiplyScalar(-1), dt);

		
		// apply acceleration
		this._force.addScaledVector(this._acceleration, dt);
		this._force.addScaledVector(new THREE.Vector3(0, -10, 0), dt);

		this._force.multiplyScalar(1 - (0.5 * dt));
		this._force.y = Math.max(this._force.y, -5);
		// console.log(dt);

		// clamp force
		// this._force = this._force.clampLength(-12, 12);

		// this._branchMaterial.uniforms.force.value = this._force;


		// update force across X
		this._forceOnX[0] = this._force.x;
		this._forceOnX[1] = this._force.y;
		this._forceOnX[2] = this._force.z;

		if (setAllForceValues)
		{
			// forced update, so propogate all force values to the full data set
			for (let i = 0; i < this._forceOnX.length; i += 4)
			{
				this._forceOnX[i] = this._force.x;
				this._forceOnX[i + 1] = this._force.y;
				this._forceOnX[i + 2] = this._force.z;
				this._forceOnX[i + 3] = 0;
			}
		}

		this._forceIncrementTimer -= dt;
		while (this._forceIncrementTimer <= 0)
		{
			this._forceIncrementTimer += this._forceIncrementInterval;

			for (let i = this._forceOnX.length - 4; i >= 4; i -= 4)
			{
				this._forceOnX[i] = this._forceOnX[i - 4];
				this._forceOnX[i + 1] = this._forceOnX[i + 1 - 4];
				this._forceOnX[i + 2] = this._forceOnX[i + 2 - 4];
				this._forceOnX[i + 3] = this._forceOnX[i + 3 - 4];
			}
		}

		this._forceTexture.needsUpdate = true;

		const minX = this._canopyOffset.x - this._canopySizeRange.max;
		const maxX = this._canopyOffset.x + this._canopySizeRange.max;
		const xRange = maxX - minX;
		const incRatio = this._forceIncrementTimer / this._forceIncrementInterval;

		this._branchMaterial.uniforms.forceLookupTweak.value = incRatio / this._forceIncrements;

		let leafIndex = 0;
		
		const camGroundPlanePosition = this._appContext.contentCamera.position.clone();
		camGroundPlanePosition.y = 0;
		camGroundPlanePosition.normalize();
		const angle = new THREE.Vector3(0, 0, 1).angleTo(camGroundPlanePosition);
		const rightWorld = new THREE.Vector3(0, camGroundPlanePosition.x < 0 ? -1 : 1, 0);
		const invCamRotQuat = new THREE.Quaternion().setFromAxisAngle(rightWorld, angle);
		const dummyQuat = new THREE.Quaternion();
		
		
		// branches
		for (let b = 0; b < this._branches.length; ++b)
		{
			const branch = this._branches[b];
			const branchPos = branch.position;
			const xRatio = (branchPos.x - minX) / xRange;
			const rawRatio = ((this._forceIncrements - 1) * xRatio) + incRatio;
			const forcePreIndex = Math.floor(rawRatio) * 4;
			const forcePostIndex = Math.ceil(rawRatio) * 4;
			let force = new THREE.Vector3(0, 0, 0);

			if (forcePreIndex == forcePostIndex)
			{
				force.x = this._forceOnX[forcePreIndex];
				force.y = this._forceOnX[forcePreIndex + 1];
				force.z = this._forceOnX[forcePreIndex + 2];
			}
			else
			{
				const incrementRatio = rawRatio - Math.floor(rawRatio);
				force.x = this.lerp(this._forceOnX[forcePreIndex], this._forceOnX[forcePostIndex], incrementRatio);
				force.y = this.lerp(this._forceOnX[forcePreIndex + 1], this._forceOnX[forcePostIndex + 1], incrementRatio);
				force.z = this.lerp(this._forceOnX[forcePreIndex + 2], this._forceOnX[forcePostIndex + 2], incrementRatio);
			}

			const forceStrength = force.length();

			// leaves
			for (let i = 0; i < branch.leaves.length; ++i)
			{
				const pos = branch.leaves[i];
				const scale = Math.abs(pos.y / 4);
				const windOffset = (new THREE.Vector3(branchPos.x * 0.5, pos.y, pos.z)).addScaledVector(force, scale * scale);
				const adjustDir = (new THREE.Vector3(windOffset.x, windOffset.y, windOffset.z)).normalize();
				const targetPos = (new THREE.Vector3(adjustDir.x, adjustDir.y, adjustDir.z)).multiplyScalar(Math.abs(pos.y));
				const newPos = new THREE.Vector3(targetPos.x + pos.x, targetPos.y, targetPos.z);

				this._dummy.position.set(newPos.x + branchPos.x, newPos.y + branchPos.y, newPos.z + branchPos.z);
				this._dummy.scale.set(1, 1, 1);
				dummyQuat.setFromEuler(new THREE.Euler(0, Math.sin(this._time * (i % 3)) * 0.1, Math.atan2(force.x, -force.y) + Math.sin(this._time * (i % 5)) * 0.02 * forceStrength));
				dummyQuat.multiply(invCamRotQuat);
				this._dummy.setRotationFromQuaternion(dummyQuat);

				this._dummy.updateMatrix();
				this._leafInstancedMesh.setMatrixAt(leafIndex, this._dummy.matrix);

				++leafIndex;
			}
		}

		this._leafInstancedMesh.instanceMatrix.needsUpdate = true;
	}
}