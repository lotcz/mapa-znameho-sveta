import ModelNode from "../../basic/ModelNode";
import Vector2 from "../../basic/Vector2";
import NullableNode from "../../basic/NullableNode";
import ItemModel from "../items/ItemModel";

export default class BattleItemModel extends ModelNode {

	/**
	 * @type Vector2
	 */
	position;

	/**
	 * @type NullableNode<ItemModel>
	 */
	item;

	constructor() {
		super();

		this.position = this.addProperty('position', new Vector2());
		this.item = this.addProperty('item', new NullableNode(() => new ItemModel()));
	}

}
