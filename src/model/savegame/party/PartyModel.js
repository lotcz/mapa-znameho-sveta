import ModelNode from "../../basic/ModelNode";
import ModelNodeCollection from "../../basic/ModelNodeCollection";
import PartySlotModel from "./PartySlotModel";

export default class PartyModel extends ModelNode {

	/**
	 * @type ModelNodeCollection
	 */
	slots;

	constructor() {
		super();

		this.slots = this.addProperty('slots', new ModelNodeCollection(() => new PartySlotModel()));
	}

}
