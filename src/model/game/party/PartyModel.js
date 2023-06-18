import ModelNode from "../../basic/ModelNode";
import ModelNodeCollection from "../../basic/ModelNodeCollection";
import PartySlotModel from "./PartySlotModel";
import IntValue from "../../basic/IntValue";
import NullableNode from "../../basic/NullableNode";
import BoolValue from "../../basic/BoolValue";
import DirtyValue from "../../basic/DirtyValue";

export const INVENTORY_MODE_ITEMS = 'items';
export const INVENTORY_MODE_STATS = 'stats';
export const INVENTORY_MODE_RITUALS = 'rituals';
export const INVENTORY_MODE_QUESTS = 'quests';

export default class PartyModel extends ModelNode {

	/**
	 * @type IntValue
	 */
	mainCharacterId;

	/**
	 * @type IntValue
	 */
	selectedCharacterId;

	/**
	 * @type NullableNode<CharacterModel>
	 */
	selectedCharacter;

	/**
	 * @type BoolValue
	 */
	isInventoryVisible;

	/**
	 * @type DirtyValue
	 */
	inventoryMode;

	/**
	 * @type ModelNodeCollection<PartySlotModel>
	 */
	slots;

	/**
	* @type BoolValue
	 */
	battleScrollWhenMove;

	/**
	 * @type BoolValue
	 */
	battleFollowTheLeader;

	constructor() {
		super();

		this.mainCharacterId = this.addProperty('mainCharacterId', new IntValue(0));

		this.selectedCharacterId = this.addProperty('selectedCharacterId', new IntValue());
		this.selectedCharacter = this.addProperty('selectedCharacter', new NullableNode(null, false));

		this.isInventoryVisible = this.addProperty('isInventoryVisible', new BoolValue(false));
		this.inventoryMode = this.addProperty('inventoryMode', new DirtyValue(INVENTORY_MODE_ITEMS));

		this.slots = this.addProperty('slots', new ModelNodeCollection(() => new PartySlotModel()));

		this.battleScrollWhenMove = this.addProperty('battleScrollWhenMove', new BoolValue(true));
		this.battleFollowTheLeader = this.addProperty('battleFollowTheLeader', new BoolValue(true));

	}

	containsCharacter(characterId) {
		return this.slots.find((s) => s.characterId.equalsTo(characterId));
	}

	forEachCharacter(func) {
		this.slots.forEach((s) => {
			if (s.character.isSet()) func(s.character.get());
		});
	}

	findNextInLine(characterId) {
		for (let i = 0, max= this.slots.count(); i < max; i++) {
			const slot = this.slots.get(i);
			if (slot.characterId.equalsTo(characterId)) {
				const nextSlot = this.slots.get((i + 1) % max);
				if (nextSlot.characterId.equalsTo(this.selectedCharacterId.get())) return null;
				return nextSlot.character.get();
			}
		}
		return null;
	}

	findFreeItemSlot(accepts = null) {
		if (this.selectedCharacter.isSet()) {
			const selectedCharacter = this.selectedCharacter.get();
			const slot = selectedCharacter.inventory.findFreeSlot(accepts);
			if (slot) return slot;
		}
		for (let i = 0, max= this.slots.count(); i < max; i++) {
			const character = this.slots.get(i).character.get();
			if (!character) continue;
			const slot = character.inventory.findFreeSlot(accepts);
			if (slot) return slot;
		}
		return null;
	}

	findItem(itemDefId) {
		for (let i = 0, max= this.slots.count(); i < max; i++) {
			const character = this.slots.get(i).character.get();
			if (!character) continue;
			const item = character.inventory.findItem(itemDefId);
			if (item) return item;
		}
		return null;
	}

	hasItem(itemDefId) {
		return this.findItem(itemDefId) !== null;
	}

	getResourcesForPreloadInternal() {
		return ['img/ui/inventory-female.png', 'img/ui/inventory-male.png'];
	}

}
