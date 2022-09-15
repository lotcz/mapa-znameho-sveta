import ModelNode from "../../../basic/ModelNode";
import NullableNode from "../../../basic/NullableNode";
import ItemModel from "../../items/ItemModel";
import ModelNodeCollection from "../../../basic/ModelNodeCollection";

export default class InventorySlotModel extends ModelNode {

	/**
	 * @type string
	 */
	name;

	/**
	 * @type NullableNode<ItemModel>
	 */
	item;

	/**
	 * @type ModelNodeCollection<InventorySlotModel>
	 */
	additionalItemsSlots;

	constructor(accepts = [], name = '') {
		super();

		this.name = name;
		this.item = this.addProperty('item', new NullableNode(() => new ItemModel()));

		this.accepts = (type) => {
			if (accepts.includes('all')) return true;
			return accepts.includes(type);
		}

		this.additionalItemsSlots = this.addProperty('additionalItemsSlots', new ModelNodeCollection(null, false));

	}

}
