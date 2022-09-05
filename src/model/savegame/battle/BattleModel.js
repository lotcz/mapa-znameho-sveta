import ModelNode from "../../basic/ModelNode";
import Vector2 from "../../basic/Vector2";
import ModelNodeCollection from "../../basic/ModelNodeCollection";
import BattleCharacterModel from "./BattleCharacterModel";
import BattleMapModel from "../../resources/map/BattleMapModel";
import DirtyValue from "../../basic/DirtyValue";
import NullableNode from "../../basic/NullableNode";
import IntValue from "../../basic/IntValue";

export default class BattleModel extends ModelNode {

	/**
	 * @type IntValue
	 */
	battleMapId;

	/**
	 * @type BattleMapModel
	 */
	battleMap;

	/**
	 * @type ModelNodeCollection
	 */
	characters;

	/**
	 * @type Vector2
	 * current coordinates of center of the screen, in px of background image
	 */
	coordinates;

	/**
	 * @type DirtyValue
	 * Scale of currently displayed battlemap
	 */
	zoom;

	/**
	 * @type NullableNode
	 *
	 */
	selectedCharacter;

	constructor() {
		super();

		this.battleMapId = this.addProperty('battleMapId', new IntValue());
		this.battleMap = this.addProperty('battleMap', new BattleMapModel());

		this.characters = this.addProperty('characters', new ModelNodeCollection(() => new BattleCharacterModel()));

		this.coordinates = this.addProperty('coordinates', new Vector2(800, 700));
		this.zoom = this.addProperty('zoom', new DirtyValue(1));
		this.selectedCharacter = this.addProperty('selectedCharacter', new NullableNode(() => new BattleCharacterModel()));

	}

}
