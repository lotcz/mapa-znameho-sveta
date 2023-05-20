import ModelNode from "../../basic/ModelNode";
import NullableNode from "../../basic/NullableNode";
import ItemModel from "./ItemModel";
import ModelNodeCollection from "../../basic/ModelNodeCollection";

export default class ItemSlotModel extends ModelNode {

	/**
	 * @type string
	 */
	name;

	/**
	 * @type NullableNode<ItemModel>
	 */
	item;

	/**
	 * @type ModelNodeCollection<ItemSlotModel>
	 */
	additionalItemsSlots;

	constructor(acceptsTypes = [], name = '', persistent = true) {
		super(persistent);

		this.acceptsTypes = acceptsTypes
		this.name = name;

		this.item = this.addProperty('item', new NullableNode(() => new ItemModel()));
		this.item.addOnChangeListener((param) => this.triggerEvent('item-changed', param));

		this.additionalItemsSlots = this.addProperty('additionalItemsSlots', new ModelNodeCollection(null, false));
	}

	accepts(type) {
		if (this.acceptsTypes.includes('all')) return true;
		return this.acceptsTypes.includes(type);
	}

}
