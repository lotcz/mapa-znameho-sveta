import ControllerNode from "./basic/ControllerNode";
import AnimatedVector2 from "../class/animating/AnimatedVector2";
import {CHARACTER_STATE_IDLE, CHARACTER_STATE_RUN} from "../model/battle/BattleCharacterModel";
import AnimatedRotation from "../class/animating/AnimatedRotation";
import PathFinder from "../class/PathFinder";

const TRAVEL_SPEED = 3.25 / 1000; // position units per milisecond
const ROTATION_SPEED = (Math.PI * 4) / 1000; // radians per milisecond

export default class BattleCharacterController extends ControllerNode {

	/**
	 * @type BattleCharacterModel
	 */
	model;

	positionAnimation;
	rotationAnimation;

	/**
	 * @type array
	 */
	pathToGo;

	constructor(game, model) {
		super(game, model);

		this.model = model;
		this.pathToGo = [];

		this.positionAnimation = null;
		this.rotationAnimation = null;

		this.goToHandler = (p) => this.goTo(p);
	}

	activateInternal() {
		this.model.addEventListener('go-to', this.goToHandler);
	}

	deactivateInternal() {
		this.model.removeEventListener('go-to', this.goToHandler);
		this.positionAnimation = null;
		this.rotationAnimation = null;
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

	isMoving() {
		return (this.positionAnimation !== null);
	}

	goTo(position) {
		const blocks = this.game.saveGame.battle.characters.filter((ch) => ch !== this.model).map((ch) => ch.position);
		if (PathFinder.isTileBlocked(this.model.position.round(), blocks)) {
			console.log('Blocked');
			return;
		}

		const path = PathFinder.findBestPath(this.model.position.round(), position.round(), blocks);
		if (!path) {
			console.log('No path');
			return;
		}

		console.log(path);

		this.pathToGo = path;

		this.startMovement(this.pathToGo.shift());

	}

	startMovement(target) {
		this.model.state.set(CHARACTER_STATE_RUN);
		const distance = this.model.position.distanceTo(target);
		const time = distance / TRAVEL_SPEED;
		this.positionAnimation = new AnimatedVector2(this.model.position, target, time);

		const rotation = this.model.position.getRotationFromYAxis(target);
		const diff = this.model.rotation.subtract(rotation.get());
		const duration = Math.abs(diff.get()) / ROTATION_SPEED;
		this.rotationAnimation = new AnimatedRotation(this.model.rotation.get(), rotation.get(), duration);
	}

	arrived() {
		if (this.pathToGo.length > 0) {
			this.startMovement(this.pathToGo.shift());
			return;
		}

		this.model.state.set(CHARACTER_STATE_IDLE);
	}

}
