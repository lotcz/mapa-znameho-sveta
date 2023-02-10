import Vector2 from "../../../basic/Vector2";
import IntValue from "../../../basic/IntValue";
import NullableNode from "../../../basic/NullableNode";
import ModelNodeWithResources from "../../../basic/ModelNodeWithResources";

export default class BattleSpriteModel extends ModelNodeWithResources {

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

	constructor(resources) {
		super(resources);

		this.position = this.addProperty('position', new Vector2());
		this.spriteId = this.addProperty('spriteId', new IntValue());
		this.sprite = this.addProperty('sprite', new NullableNode(null, false));

		this.spriteId.addOnChangeListener(() => this.sprite.set(this.resources.sprites.getById(this.spriteId.get())),true);
	}

}
