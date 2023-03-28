import ModelNode from "../../basic/ModelNode";
import ModelNodeCollection from "../../basic/ModelNodeCollection";
import ItemSlotModel from "./ItemSlotModel";

const SLOTS_PER_ROW = 4;

export default class GroundSlotsModel extends ModelNode {

	/**
	 * @type ModelNodeCollection<ItemSlotModel>
	 */
	slots;

	constructor(slotType = 'ground', persistent = false) {
		super(persistent);

		this.slotType = slotType;

		this.slots = this.addProperty('slots', new ModelNodeCollection(null, false));
		const itemAddedHandler = () => this.updateSlots();
		this.slots.addOnAddListener((slot) => slot.item.addOnChangeListener(itemAddedHandler));
		this.slots.addOnRemoveListener((slot) => slot.item.removeOnChangeListener(itemAddedHandler));

		this.reset();
	}

	reset() {
		this.slots.reset();
		this.updateSlots();
	}

	updateSlots() {
		this.getFreeSlot();
	}

	getFreeSlot() {
		const slot = this.slots.find((slot) => slot.item.isEmpty());
		if (slot) return slot;
		const newSlot = this.addSlot();
		for (let i = 1; i < SLOTS_PER_ROW; i++) {
			this.addSlot();
		}
		return newSlot;
	}

	addSlot() {
		return this.slots.add(new ItemSlotModel(['all'], this.slotType));
	}

	addItem(item) {
		const slot = this.getFreeSlot();
		slot.item.set(item);
	}
}
