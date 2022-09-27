import ModelNode from "../../basic/ModelNode";
import Vector2 from "../../basic/Vector2";
import DirtyValue from "../../basic/DirtyValue";

export const SPECIAL_TYPE_BLOCK = 'block';
export const SPECIAL_TYPE_EXIT = 'exit';
export const SPECIAL_TYPE_SPAWN = 'spawn';

export const SPECIAL_TYPES = [
	SPECIAL_TYPE_BLOCK,
	SPECIAL_TYPE_EXIT,
	SPECIAL_TYPE_SPAWN
]

export default class BattleSpecialModel extends ModelNode {

	/**
	 * @type DirtyValue
	 */
	type;

	/**
	 * @type Vector2
	 */
	position;

	/**
	 * @type DirtyValue
	 */
	data;

	constructor() {
		super();

		this.type = this.addProperty('type', new DirtyValue(SPECIAL_TYPE_BLOCK));
		this.position = this.addProperty('position', new Vector2());
		this.data = this.addProperty('data', new DirtyValue(''));
	}

}