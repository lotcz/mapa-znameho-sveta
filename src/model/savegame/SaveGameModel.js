import ModelNode from "../basic/ModelNode";
import DirtyValue from "../basic/DirtyValue";
import Vector2 from "../basic/Vector2";
import BattleModel from "./battle/BattleModel";
import ModelNodeTable from "../basic/ModelNodeTable";
import CharacterModel from "../resources/characters/CharacterModel";
import NullableNode from "../basic/NullableNode";
import PartyModel from "./party/PartyModel";
import IntValue from "../basic/IntValue";
import FloatValue from "../basic/FloatValue";
import BoolValue from "../basic/BoolValue";

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
	 * @type PartyModel
	 */
	party;

	/**
	 * @type Vector2
	 * current screen position on map
	 */
	coordinates;

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
	 * @type NullableNode
	 */
	battle;

	/**
	 * @type NullableNode
	 */
	conversation;

	constructor() {
		super();

		this.mode = this.addProperty('mode', new DirtyValue(GAME_MODE_MAP));
		this.time = this.addProperty('time', new FloatValue(0));
		this.characters = this.addProperty('characters', new ModelNodeTable((id) => new CharacterModel(id)));
		this.party = this.addProperty('party', new PartyModel());

		this.coordinates = this.addProperty('coordinates', new Vector2());
		this.partyCoordinates = this.addProperty('partyCoordinates', new Vector2());
		this.lastPartyCoordinates = this.addProperty('lastPartyCoordinates', new Vector2());
		this.partyCoordinates.addOnChangeListener((param) => {
			this.lastPartyCoordinates.set(param.oldValue);
		})
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

		this.battle = this.addProperty('battle', new NullableNode(() => new BattleModel()));

		this.conversation = this.addProperty('conversation', new NullableNode());
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
			if (this.partyResting.get()) {
				character.stats.physical.restore(duration);
			} else {
				character.stats.physical.consume(duration);
			}
		})
	}
}
