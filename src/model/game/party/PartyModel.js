import ModelNode from "../../basic/ModelNode";
import ModelNodeCollection from "../../basic/ModelNodeCollection";
import PartySlotModel from "./PartySlotModel";
import IntValue from "../../basic/IntValue";
import NullableNode from "../../basic/NullableNode";

export default class PartyModel extends ModelNode {

	/**
	 * @type IntValue
	 */
	mainCharacterId;

	/**
	 * @type NullableNode<CharacterModel>
	 */
	mainCharacter;

	/**
	 * @type IntValue
	 */
	selectedCharacterId;

	/**
	 * @type NullableNode<CharacterModel>
	 */
	selectedCharacter;

	/**
	 * @type NullableNode<CharacterModel>
	 */
	selectedInventoryCharacter;

	/**
	 * @type ModelNodeCollection<PartySlotModel>
	 */
	slots;

	constructor() {
		super();

		this.mainCharacterId = this.addProperty('mainCharacterId', new IntValue(0));
		this.mainCharacter = this.addProperty('mainCharacter', new NullableNode(null, false));

		this.selectedCharacterId = this.addProperty('selectedCharacterId', new IntValue(0));
		this.selectedCharacter = this.addProperty('selectedCharacter', new NullableNode(null, false));
		this.selectedInventoryCharacter = this.addProperty('selectedInventoryCharacter', new NullableNode(null, false));

		this.slots = this.addProperty('slots', new ModelNodeCollection(() => new PartySlotModel()));
	}

}
