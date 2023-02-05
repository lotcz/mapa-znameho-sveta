import AnimatedVector2 from "../../../class/animating/AnimatedVector2";
import {CHARACTER_STATE_IDLE, CHARACTER_STATE_RUN} from "../../../model/game/battle/BattleCharacterModel";
import AnimatedRotation from "../../../class/animating/AnimatedRotation";
import PathFinder from "../../../class/pathfinder/PathFinder";
import Pixies from "../../../class/basic/Pixies";
import ItemModel from "../../../model/game/items/ItemModel";
import BattleItemSlotController from "./BattleItemSlotController";
import ControllerWithBattle from "../../basic/ControllerWithBattle";
import AbsolutePathFinder from "../../../class/pathfinder/AbsolutePathFinder";

const TRAVEL_SPEED = 3.25 / 1000; // position units per milisecond
const ROTATION_SPEED = (Math.PI * 4) / 1000; // radians per milisecond

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

		this.headGearChangedHandler = () => this.updateHair();

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
			this.model.characterId,
			'change',
			() => {
				if (this.model.character.isSet() && this.model.character.get().id.equalsTo(this.model.characterId.get())) return;

				const character = this.saveGame.characters.getById(this.model.characterId.get());
				if (!character) {
					console.error('Character not found', this.model.characterId.get());
					return;
				}
				this.model.character.set(character);
			},
			true
		);

		this.addAutoEvent(
			this.model.character,
			'change',
			(param) => {
				this.resetChildren();
				const old = param ? param.oldValue : null;
				if (old) {
					old.inventory.head.item.removeOnChangeListener(this.headGearChangedHandler);
				}
				if (this.model.character.isSet()) {
					const character = this.model.character.get();
					character.inventory.head.item.addOnChangeListener(this.headGearChangedHandler);
					this.updateHair();

					// to update additional items
					this.addChild(new BattleItemSlotController(this.game, character.inventory.body));
					this.addChild(new BattleItemSlotController(this.game, character.inventory.hips));
					this.addChild(new BattleItemSlotController(this.game, character.inventory.feet));
				}
			},
			true
		);

	}

	activateInternal() {
		this.model.state.set(CHARACTER_STATE_IDLE);
		this.checkBlocks(this.getBlocks());
	}

	deactivateInternal() {
		this.resetChildren();

		const character = this.model.character.get();
		if (character) character.inventory.head.item.removeOnChangeListener(this.headGearChangedHandler);

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
		const partyCharacters = this.battle.partyCharacters.filter((ch) => ch !== this.model).map((ch) => ch.position.round());
		const npcCharacters = this.battle.npcCharacters.filter((ch) => ch !== this.model).map((ch) => ch.position.round());
		const mapBlocks = this.battleMap.getBlocks();
		return mapBlocks.concat(partyCharacters).concat(npcCharacters);
	}

	goTo(position) {

		const blocks = this.getBlocks();

		if (PathFinder.isTileBlocked(position, blocks)) {
			console.log('Blocked');
			return false;
		}

		//const path = PathFinder.findBestPath(this.model.position.round(), position.round(), blocks);
		const absolutePathFinder = new AbsolutePathFinder(this.model.position, position, blocks);
		const path = absolutePathFinder.findPath();
		if (!path) {
			console.log('No path');
			return false;
		}

		//console.log(path);
		this.model.targetPosition.set(position.clone());

		this.pathToGo = path;
		this.startMovement(this.pathToGo.shift());

		return true;
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
		//this.model.triggerEvent('arrived', this.model.position);

		if (this.pathToGo.length > 0) {
			this.startMovement(this.pathToGo.shift());
			return;
		}

		const blocks = this.getBlocks();
		if (this.checkBlocks(blocks)) {
			this.model.state.set(CHARACTER_STATE_IDLE);
			this.model.targetPosition.set(null);
			if (!this.updateFollowing()) {
				this.model.triggerEvent('arrived-idle', this.model.position);
			}
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
		const candidates = PathFinder.getNeighborPositions(position);
		const free = candidates.filter((c) => !PathFinder.isTileBlocked(c, blocks));
		if (free.length > 0) {
			const winner = Pixies.randomElement(free);
			this.startMovement(winner);
		} else {
			console.log('nowhere to step');
		}
	}

	updateHair() {
		const character = this.model.character.get();
		if (character.inventory.head.item.isEmpty() && character.hairItemDefinitionId.get() > 0) {
			const item = new ItemModel();
			item.definitionId.set(character.hairItemDefinitionId.get());
			item.primaryMaterialId.set(character.hairMaterialId.get());
			character.hairSlot.item.set(item);
		} else {
			character.hairSlot.item.set(null);
		}
	}

	startFollowing(battleCharacter, steps = 1) {
		this.model.followStepsRemaining.set(steps + 1);
		this.model.followBattleCharacter.set(battleCharacter);
		return this.updateFollowing();
	}

	follow() {
		const battleCharacter = this.model.followBattleCharacter.get();
		if (!battleCharacter) return false;

		const free = PathFinder.getFreeNeighborPositions(battleCharacter.position, this.getBlocks());
		if (free.length > 0) {
			const closest = PathFinder.findClosest(this.model.position, free);
			return this.goTo(closest);
		}

		return false;
	}

	updateFollowing() {
		if (this.model.followBattleCharacter.isSet()) {
			const followed = this.model.followBattleCharacter.get();
			const neighbors = PathFinder.getNeighborPositions(this.model.position);
			const caught = neighbors.some((n) => n.equalsTo(followed.position.round()));
			if (caught) {
				this.model.triggerEvent('caught-up', followed);
				this.model.followStepsRemaining.set(0);
				this.model.followBattleCharacter.set(null);
				return true;
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
}
