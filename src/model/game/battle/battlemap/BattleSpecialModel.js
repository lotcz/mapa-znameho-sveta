import ModelNode from "../../../basic/ModelNode";
import Vector2 from "../../../basic/Vector2";
import DirtyValue from "../../../basic/DirtyValue";
import StringValue from "../../../basic/StringValue";

export const SPECIAL_TYPE_BLOCK = 'block';
export const SPECIAL_TYPE_EXIT = 'exit';
export const SPECIAL_TYPE_SPAWN = 'spawn';
export const SPECIAL_TYPE_SEQUENCE = 'seq';
export const SPECIAL_TYPE_CONVERSATION_LOC = 'c-loc';
export const SPECIAL_TYPE_CONVERSATION_EYE = 'c-eye';

export const SPECIAL_TYPES = [
	SPECIAL_TYPE_BLOCK,
	SPECIAL_TYPE_EXIT,
	SPECIAL_TYPE_SPAWN,
	SPECIAL_TYPE_SEQUENCE,
	SPECIAL_TYPE_CONVERSATION_LOC,
	SPECIAL_TYPE_CONVERSATION_EYE
];

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
	 * @type StringValue
	 */
	data;

	constructor() {
		super();

		this.type = this.addProperty('type', new DirtyValue(SPECIAL_TYPE_BLOCK));
		this.position = this.addProperty('position', new Vector2());
		this.data = this.addProperty('data', new StringValue());
	}

	getResourcesForPreload() {
		if (this.type.equalsTo(SPECIAL_TYPE_CONVERSATION_LOC)) {
			return [`con/${this.data.get()}`];
		}
		return [];
	}

}
