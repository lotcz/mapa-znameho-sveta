import ModelNode from "../basic/ModelNode";
import DirtyValue from "../basic/DirtyValue";
import Vector2 from "../basic/Vector2";
import BattleModel from "../battle/BattleModel";
import ModelNodeTable from "../basic/ModelNodeTable";
import CharacterModel from "../characters/CharacterModel";
import NullableNode from "../basic/NullableNode";
import PartyModel from "./party/PartyModel";

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
	 * @type DirtyValue
	 */
	zoom;

	/**
	 * @type DirtyValue
	 */
	forward;

	/**
	 * @type DirtyValue
	 */
	currentPathId;

	/**
	 * @type DirtyValue
	 */
	pathProgress;

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
		this.zoom = this.addProperty('zoom', new DirtyValue(1));
		this.forward = this.addProperty('forward', new DirtyValue(true));
		this.currentPathId = this.addProperty('currentPathId', new DirtyValue(1));
		this.pathProgress = this.addProperty('pathProgress', new DirtyValue(0));

		this.battle = this.addProperty('battle', new BattleModel());

		this.conversation = this.addProperty('conversation', new NullableNode());
	}

}
