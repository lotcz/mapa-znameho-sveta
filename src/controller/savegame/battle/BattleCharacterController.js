import ControllerNode from "../../basic/ControllerNode";
import AnimatedVector2 from "../../../class/animating/AnimatedVector2";
import {CHARACTER_STATE_IDLE, CHARACTER_STATE_RUN} from "../../../model/savegame/battle/BattleCharacterModel";
import AnimatedRotation from "../../../class/animating/AnimatedRotation";
import PathFinder from "../../../class/PathFinder";
import Pixies from "../../../class/basic/Pixies";

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

		this.addAutoEvent(
			this.model.characterId,
			'change',
			() => {
				this.model.character.set(this.game.saveGame.get().characters.getById(this.model.characterId.get()));
			},
			true
		);
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
		this.model.makeDirty();
	}

	isMoving() {
		return (this.positionAnimation !== null);
	}

	getBlocks() {
		return this.game.saveGame.get().battle.get().characters.filter((ch) => ch !== this.model).map((ch) => ch.position);
	}

	goTo(position) {

		const blocks = this.getBlocks();

		if (PathFinder.isTileBlocked(position, blocks)) {
			console.log('Blocked');
			return;
		}

		if (!this.checkBlocks(blocks)) {
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

		const blocks = this.getBlocks();
		if (this.checkBlocks(blocks)) {
			this.model.state.set(CHARACTER_STATE_IDLE);
		}
	}

	checkBlocks(blocks) {
		const blocked = PathFinder.isTileBlocked(this.model.position.round(), blocks);
		if (blocked) {
			console.log('Stepping aside');
			this.stepAside(blocks);
		}
		return !blocked;
	}

	stepAside(blocks) {
		const position = this.model.position.round();
		const candidates = PathFinder.positionNeighbors(position);
		const free = candidates.filter((c) => !PathFinder.isTileBlocked(c, blocks));
		if (free.length > 0) {
			const winner = Pixies.randomElement(free);
			this.startMovement(winner);
		} else {
			console.log('nowhere to step');
		}
	}

}