import ModelNode from "../../../basic/ModelNode";
import Vector2 from "../../../basic/Vector2";
import IntValue from "../../../basic/IntValue";
import NullableNode from "../../../basic/NullableNode";

export default class BattleSpriteModel extends ModelNode {

	/**
	 * @type Vector2
	 */
	position;

	/**
	 * @type IntValue
	 */
	spriteId;

	/**
	 * @type NullableNode<SpriteModel>
	 */
	sprite;

	constructor() {
		super();

		this.position = this.addProperty('position', new Vector2());
		this.spriteId = this.addProperty('spriteId', new IntValue());
		this.sprite = this.addProperty('sprite', new NullableNode(null, false));
	}

}
