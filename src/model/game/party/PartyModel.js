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

	}

	containsCharacter(characterId) {
		return this.slots.find((s) => s.characterId.equalsTo(characterId));
	}

	forEachCharacter(func) {
		this.slots.forEach((s) => {
			if (s.character.isSet()) func(s.character.get());
		});
	}

}
