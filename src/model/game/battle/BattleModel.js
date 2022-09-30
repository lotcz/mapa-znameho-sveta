import ModelNode from "../../basic/ModelNode";
import Vector2 from "../../basic/Vector2";
import ModelNodeCollection from "../../basic/ModelNodeCollection";
import BattleCharacterModel from "./BattleCharacterModel";
import NullableNode from "../../basic/NullableNode";
import IntValue from "../../basic/IntValue";
import FloatValue from "../../basic/FloatValue";
import BoolValue from "../../basic/BoolValue";
import BattleItemModel from "./BattleItemModel";

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
	 * @type ModelNodeCollection<BattleItemModel>
	 */
	items;

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

	/**
	 * @type Vector2
	 */
	mouseCoordinates;

	/**
	 * @type Vector2
	 */
	mouseHoveringTile;

	/**
	 * @type BoolValue
	 */
	isHoveringNoGo;

	constructor() {
		super();

		this.battleMapId = this.addProperty('battleMapId', new IntValue());
		this.battleMap = this.addProperty('battleMap', new NullableNode(null, false));

		this.characters = this.addProperty('characters', new ModelNodeCollection(() => new BattleCharacterModel()));
		this.items = this.addProperty('items', new ModelNodeCollection(() => new BattleItemModel()));

		this.coordinates = this.addProperty('coordinates', new Vector2(800, 700));
		this.zoom = this.addProperty('zoom', new FloatValue(1));

		this.isMouseOver = this.addProperty('isMouseOver', new BoolValue(false, false));
		this.mouseCoordinates = this.addProperty('mouseCoordinates', new Vector2(0, 0, false));
		this.mouseHoveringTile = this.addProperty('mouseHoveringTile', new Vector2(0, 0, false));
		this.isHoveringNoGo = this.addProperty('isHoveringNoGo', new BoolValue(false, false));
	}

}
