import ModelNode from "../../../basic/ModelNode";
import NullableNode from "../../../basic/NullableNode";
import ItemModel from "../../items/ItemModel";

export default class InventorySlotModel extends ModelNode {

	/**
	 * @type NullableNode<ItemModel>
	 */
	item;

	/**
	 * @type string
	 */
	name;

	constructor(accepts = [], name = '') {
		super();

		this.name = name;
		this.item = this.addProperty('item', new NullableNode(() => new ItemModel()));

		this.accepts = (type) => {
			if (accepts.includes('all')) return true;
			return accepts.includes(type);
		}
	}

}
