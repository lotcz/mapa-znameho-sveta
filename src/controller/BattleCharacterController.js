import ControllerNode from "../node/ControllerNode";
import AnimatedVector2 from "../class/animating/AnimatedVector2";
import {CHARACTER_STATE_IDLE, CHARACTER_STATE_RUN} from "../model/BattleCharacterModel";
import AnimatedVector3 from "../class/animating/AnimatedVector3";
import Vector3 from "../node/Vector3";
import * as THREE from "three";
import AnimatedValue from "../class/animating/AnimatedValue";

const TRAVEL_SPEED = 5; // position units per second

export default class BattleCharacterController extends ControllerNode {

	/**
	 * @type BattleCharacterModel
	 */
	model;

	positionAnimation;
	rotationAnimation;

	constructor(game, model) {
		super(game, model);

		this.model = model;

		this.goToHandler = (p) => this.goTo(p);
	}

	activateInternal() {
		this.model.addEventListener('go-to', this.goToHandler);
	}

	deactivateInternal() {
		this.model.removeEventListener('go-to', this.goToHandler);
	}

	updateInternal(delta) {
		if (this.positionAnimation) {
			if (this.positionAnimation.isFinished()) {
				this.removeChild(this.positionAnimation);
				this.positionAnimation = null;
				this.arrived();
			} else {
				this.model.position.set(this.positionAnimation.get(delta));
			}
		}
		if (this.rotationAnimation) {
			if (this.rotationAnimation.isFinished()) {
				this.removeChild(this.rotationAnimation);
				this.rotationAnimation = null;
			} else {
				this.model.rotation.set(0, this.rotationAnimation.get(delta), 0);
			}
		}
	}

	goTo(position) {
		this.model.state.set(CHARACTER_STATE_RUN);
		this.positionAnimation = new AnimatedVector2(this.model.position, position, 1000);

		const v1 = new THREE.Vector2(this.model.position.x, this.model.position.y);
		const v2 = new THREE.Vector2(position.x, position.y);
		const direction = v1.sub(v2);

		const angle = direction.angle() + (Math.PI / 2);// * ((this.model.position.x > position.x) ? -1 : 1);


		//const this.model.position
		console.log(angle);
		//const rotation = new Vector3(0, angle, 0);
		this.rotationAnimation = new AnimatedValue(this.model.rotation.y, -angle, 100);
		//console.log(rotation);
		//this.prevDirection = direction;
	}

	arrived() {
		this.model.state.set(CHARACTER_STATE_IDLE);
		//this.rotationAnimation = new AnimatedValue(this.model.rotation.y, 0, 500);
	}

}
