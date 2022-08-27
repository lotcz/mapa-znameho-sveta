import ModelNode from "../basic/ModelNode";
import DirtyValue from "../basic/DirtyValue";
import Vector2 from "../basic/Vector2";
import BattleModel from "./battle/BattleModel";
import ModelNodeTable from "../basic/ModelNodeTable";
import CharacterModel from "../characters/CharacterModel";
import NullableNode from "../basic/NullableNode";
import PartyModel from "./party/PartyModel";
import IntValue from "../basic/IntValue";

export const GAME_MODE_MAP = 'map';
export const GAME_MODE_BATTLE = 'battle';

export default class SaveGameModel extends ModelNode {

	/**
	 * @type DirtyValue
	 */
	mode;

	/**
	 * @type ModelNodeTable
	 */
	characters;

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
	 * @type DirtyValue
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
	 * @type DirtyValue
	 */
	pathProgress;

	/**
	 * @type DirtyValue
	 */
	forward;

	/**
	 * @type DirtyValue
	 */
	partyTraveling;

	/**
	 * @type IntValue
	 */
	currentLocationId;

	/**
	 * @type NullableNode
	 */
	currentLocation;

	/**
	 * @type BattleModel
	 */
	battle;

	/**
	 * @type NullableNode
	 */
	conversation;

	/**
	 * @type PartyModel
	 */
	party;

	constructor() {
		super();

		this.mode = this.addProperty('mode', new DirtyValue(GAME_MODE_MAP));
		this.characters = this.addProperty('characters', new ModelNodeTable((id) => new CharacterModel(id)));
		this.party = this.addProperty('party', new PartyModel());

		this.coordinates = this.addProperty('coordinates', new Vector2());
		this.partyCoordinates = this.addProperty('partyCoordinates', new Vector2());
		this.lastPartyCoordinates = this.addProperty('lastPartyCoordinates', new Vector2());
		this.partyCoordinates.addOnChangeListener((param) => {
			this.lastPartyCoordinates.set(param.oldValue);
		})
		this.zoom = this.addProperty('zoom', new DirtyValue(1));

		this.pathProgress = this.addProperty('pathProgress', new DirtyValue(0));
		this.forward = this.addProperty('forward', new DirtyValue(true));
		this.partyTraveling = this.addProperty('partyTraveling', new DirtyValue(false, false));

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

		this.battle = this.addProperty('battle', new BattleModel());

		this.conversation = this.addProperty('conversation', new NullableNode());
	}

}
