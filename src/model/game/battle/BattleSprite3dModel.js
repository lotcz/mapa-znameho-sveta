import ModelNode from "../../basic/ModelNode";
import Vector2 from "../../basic/Vector2";
import IntValue from "../../basic/IntValue";
import NullableNode from "../../basic/NullableNode";

export default class BattleSprite3dModel extends ModelNode {

	/**
	 * @type Vector2
	 */
	position;

	/**
	 * @type IntValue
	 */
	sprite3dId;

	/**
	 * @type NullableNode<Sprite3dModel>
	 */
	sprite;

	constructor() {
		super();

		this.position = this.addProperty('position', new Vector2());
		this.sprite3dId = this.addProperty('sprite3dId', new IntValue());
		this.sprite = this.addProperty('sprite', new NullableNode(null, false));
	}

}
