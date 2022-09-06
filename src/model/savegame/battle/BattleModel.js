import ModelNode from "../../basic/ModelNode";
import Vector2 from "../../basic/Vector2";
import ModelNodeCollection from "../../basic/ModelNodeCollection";
import BattleCharacterModel from "./BattleCharacterModel";
import BattleMapModel from "../../resources/map/BattleMapModel";
import NullableNode from "../../basic/NullableNode";
import IntValue from "../../basic/IntValue";
import FloatValue from "../../basic/FloatValue";
import BoolValue from "../../basic/BoolValue";

export default class BattleModel extends ModelNode {

	/**
	 * @type IntValue
	 */
	battleMapId;

	/**
	 * @type NullableNode<BattleMapModel>
	 */
	battleMap;

	/**
	 * @type ModelNodeCollection<BattleCharacterModel>
	 */
	characters;

	/**
	 * @type Vector2
	 * current coordinates of center of the screen, in px of background image
	 */
	coordinates;

	/**
	 * @type FloatValue
	 * Scale of currently displayed battlemap
	 */
	zoom;

	/**
	 * @type BoolValue
	 */
	isMouseOver;

	constructor() {
		super();

		this.battleMapId = this.addProperty('battleMapId', new IntValue());
		this.battleMap = this.addProperty('battleMap', new NullableNode(null, false));

		this.characters = this.addProperty('characters', new ModelNodeCollection(() => new BattleCharacterModel()));

		this.coordinates = this.addProperty('coordinates', new Vector2(800, 700));
		this.zoom = this.addProperty('zoom', new FloatValue(1));

		this.isMouseOver = this.addProperty('isMouseOver', new BoolValue(false, false));
	}

}
