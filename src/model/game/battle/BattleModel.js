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
import StringValue from "../../basic/StringValue";
import CachedPathFinder from "../../../class/pathfinder/CachedPathFinder";
import GroundSlotsModel from "../items/GroundSlotsModel";

export const CURSOR_TYPE_DEFAULT = 'default';
export const CURSOR_TYPE_WALK = 'walk';
export const CURSOR_TYPE_EXIT = 'exit';
export const CURSOR_TYPE_TALK = 'talk';
export const CURSOR_TYPE_EYE = 'eye';
export const CURSOR_TYPE_ATTACK = 'attack';
export const CURSOR_TYPE_SWITCH_CHARACTER = 'switch-character';

export const CURSOR_TYPES = [
	CURSOR_TYPE_DEFAULT,
	CURSOR_TYPE_WALK,
	CURSOR_TYPE_EXIT,
	CURSOR_TYPE_TALK,
	CURSOR_TYPE_EYE,
	CURSOR_TYPE_ATTACK,
	CURSOR_TYPE_SWITCH_CHARACTER
];

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
	 * current startCoordinates of the center of the screen, in px of background image
	 */
	coordinates;

	/**
	 * @type Vector2
	 * current startCoordinates of the top left corner, in px of background image
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
	 * @type NullableNode<BattleCharacterModel>
	 */
	hoveringBattleCharacterTile;

	/**
	 * @type NullableNode<BattleCharacterModel>
	 */
	hoveringBattleCharacterRaycast;

	/**
	 * @type NullableNode<BattleCharacterModel|BattleNpcCharacterModel>
	 */
	hoveringBattleCharacter;

	/**
	 * @type NullableNode<BattleSpecialModel>
	 */
	hoveringSpecial;

	/**
	 * @type StringValue
	 */
	cursorType;

	/**
	 * @type Vector2
	 */
	groundPosition;

	/**
	 * @type ModelNodeCollection<ItemSlotModel>
	 */
	groundItems;

	constructor() {
		super();

		this.battleMapId = this.addProperty('battleMapId', new IntValue());
		this.battleMap = this.addProperty('battleMap', new NullableNode(null, false));

		this.partyCharacters = this.addProperty('partyCharacters', new ModelNodeCollection(() => new BattlePartyCharacterModel()));
		this.npcCharacters = this.addProperty('npcCharacters', new ModelNodeCollection(() => new BattleNpcCharacterModel()));
		this.items = this.addProperty('items', new ModelNodeCollection(() => new BattleItemModel()));

		this.coordinates = this.addProperty('coordinates', new Vector2());
		this.cornerCoordinates = this.addProperty('cornerCoordinates', new Vector2());
		this.zoom = this.addProperty('zoom', new FloatValue(1));

		this.isMouseOver = this.addProperty('isMouseOver', new BoolValue(false, false));
		this.mouseCoordinates = this.addProperty('mouseCoordinates', new Vector2(0, 0, false));
		this.mouseHoveringTile = this.addProperty('mouseHoveringTile', new Vector2(0, 0, false));
		this.isHoveringNoGo = this.addProperty('isHoveringNoGo', new BoolValue(false, false));
		this.hoveringBattleCharacterTile = this.addProperty('hoveringBattleCharacterTile', new NullableNode(null, false));
		this.hoveringBattleCharacterTile.addOnChangeListener(() => this.updateHoveringCharacter());
		this.hoveringBattleCharacterRaycast = this.addProperty('hoveringBattleCharacterRaycast', new NullableNode(null, false));
		this.hoveringBattleCharacterRaycast.addOnChangeListener(() => this.updateHoveringCharacter());
		this.hoveringBattleCharacter = this.addProperty('hoveringBattleCharacter', new NullableNode(null, false));
		this.hoveringSpecial = this.addProperty('hoveringSpecial', new NullableNode(null, false));
		this.cursorType = this.addProperty('cursorType', new StringValue(CURSOR_TYPE_DEFAULT, false));

		this.groundPosition = this.addProperty('groundPosition', new Vector2(0, 0, false));
		this.groundSlots = this.addProperty('groundSlots', new GroundSlotsModel());

		this.pathFinder = new CachedPathFinder();

	}

	updateHoveringCharacter() {
		this.hoveringBattleCharacter.set(this.hoveringBattleCharacterRaycast.isSet() ? this.hoveringBattleCharacterRaycast.get() : this.hoveringBattleCharacterTile.get());
	}

}
