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
	body;

	/**
	 * @type InventorySlotModel
	 */
	hips;

	/**
	 * @type InventorySlotModel
	 */
	feet;

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

		this.body = this.addProperty('body', new InventorySlotModel(['body'], 'body'));
		this.hips = this.addProperty('hips', new InventorySlotModel(['hips'], 'hips'));
		this.feet = this.addProperty('feet', new InventorySlotModel(['feet'], 'feet'));

		this.slot1 = this.addProperty('slot1', new InventorySlotModel(['all']));
		this.slot2 = this.addProperty('slot2', new InventorySlotModel(['all']));
		this.slot3 = this.addProperty('slot3', new InventorySlotModel(['all']));

		const all = [this.head, this.leftHand, this.rightHand, this.body, this.hips, this.feet];
		all.forEach((slot) => {
			slot.addEventListener('item-changed', () => this.triggerEvent('item-changed'));
		});
	}

}
