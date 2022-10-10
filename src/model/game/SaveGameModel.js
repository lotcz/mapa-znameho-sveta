import ModelNode from "../basic/ModelNode";
import DirtyValue from "../basic/DirtyValue";
import Vector2 from "../basic/Vector2";
import BattleModel from "./battle/BattleModel";
import ModelNodeTable from "../basic/ModelNodeTable";
import CharacterModel from "./party/characters/CharacterModel";
import NullableNode from "../basic/NullableNode";
import PartyModel from "./party/PartyModel";
import IntValue from "../basic/IntValue";
import FloatValue from "../basic/FloatValue";
import BoolValue from "../basic/BoolValue";
import ModelNodeCollection from "../basic/ModelNodeCollection";

export const GAME_MODE_MAP = 'map';
export const GAME_MODE_BATTLE = 'battle';

export default class SaveGameModel extends ModelNode {

	/**
	 * @type DirtyValue
	 */
	mode;

	/**
	 * @type FloatValue
	 */
	time;

	/**
	 * @type ModelNodeTable
	 */
	characters;

	/**
	 * @type ModelNodeCollection<BattleModel>
	 */
	battles;

	/**
	 * @type PartyModel
	 */
	party;

	/**
	 * @type Vector2
	 */
	mapCenterCoordinates;

	/**
	 * @type Vector2
	 */
	mapCornerCoordinates;

	/**
	 * @type Vector2
	 */
	partyCoordinates;

	/**
	 * @type Vector2
	 */
	lastPartyCoordinates;

	/**
	 * @type FloatValue
	 */
	zoom;

	/**
	 * @type IntValue
	 */
	currentPathId;

	/**
	 * @type NullableNode
	 */
	currentPath;

	/**
	 * @type FloatValue
	 */
	pathProgress;

	/**
	 * @type BoolValue
	 */
	forward;

	/**
	 * @type BoolValue
	 */
	partyTraveling;

	/**
	 * @type FloatValue
	 */
	partyResting;

	/**
	 * @type IntValue
	 */
	currentLocationId;

	/**
	 * @type NullableNode
	 */
	currentLocation;

	/**
	 * @type IntValue
	 */
	currentBattleMapId;

	/**
	 * @type NullableNode<BattleModel>
	 */
	currentBattle;

	/**
	 * @type NullableNode
	 */
	conversation;

	/**
	 * @type NullableNode<InventorySlotModel>
	 */
	selectedInventorySlot;

	constructor() {
		super();

		this.mode = this.addProperty('mode', new DirtyValue(GAME_MODE_MAP));
		this.time = this.addProperty('time', new FloatValue(0));
		this.characters = this.addProperty('characters', new ModelNodeTable((id) => new CharacterModel(id)));
		this.battles = this.addProperty('battles', new ModelNodeCollection(() => new BattleModel()));
		this.currentBattleMapId = this.addProperty('currentBattleMapId', new IntValue());
		this.currentBattle = this.addProperty('currentBattle', new NullableNode(null, false));
		this.currentBattleMapId.addOnChangeListener(
			() => {
				const battle = this.battles.find((b) => b.battleMapId.equalsTo(this.currentBattleMapId));
				if (!battle) {
					console.log('Battle map not found');
					this.currentBattle.set(null);
					return;
				}
				this.currentBattle.set(battle);
			}
		);

		this.party = this.addProperty('party', new PartyModel());

		this.mapCenterCoordinates = this.addProperty('mapCenterCoordinates', new Vector2());
		this.mapCornerCoordinates = this.addProperty('mapCornerCoordinates', new Vector2());

		this.partyCoordinates = this.addProperty('partyCoordinates', new Vector2());
		this.lastPartyCoordinates = this.addProperty('lastPartyCoordinates', new Vector2());
		this.partyCoordinates.addOnChangeListener((param) => {
			this.lastPartyCoordinates.set(param.oldValue);
		});
		this.zoom = this.addProperty('zoom', new FloatValue(1));

		this.pathProgress = this.addProperty('pathProgress', new FloatValue(0));
		this.forward = this.addProperty('forward', new BoolValue(true));
		this.partyTraveling = this.addProperty('partyTraveling', new BoolValue(false, false));
		this.partyResting = this.addProperty('partyResting', new FloatValue(0, false));

		this.currentPathId = this.addProperty('currentPathId', new IntValue());
		this.currentPath = this.addProperty('currentPath', new NullableNode(null, false));
		this.currentPath.addOnChangeListener((param) => {
			if (param.oldValue) {
				param.oldValue.isCurrentPath.set(false);
			}
			if (param.newValue) {
				param.newValue.isCurrentPath.set(true);
				param.newValue.pathProgress.set(this.pathProgress.get());
			}
		});

		this.currentLocationId = this.addProperty('currentLocationId', new IntValue());
		this.currentLocation = this.addProperty('currentLocation', new NullableNode(null, false));

		this.conversation = this.addProperty('conversation', new NullableNode());

		this.selectedInventorySlot = this.addProperty('selectedInventorySlot', new NullableNode(null, false));
	}

	passTime(duration) {
		let time = this.time.get() + duration;
		if (time > 1) {
			time = time - 1;
		}
		this.time.set(time);

		this.party.slots.forEach((slot) => {
			let character = slot.character.get();
			if (!character) {
				character = this.characters.getById(slot.characterId.get());
			}
			if (this.partyResting.get() > 0) {
				character.stats.stamina.restore(duration * 5);
				character.stats.health.restore(duration);
				character.stats.hunger.consume(duration * 0.25);
				character.stats.thirst.consume(duration * 0.25);
			} else {
				character.stats.stamina.consume(duration * 5);
				character.stats.hunger.consume(duration);
				character.stats.thirst.consume(duration * 1.5);

			}
		})
	}
}
