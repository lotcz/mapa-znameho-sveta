import ModelNode from "../../basic/ModelNode";
import Vector2 from "../../basic/Vector2";
import IntValue from "../../basic/IntValue";

export default class BattleSpriteModel extends ModelNode {

	/**
	 * @type Vector2
	 */
	position;

	/**
	 * @type IntValue
	 */
	spriteId;

	constructor() {
		super();

		this.position = this.addProperty('position', new Vector2(0, 0));
		this.spriteId = this.addProperty('spriteId', new IntValue());
	}

}
