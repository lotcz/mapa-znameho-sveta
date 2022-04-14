import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default class AnimationHelper {

	constructor(path) {
		this.path = path;
		this.model = null;
		this.actions = [];
		this.currentAction = null;
		this.speed = 1;
		this.loaded = false;
	}

	async load() {
		const path = this.path;
		const promise = new Promise(function(resolve, reject) {
			const loader = new GLTFLoader();
			loader.load(path, (gltf) => resolve(gltf), null, (err) => reject(err));
		});
		const gltf = await promise;

		this.model = gltf.scene;
		//this.player.scene.add(this.model);

		this.model.traverse( function ( object ) {
			if (object.isMesh) {
				object.castShadow = true;
				object.receiveShadow = true;
				object.frustumCulled = false;
			 }
		});

		const animations = gltf.animations;

		this.mixer = new THREE.AnimationMixer(this.model);

		for (let i = 0; i < animations.length; i++) {
			let animation = animations[i];
			let action = this.mixer.clipAction(animation);
			this.actions[animation.name] = action;
			action.play();
			if (!this.currentAction) {
				this.currentAction = action;
				this.setWeight(this.currentAction, 1);
			} else {
				this.setWeight(action, 0);
			}
		}

		//console.log(this.actions);

		this.loaded = true;
		return this.model;
	}

	update(event) {
		if (this.loaded && this.mixer) {
			this.mixer.update(this.speed * (event.delta / 1000));
		}
	}

	activateAction(name, duration, synchronize) {
		const action = this.actions[name];

		if (this.currentAction === action) {
			this.currentAction.reset();
			return;
		}

		if (synchronize)
			this.synchronizeCrossFade(this.currentAction, action, duration);
		else
			this.executeCrossFade(this.currentAction, action, duration);
	}

	synchronizeCrossFade(startAction, endAction, duration) {
		this.mixer.addEventListener('loop', onLoopFinished );
		const _this = this;
		function onLoopFinished(event) {
			if (event.action === startAction) {
				_this.mixer.removeEventListener('loop', onLoopFinished);
				_this.executeCrossFade(startAction, endAction, duration);
			}
		}
	}

	executeCrossFade(startAction, endAction, duration) {
		//console.log(endAction._clip.name);

		// Not only the start action, but also the end action must get a weight of 1 before fading
		if (startAction) this.setWeight(startAction, 1);

		const durationSecs = duration / 1000;

		if (endAction) {
			this.setWeight(endAction, 1);
			endAction.time = 0;

			if (startAction) {
				// Crossfade with warping
				startAction.crossFadeTo(endAction, durationSecs, true);
			} else {
				endAction.fadeIn(durationSecs);
			}
			this.currentAction = endAction;
		} else if (startAction) {
			startAction.fadeOut(durationSecs);
		}
	}

	// This function is needed, since animationAction.crossFadeTo() disables its start action and sets
	// the start action's timeScale to ((start animation's duration) / (end animation's duration))
	setWeight(action, weight) {
		action.enabled = true;
		action.setEffectiveTimeScale(1);
		action.setEffectiveWeight(weight);
	}

}
