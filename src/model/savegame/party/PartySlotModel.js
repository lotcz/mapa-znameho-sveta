import DirtyValue from "../../basic/DirtyValue";
import ModelNode from "../../basic/ModelNode";
import NullableNode from "../../basic/NullableNode";

export default class PartySlotModel extends ModelNode {

	/**
	 * @type DirtyValue
	 */
	isMainCharacter;

	/**
	 * @type DirtyValue
	 */
	characterId;

	/**
	 * @type NullableNode
	 */
	character;

	constructor() {
		super();

		this.isMainCharacter = this.addProperty('isMainCharacter', new DirtyValue(false));

		this.characterId = this.addProperty('characterId', new DirtyValue(0));
		this.character = this.addProperty('character', new NullableNode(null, false));

	}

}
