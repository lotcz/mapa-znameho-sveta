import ModelNode from "../../basic/ModelNode";
import CharacterModel from "../../characters/CharacterModel";
import DirtyValue from "../../basic/DirtyValue";
import ModelNodeCollection from "../../basic/ModelNodeCollection";
import PartySlot from "./PartySlot";

export default class PartyModel extends ModelNode {

	/**
	 * @type DirtyValue
	 */
	mainCharacterId;

	/**
	 * @type CharacterModel
	 */
	mainCharacter;

	/**
	 * @type ModelNodeCollection
	 */
	slots;

	/**
	 * @type ModelNodeCollection
	 */
	characters;

	constructor() {
		super();

		this.mainCharacterId = this.addProperty('mainCharacterId', new DirtyValue());
		this.mainCharacter = null;

		this.slots = this.addProperty('slots', new ModelNodeCollection(() => new PartySlot()));
		this.characters = this.addProperty('characters', new ModelNodeCollection(() => new CharacterModel()), false);

	}

}
