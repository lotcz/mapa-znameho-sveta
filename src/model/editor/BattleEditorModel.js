import ModelNode from "../basic/ModelNode";
import NullableNode from "../basic/NullableNode";
import IntValue from "../basic/IntValue";
import DirtyValue from "../basic/DirtyValue";
import {SPECIAL_TYPE_BLOCK} from "../game/battle/battlemap/BattleSpecialModel";
import BoolValue from "../basic/BoolValue";

export const MODE_TYPE_SPRITE = 'sprite';
export const MODE_TYPE_3D = '3d';
export const MODE_TYPE_SPECIAL = 'spec';
export const MODE_TYPE_NPC = 'npc';

export const MODE_TYPES = [
	MODE_TYPE_SPRITE,
	MODE_TYPE_3D,
	MODE_TYPE_SPECIAL,
	MODE_TYPE_NPC
];

export const MODE_ACTION_SELECT = 'select';
export const MODE_ACTION_ADD = 'add';
export const MODE_ACTION_DELETE = 'd3l3t3';

export const MODE_ACTIONS = [
	MODE_ACTION_SELECT,
	MODE_ACTION_ADD,
	MODE_ACTION_DELETE
];

export default class BattleEditorModel extends ModelNode {

	/**
	 * @type BoolValue
	 */
	showHelpers;

	/**
	 * @type DirtyValue
	 */
	modeType;

	/**
	 * @type DirtyValue
	 */
	modeAction;

	/**
	 * @type BattleModel
	 */
	battle;

	/**
	 * @type NullableNode<BattleSpriteModel>
	 */
	activeBattleSprite;

	/**
	 * @type IntValue
	 */
	spriteId;

	/**
	 * @type IntValue
	 */
	sprite3dId;

	/**
	 * @type IntValue
	 */
	characterTemplateId;

	/**
	 * @type DirtyValue
	 */
	specialType;

	/**
	 * @type IntValue
	 */
	brushSize;

	/**
	 * @type NullableNode<BattleSpecialModel>
	 */
	selectedSpecial;

	constructor() {
		super();

		this.showHelpers = this.addProperty('showHelpers', new BoolValue(false));
		this.modeType = this.addProperty('modeType', new DirtyValue(MODE_TYPE_SPRITE));
		this.modeAction = this.addProperty('modeAction', new DirtyValue(MODE_ACTION_SELECT));

		this.activeBattleSprite = this.addProperty('activeBattleSprite', new NullableNode());
		this.spriteId = this.addProperty('spriteId', new IntValue());
		this.sprite3dId = this.addProperty('sprite3dId', new IntValue());
		this.characterTemplateId = this.addProperty('characterTemplateId', new IntValue());

		this.specialType = this.addProperty('specialType', new DirtyValue(SPECIAL_TYPE_BLOCK));

		this.brushSize = this.addProperty('brushSize', new IntValue(0));

		this.selectedSpecial = this.addProperty('selectedSpecial', new NullableNode());
	}

}
