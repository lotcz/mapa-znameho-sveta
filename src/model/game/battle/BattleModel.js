import ModelNode from "../../basic/ModelNode";
import Vector2 from "../../basic/Vector2";
import ModelNodeCollection from "../../basic/ModelNodeCollection";
import NullableNode from "../../basic/NullableNode";
import IntValue from "../../basic/IntValue";
import FloatValue from "../../basic/FloatValue";
import BoolValue from "../../basic/BoolValue";
import BattleItemModel from "./BattleItemModel";
import BattlePartyCharacterModel from "./BattlePartyCharacterModel";
import BattleNpcCharacterModel from "./BattleNpcCharacterModel";

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
	 * @type ModelNodeCollection<BattlePartyCharacterModel>
	 */
	partyCharacters;

	/**
	 * @type ModelNodeCollection<BattleNpcCharacterModel>
	 */
	npcCharacters;

	/**
	 * @type ModelNodeCollection<BattleItemModel>
	 */
	items;

	/**
	 * @type Vector2
	 * current startCoordinates of center of the screen, in px of background image
	 */
	coordinates;

	/**
	 * @type Vector2
	 * current startCoordinates of top left corner, in px of background image
	 */
	cornerCoordinates;

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

	/**
	 * @type BoolValue
	 */
	isHoveringPartyCharacter;

	constructor() {
		super();

		this.battleMapId = this.addProperty('battleMapId', new IntValue());
		this.battleMap = this.addProperty('battleMap', new NullableNode(null, false));

		this.partyCharacters = this.addProperty('partyCharacters', new ModelNodeCollection(() => new BattlePartyCharacterModel()));
		this.npcCharacters = this.addProperty('npcCharacters', new ModelNodeCollection(() => new BattleNpcCharacterModel()));
		this.items = this.addProperty('items', new ModelNodeCollection(() => new BattleItemModel()));

		this.coordinates = this.addProperty('startCoordinates', new Vector2());
		this.cornerCoordinates = this.addProperty('cornerCoordinates', new Vector2());
		this.zoom = this.addProperty('startZoom', new FloatValue(1));

		this.isMouseOver = this.addProperty('isMouseOver', new BoolValue(false, false));
		this.mouseCoordinates = this.addProperty('mouseCoordinates', new Vector2(0, 0, false));
		this.mouseHoveringTile = this.addProperty('mouseHoveringTile', new Vector2(0, 0, false));
		this.isHoveringNoGo = this.addProperty('isHoveringNoGo', new BoolValue(false, false));
		this.isHoveringPartyCharacter = this.addProperty('isHoveringPartyCharacter', new BoolValue(false, false));
	}

}
