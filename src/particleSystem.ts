import * as THREE from "three";
import * as Utils from "./libs/utils";
import * as Animation from "./libs/animation";
import { CanvasScaler } from "./canvasScaler";

"use strict"

const vertexShader = `
// uniforms
uniform float baseScale;

// attributes we get from geometry
attribute float alpha;
attribute float size;
attribute float rotation;

varying vec3 vColor;
varying float vAlpha;

#ifdef USE_TEXTURE
varying float vSin;
varying float vCos;
#endif

// vertex shader main
void main() 
{
	// alpha and color
	vAlpha = alpha;

	// set color
	vColor = color;

	// set position
	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
	gl_Position = projectionMatrix * mvPosition;

	// set rotation
	#ifdef USE_TEXTURE
	vSin = sin(rotation);
	vCos = cos(rotation);
	#endif

	gl_PointSize = size * baseScale;
}
`;

const fragmentShader = `
// params we get from vertex shader
varying float vAlpha;
varying vec3 vColor;
varying float vSin;
varying float vCos;

// diffuse texture
uniform sampler2D _texture;

// fragment shader main
void main() 
{
	#ifdef USE_TEXTURE
	float mid = 0.5;
	vec2 rotated = vec2(vCos * (gl_PointCoord.x - mid) + vSin * (gl_PointCoord.y - mid) + mid,
						vCos * (gl_PointCoord.y - mid) - vSin * (gl_PointCoord.x - mid) + mid);
	vec4 textureCol = texture2D(_texture, rotated);
	#else
	vec4 textureCol = vec4(1, 1, 1, 1);
	#endif

	// get color with texture
	gl_FragColor = vec4(vColor, vAlpha) * textureCol;
}
`;

const tempVec3 = [ new THREE.Vector3(), new THREE.Vector3() ];


export class ParticleSystemShape
{
	random(outPos: THREE.Vector3, outVel: THREE.Vector3 = null)
	{}
}

export class ParticleSystemShapeCircle extends ParticleSystemShape
{
	private _radiusRange: Utils.Range;


	constructor(minRadius: number, maxRadius: number)
	{
		super();

		this._radiusRange = new Utils.Range(minRadius, maxRadius);
	}

	override random(outPos: THREE.Vector3, outVel: THREE.Vector3)
	{
		const angle = Math.random() * Math.PI * 2;
		const sinVal = Math.sin(angle);
		const cosVal = Math.cos(angle);
		const radius = this._radiusRange.random();

		outPos.x = sinVal * radius;
		outPos.y = cosVal * radius;
		outPos.z = 0;

		if (outVel)
		{
			outVel.x = sinVal;
			outVel.y = cosVal;
			outVel.z = 0;
		}
	}
}

export class ParticleSystemShapeRectangle extends ParticleSystemShape
{
	private _xRange: Utils.Range;
	private _yRange: Utils.Range;


	constructor(width: number, height: number)
	{
		super();

		const halfWidth = width * 0.5;
		const halfHeight = height * 0.5;

		this._xRange = new Utils.Range(-halfWidth, halfWidth);
		this._yRange = new Utils.Range(-halfHeight, halfHeight);
	}

	random(outPos: THREE.Vector3, outVel: THREE.Vector3)
	{
		outPos.x = this._xRange.random();
		outPos.y = this._yRange.random();
		outPos.z = 0;

		if (outVel)
		{
			outVel.x = 0;
			outVel.y = 0;
			outVel.z = 1;
		}
	}
}

export interface ParticleOptions
{
	lifetime: Utils.Range;
	startSpeed?: Utils.Range;
	startSize: Utils.Range;
	startAngle?: Utils.Range;
	startAlpha?: Utils.Range;

	sizeAnim?: Animation.Animation;
	angleAnim?: Animation.Animation;
	alphaAnim?: Animation.Animation;
}

export interface ParticleEmissionOptions
{
	shape: ParticleSystemShape;
	rate: number;
}

export interface ParticleSystemOptions
{
	useWorldPosition?: boolean;
	texture?: THREE.Texture;
	transparent?: boolean;
	blending?: THREE.Blending;
	depthWrite?: boolean;
	depthTest?: boolean;
	maxParticles?: number;

	emission: ParticleEmissionOptions;
	particles: ParticleOptions;
}

export class Particle
{
	finished: boolean;

	private _system: ParticleSystem;
	private _age: number;
	private _lifetime: number;
	private _startWorldPosition: THREE.Vector3;
	private _rotationSpeed: number;
	private _velocity: THREE.Vector3;
	private _position: THREE.Vector3;
	private _size: number;
	private _angle: number;
	private _alpha: number;


	constructor(system: ParticleSystem)
	{
		this._system = system;

		this._age = 0;
		this._lifetime = 0;
		this.finished = true;

		this._startWorldPosition = system.options.useWorldPosition ? new THREE.Vector3() : null;
		this._rotationSpeed = null;
		this._velocity = null;
		this._position = new THREE.Vector3();
		this._size = 1;
		this._angle = null;
		this._alpha = 1;
	}

	reset()
	{
		this._age = 0;
		this._lifetime = this._system.options.particles.lifetime.random();
		this.finished = false;

		if (this._startWorldPosition)
		{
			this._system.getWorldPosition(tempVec3[0]);
			this._startWorldPosition.set(tempVec3[0].x, tempVec3[0].y, tempVec3[0].z);
		}

		if (this._system.options.particles.startSpeed)
		{
			this._velocity = new THREE.Vector3();
		}

		this._system.options.emission.shape.random(this._position, this._velocity);

		if (this._velocity)
		{
			this._velocity.multiplyScalar(this._system.options.particles.startSpeed.random());
		}

		this._size = this._system.options.particles.startSize.random();

		if (this._system.options.particles.startAngle)
		{
			this._angle = this._system.options.particles.startAngle.random();
		}

		if (this._system.options.particles.startAlpha)
		{
			this._alpha = this._system.options.particles.startAlpha.random();
		}
	}

	update(index: number, dt: number)
	{
		this._age += dt;

		if (this._age >= this._lifetime)
		{
			this.finished = true;
			return;
		}

		const ratio = this._age / this._lifetime;

		// set animated rotation
		if (this._angle)
		{
			let angle = this._angle;

			if (this._system.options.particles.angleAnim)
			{
				angle += this._system.options.particles.angleAnim.evaluate(ratio);
			}

			this._system.setRotation(index, angle);
		}

		// update position
		if (this._velocity)
		{
			this._position.x += this._velocity.x * dt;
			this._position.y += this._velocity.y * dt;
			this._position.z += this._velocity.z * dt;
		}

		let positionToSet = this._position;

		// to maintain world position
		if (this._startWorldPosition) 
		{
			const systemOffset = tempVec3[0];

			systemOffset.set(
				this._startWorldPosition.x, 
				this._startWorldPosition.y, 
				this._startWorldPosition.z
			);

			this._system.worldToLocal(systemOffset);

			positionToSet = tempVec3[1];
			positionToSet.set(
				this._position.x + systemOffset.x,
				this._position.y + systemOffset.y,
				this._position.z + systemOffset.z
			);
		}

		this._system.setPosition(index, positionToSet);

		let size = this._size;
		if (this._system.options.particles.sizeAnim)
		{
			size *= this._system.options.particles.sizeAnim.evaluate(ratio);
		}

		this._system.setSize(index, size);

		if (this._alpha)
		{
			let alpha = this._alpha;

			if (this._system.options.particles.alphaAnim)
			{
				alpha *= this._system.options.particles.alphaAnim.evaluate(ratio);
			}

			this._system.setAlpha(index, alpha);
		}
	}
}

export class ParticleSystem extends THREE.Object3D
{
	options: ParticleSystemOptions;

	private _particlesGeometry: THREE.BufferGeometry;
	private _material: THREE.ShaderMaterial;

	private _aliveParticles: Particle[];
	private _deadParticles: Particle[];

	private _particleSystem: THREE.Points;

	private _emitInterval: number;
	private _emitTimer: number;
	private _paused: boolean;

	private _positionDirty: boolean;
	private _sizeDirty: boolean;
	private _coloursDirty: boolean;
	private _alphaDirty: boolean;
	private _rotateDirty: boolean;


	constructor(options: ParticleSystemOptions)
	{
		super();

		let uniforms = 
		{
			baseScale: { value: 1 },
			_texture: undefined
		};

		let flags = "";

		if (options.texture)
		{
			uniforms._texture = { value: options.texture };
			flags += "#define USE_TEXTURE\n";
		}

		this.options = options;
		this._particlesGeometry = new THREE.BufferGeometry();
		
		this._material = new THREE.ShaderMaterial(
		{
			uniforms:       uniforms,
			vertexShader:   flags + vertexShader,
			fragmentShader: flags + fragmentShader,
			transparent:    Boolean(options.transparent),
			blending:       options.blending,
			vertexColors:   true,
			depthWrite:     Boolean(options.depthWrite),
			depthTest:      Boolean(options.depthTest),
		});

		// dead particles and alive particles lists
		this._aliveParticles = [];
		this._deadParticles = [];

		// create all particles + set geometry attributes
		const particleCount = options.maxParticles || options.emission.rate * options.particles.lifetime.max;

		const vertices = new Float32Array(particleCount * 3);
		const colors = new Float32Array(particleCount * 3);
		const alphas = new Float32Array(particleCount * 1);
		const sizes = new Float32Array(particleCount * 1);
		const rotations = new Float32Array(particleCount * 1);

		for (let p = 0; p < particleCount; ++p) 
		{
			const index = p * 3;
			vertices[index] = vertices[index + 1] = vertices[index + 2] = 0;
			colors[index] = colors[index + 1] = colors[index + 2] = 1;
			alphas[p] = 1;
			sizes[p] = 1;
			rotations[p] = 0;

			this._deadParticles.push(new Particle(this));
		}

		this._particlesGeometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
		this._particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
		this._particlesGeometry.setAttribute("alpha", new THREE.BufferAttribute(alphas, 1));
		this._particlesGeometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
		this._particlesGeometry.setAttribute("rotation", new THREE.BufferAttribute(rotations, 1));

		this._particlesGeometry.setDrawRange(0, 0);

		// create the particles system
		this._particleSystem = new THREE.Points(this._particlesGeometry, this._material);
		//this._particleSystem.sortParticles = true;
		this.add(this._particleSystem);

		this._emitInterval = 1 / options.emission.rate;
		this._emitTimer = 0;
		this._paused = false;
	}

	dispose()
	{
		this._particlesGeometry.dispose();
		this._material.dispose();
	}

	reset()
	{
		this._emitTimer = 0;
		
		
	}

	play()
	{
		this._paused = false;
	}

	pause()
	{
		this._paused = true;
	}

	setPointSizeFromCanvasScaler(scaler: CanvasScaler)
	{
		this._material.uniforms.baseScale.value = scaler.pixelsPerWorldUnit() * scaler.scale.x;
	}

	setPosition(index: number, pos: THREE.Vector3)
	{
		index *= 3;

		const vertices = this._particlesGeometry.attributes.position.array;
		vertices[index] = pos.x;
		vertices[index + 1] = pos.y;
		vertices[index + 2] = pos.z;

		this._positionDirty = true;
	}

	setColour(index: number, colour: THREE.Vector4)
	{

	}

	setSize(index: number, size: number)
	{
		this._particlesGeometry.attributes.size.array[index] = size;
		this._sizeDirty = true;
	}

	setAlpha(index: number, alpha: number)
	{
		this._particlesGeometry.attributes.alpha.array[index] = alpha;
		this._alphaDirty = true;
	}
	
	setRotation(index: number, angle: number)
	{
		this._particlesGeometry.attributes.rotation.array[index] = angle;
		this._rotateDirty = true;
	}

	spawnParticles(amount: number)
	{
		const toSpawn = Math.min(amount, this._deadParticles.length);
		for (let i = 0; i < toSpawn; ++i)
		{
			const particle = this._deadParticles.pop();
			
			particle.reset();
			this._aliveParticles.push(particle);

			particle.update(this._aliveParticles.length - 1, 0);
		}
	}

	update(dt: number)
	{
		const prevParticleCount = this._aliveParticles.length;

		// update all particles, putting them in the dead pool as required
		for (let i = 0; i < this._aliveParticles.length; ++i)
		{
			const particle = this._aliveParticles[i];

			particle.update(i, dt);

			if (particle.finished)
			{
				this._aliveParticles.splice(i, 1);
				this._deadParticles.push(particle);
				--i;
			}
		}

		// spawn new particles
		if (this._paused == false)
		{
			this._emitTimer += dt;
		}

		while (this._emitTimer >= this._emitInterval)
		{
			this._emitTimer -= this._emitInterval;

			this.spawnParticles(1);

			// TODO: adjust particle age by overshoot on emit time
		}

		// build buffer data from alive particles
		if (prevParticleCount != this._aliveParticles.length)
		{
			this._particlesGeometry.setDrawRange(0, this._aliveParticles.length);
		}

		// set vertices dirty flag
		this._particlesGeometry.attributes.position.needsUpdate = this._positionDirty;
		this._positionDirty = false;
		
		// set colors dirty flag
		this._particlesGeometry.attributes.color.needsUpdate = this._coloursDirty;
		this._coloursDirty = false;
		
		// set alphas dirty flag
		this._particlesGeometry.attributes.alpha.needsUpdate = this._alphaDirty;
		this._alphaDirty = false;

		// set size dirty flag
		this._particlesGeometry.attributes.size.needsUpdate = this._sizeDirty;
		this._sizeDirty = false;

		// set rotation dirty flag
		this._particlesGeometry.attributes.rotation.needsUpdate = this._rotateDirty;
		this._rotateDirty = false;
	}
}