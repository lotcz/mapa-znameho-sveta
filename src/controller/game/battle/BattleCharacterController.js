import AnimatedVector2 from "../../../class/animating/AnimatedVector2";
import {CHARACTER_STATE_IDLE, CHARACTER_STATE_RUN} from "../../../model/game/battle/BattleCharacterModel";
import AnimatedRotation from "../../../class/animating/AnimatedRotation";
import Pixies from "../../../class/basic/Pixies";
import ControllerWithBattle from "../../basic/ControllerWithBattle";
import {EASING_FLAT, EASING_QUAD_IN} from "../../../class/animating/ProgressValue";

const RUNNING_SPEED = 3.25 / 1000; // position units per millisecond
const ROTATION_SPEED = (Math.PI * 4) / 1000; // radians per millisecond
const MAX_WALK_DISTANCE = 100;

export default class BattleCharacterController extends ControllerWithBattle {

	/**
	 * @type BattleCharacterModel|BattleNpcCharacterModel
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

		this.addAutoEvent(
			this.model,
			'go-to',
			(p) => {
				this.model.followBattleCharacter.set(null);
				this.goTo(p);
			}
		);

		this.addAutoEvent(
			this.model,
			'talk-to',
			(bc) => this.startFollowing(bc, 3)
		);

		this.addAutoEvent(
			this.model,
			'follow',
			(bc) => {
				this.startFollowing(bc, 99);
				if (this.saveGame.party.battleFollowTheLeader.get()) {
					this.followMe();
				}
			}
		);

		this.addAutoEvent(
			this.model,
			'follow-me',
			() => this.followMe()
		);

		this.addAutoEvent(
			this.model.characterId,
			'change',
			() => {
				const character = this.saveGame.characters.getById(this.model.characterId.get());
				if (!character) {
					console.error('Character not found', this.model.characterId.get());
					return;
				}
				this.model.character.set(character);
			},
			true
		);

	}

	activateInternal() {
		this.model.state.set(CHARACTER_STATE_IDLE);
		this.checkBlocks();
	}

	deactivateInternal() {
		this.positionAnimation = null;
		this.rotationAnimation = null;
	}

	updateInternal(delta) {
		if (this.positionAnimation) {
			this.positionAnimation.addElapsed(delta);
			if (this.positionAnimation.isFinished()) {
				this.positionAnimation = null;
				this.arrived(delta);
			}
			if (this.positionAnimation) {
				this.model.position.set(this.positionAnimation.get());
			}
		}
		if (this.rotationAnimation) {
			if (this.rotationAnimation.isFinished()) {
				this.rotationAnimation = null;
			} else {
				this.model.rotation.set(this.rotationAnimation.get(delta));
			}
		}
		this.model.makeDirty();
	}

	goTo(position) {
		position = position.round();

		const path = this.battle.pathFinder.findPath(this.model.position, position, MAX_WALK_DISTANCE, this.model);
		if (!path) {
			console.log('No path');
			return false;
		}
		if (path.length === 0) {
			console.log('Already there');
			return false;
		}

		this.model.targetPosition.set(position);
		this.pathToGo = path;
		this.startMovement(this.pathToGo.shift());

		return true;
	}

	startMovement(target, delta = 0) {
		this.model.state.set(CHARACTER_STATE_RUN);
		this.model.nextPosition.set(target);
		const distance = this.model.position.distanceTo(target);
		const raceSpeed = this.model.character.get().race.get().runningSpeed.get();
		const runningSpeed = raceSpeed > 0 ? raceSpeed / 1000 : RUNNING_SPEED;
		const time = distance / runningSpeed;
		this.positionAnimation = new AnimatedVector2(this.model.position, target, time, EASING_FLAT, delta);

		const rotation = this.model.position.getRotationFromYAxis(target);
		const diff = this.model.rotation.subtract(rotation.get());
		if (!diff.equalsTo(0)) {
			const duration = Math.abs(diff.get()) / ROTATION_SPEED;
			this.rotationAnimation = new AnimatedRotation(this.model.rotation.get(), rotation.get(), duration, EASING_QUAD_IN);
		}
	}

	arrived(delta) {
		this.model.nextPosition.set(null);

		if (this.pathToGo.length > 0) {
			const next = this.pathToGo.shift();
			if (!this.battle.pathFinder.isBlocked(next, this.model)) {
				this.startMovement(next, delta);
				return;
			} else {
				console.log('changing path');
				if (this.goTo(this.model.targetPosition.get())) return;
			};
		}

		if (this.checkBlocks()) {
			this.model.targetPosition.set(null);
			if (!this.updateFollowing()) {
				this.model.state.set(CHARACTER_STATE_IDLE);
				this.model.position.set(this.model.position.round());
				this.model.triggerEvent('arrived-idle', this.model.position);
			}
		}
	}

	checkBlocks() {
		const blocked = this.battle.pathFinder.isBlocked(this.model.position.round(), this.model);
		if (blocked) {
			console.log('Stepping aside');
			this.stepAside();
		}
		return !blocked;
	}

	stepAside() {
		const free = this.battle.pathFinder.getFreeNeighborPositions(this.model.position.round(), 1, this.model);
		if (free.length > 0) {
			const winner = Pixies.randomElement(free);
			this.startMovement(winner);
		} else {
			console.log('nowhere to step');
		}
	}

	startFollowing(battleCharacter, steps = 1) {
		this.model.followStepsRemaining.set(steps + 1);
		this.model.followBattleCharacter.set(battleCharacter);
		return this.updateFollowing();
	}

	updateFollowing() {
		if (this.model.followBattleCharacter.isSet()) {
			const followed = this.model.followBattleCharacter.get();
			const isMoving = followed.targetPosition.isSet();
			if (!isMoving) {
				const neighbors = this.model.position.round().getNeighborPositions();
				const followedPos = followed.position.round();
				const caught = neighbors.some((n) => n.equalsTo(followedPos));
				if (caught) {
					this.model.triggerEvent('caught-up', followed);
					this.model.state.set(CHARACTER_STATE_IDLE);
					this.model.followStepsRemaining.set(0);
					this.model.followBattleCharacter.set(null);
					return true;
				}
			}
		}

		this.model.followStepsRemaining.increase(-1);
		if (this.model.followStepsRemaining.get() <= 0 || this.model.followBattleCharacter.isEmpty()) {
			this.model.followStepsRemaining.set(0);
			this.model.followBattleCharacter.set(null);
			return false;
		}

		return this.follow();
	}

	follow() {
		const battleCharacter = this.model.followBattleCharacter.get();
		if (!battleCharacter) return false;

		const position = battleCharacter.targetPosition.isSet() ? battleCharacter.targetPosition.get() : battleCharacter.position.round();
		const free = this.battle.pathFinder.getFreeNeighborPositions(position, 1, this.model);
		if (free.length > 0) {
			const closest = this.model.position.getClosest(free);
			return this.goTo(closest);
		}

		return false;
	}

	/**
	 * Makes rest of the party follow this character.
	 */
	followMe() {
		const next = this.saveGame.party.findNextInLine(this.model.characterId.get());
		if (next) {
			const battleCharacter = this.battle.partyCharacters.find((bc) => bc.characterId.equalsTo(next.id.get()));
			if (battleCharacter) {
				this.runAfterTimeout(
					550,
					() => battleCharacter.triggerEvent('follow', this.model)
				);
			}
		}
	}
}
