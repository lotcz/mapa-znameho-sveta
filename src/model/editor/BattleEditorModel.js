import ModelNode from "../basic/ModelNode";
import NullableNode from "../basic/NullableNode";
import IntValue from "../basic/IntValue";
import DirtyValue from "../basic/DirtyValue";

export const MODE_TYPE_SPRITE = 'sprite';
export const MODE_TYPE_3D = '3d';
export const MODE_TYPE_SPECIAL = 'special';

export const MODE_ACTION_SELECT = 'select';
export const MODE_ACTION_ADD = 'add';
export const MODE_ACTION_DELETE = 'd3l3t3';

export const MODE_ACTIONS = [
	MODE_ACTION_SELECT,
	MODE_ACTION_ADD,
	MODE_ACTION_DELETE
];

export const MODE_TYPES = [
	MODE_TYPE_SPRITE,
	MODE_TYPE_3D,
	MODE_TYPE_SPECIAL
];

export default class BattleEditorModel extends ModelNode {

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

	constructor(battle) {
		super();

		this.modeType = this.addProperty('modeType', new DirtyValue(MODE_TYPE_SPRITE));
		this.modeAction = this.addProperty('modeAction', new DirtyValue(MODE_ACTION_SELECT));

		this.battle = this.addProperty('battle', battle);
		this.activeBattleSprite = this.addProperty('activeBattleSprite', new NullableNode());
		this.spriteId = this.addProperty('spriteId', new IntValue());

	}

}
