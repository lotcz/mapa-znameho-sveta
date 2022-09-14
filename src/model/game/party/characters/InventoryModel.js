import ModelNode from "../../../basic/ModelNode";
import InventorySlotModel from "./InventorySlotModel";

export default class InventoryModel extends ModelNode {

	/**
	 * @type InventorySlotModel
	 */
	head;

	/**
	 * @type InventorySlotModel
	 */
	leftHand;

	/**
	 * @type InventorySlotModel
	 */
	rightHand;

	/**
	 * @type InventorySlotModel
	 */
	clothing;

	/**
	 * @type InventorySlotModel
	 */
	slot1;

	/**
	 * @type InventorySlotModel
	 */
	slot2;

	/**
	 * @type InventorySlotModel
	 */
	slot3;

	constructor() {
		super();

		this.head = this.addProperty('head', new InventorySlotModel(['head'], 'head'));
		this.leftHand = this.addProperty('leftHand', new InventorySlotModel(['all'], 'leftHand'));
		this.rightHand = this.addProperty('rightHand', new InventorySlotModel(['all'], 'rightHand'));
		this.clothing = this.addProperty('clothing', new InventorySlotModel(['clothing'], 'clothing'));

		this.slot1 = this.addProperty('slot1', new InventorySlotModel(['all']));
		this.slot2 = this.addProperty('slot2', new InventorySlotModel(['all']));
		this.slot3 = this.addProperty('slot3', new InventorySlotModel(['all']));
	}

}
