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
				this.model.rotation.set(this.rotationAnimation.get(delta));
			}
		}
	}

	goTo(position) {
		this.model.state.set(CHARACTER_STATE_RUN);
		this.positionAnimation = new AnimatedVector2(this.model.position, position, 1000);

		const rotation = this.model.position.getRotationFromYAxis(position);
		console.log(rotation.getDegrees());
		this.rotationAnimation = new AnimatedValue(this.model.rotation.get(), rotation.get(), 100);

	}

	arrived() {
		this.model.state.set(CHARACTER_STATE_IDLE);
		//this.rotationAnimation = new AnimatedValue(this.model.rotation.y, 0, 500);
	}

}
