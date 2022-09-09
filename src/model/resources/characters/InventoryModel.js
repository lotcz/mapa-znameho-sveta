import ModelNode from "../../basic/ModelNode";
import ModelNodeCollection from "../../basic/ModelNodeCollection";
import InventorySlotModel from "./InventorySlotModel";

export default class InventoryModel extends ModelNode {

	/**
	 * @type ModelNodeCollection<InventorySlotModel>
	 */
	slots;

	constructor() {
		super();

		this.slots = this.addProperty('slots', new ModelNodeCollection(() => new InventorySlotModel()));

		// init
		for (let i = 0, max = 10; i < max; i++) {
			this.slots.add(new InventorySlotModel());
		}
	}

}
