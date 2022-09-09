import ModelNode from "../../basic/ModelNode";
import NullableNode from "../../basic/NullableNode";
import ItemModel from "../items/ItemModel";

export default class InventorySlotModel extends ModelNode {

	/**
	 * @type NullableNode<ItemModel>
	 */
	item;

	constructor() {
		super();

		this.item = this.addProperty('item', new NullableNode(() => new ItemModel()));

	}

}
