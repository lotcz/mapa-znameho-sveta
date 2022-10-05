import ModelNode from "../../basic/ModelNode";
import ModelNodeCollection from "../../basic/ModelNodeCollection";
import PartySlotModel from "./PartySlotModel";
import IntValue from "../../basic/IntValue";
import NullableNode from "../../basic/NullableNode";
import BoolValue from "../../basic/BoolValue";

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
	 * @type ModelNodeCollection<PartySlotModel>
	 */
	slots;

	constructor() {
		super();

		this.mainCharacterId = this.addProperty('mainCharacterId', new IntValue(0));

		this.selectedCharacterId = this.addProperty('selectedCharacterId', new IntValue());
		this.selectedCharacter = this.addProperty('selectedCharacter', new NullableNode(null, false));
		this.isInventoryVisible = this.addProperty('isInventoryVisible', new BoolValue(false));

		this.slots = this.addProperty('slots', new ModelNodeCollection(() => new PartySlotModel()));
	}

	hasCharacter(characterId) {
		return this.slots.find((s) => s.characterId.equalsTo(characterId));
	}

}
