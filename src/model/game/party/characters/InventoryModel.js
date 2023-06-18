import ModelNode from "../../../basic/ModelNode";
import ItemSlotModel from "../../items/ItemSlotModel";

export default class InventoryModel extends ModelNode {

	/**
	 * @type ItemSlotModel
	 */
	head;

	/**
	 * @type ItemSlotModel
	 */
	leftHand;

	/**
	 * @type ItemSlotModel
	 */
	rightHand;

	/**
	 * @type ItemSlotModel
	 */
	body;

	/**
	 * @type ItemSlotModel
	 */
	hips;

	/**
	 * @type ItemSlotModel
	 */
	feet;

	/**
	 * @type ItemSlotModel
	 */
	slot1;

	/**
	 * @type ItemSlotModel
	 */
	slot2;

	/**
	 * @type ItemSlotModel
	 */
	slot3;

	constructor() {
		super();

		this.head = this.addProperty('head', new ItemSlotModel(['head'], 'head'));
		this.leftHand = this.addProperty('leftHand', new ItemSlotModel(['all'], 'leftHand'));
		this.rightHand = this.addProperty('rightHand', new ItemSlotModel(['all'], 'rightHand'));

		this.body = this.addProperty('body', new ItemSlotModel(['body'], 'body'));
		this.hips = this.addProperty('hips', new ItemSlotModel(['hips'], 'hips'));
		this.feet = this.addProperty('feet', new ItemSlotModel(['feet'], 'feet'));

		this.slot1 = this.addProperty('slot1', new ItemSlotModel(['all']));
		this.slot2 = this.addProperty('slot2', new ItemSlotModel(['all']));
		this.slot3 = this.addProperty('slot3', new ItemSlotModel(['all']));

		this.bodySlots = [this.head, this.leftHand, this.rightHand, this.body, this.hips, this.feet];
		this.bodySlots.forEach((slot) => {
			slot.addEventListener('item-changed', () => this.triggerEvent('item-changed'));
		});

		this.allSlots = [this.slot1, this.slot2, this.slot3, this.head, this.leftHand, this.rightHand, this.body, this.hips, this.feet];
	}

	findFreeSlot(accepts = null) {
		return this.allSlots.find((slot) => slot.item.isEmpty() && (accepts === null || slot.accepts(accepts)));
	}

	findItem(itemDefId) {
		const slot = this.allSlots.find((slot) => slot.item.isSet() && slot.item.get().definitionId.equalsTo(itemDefId));
		if (slot) return slot.item.get();
		return null;
	}

	hasItem(itemDefId) {
		return this.findItem(itemDefId) !== null;
	}

}
