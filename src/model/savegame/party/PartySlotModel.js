import ModelNode from "../../basic/ModelNode";
import NullableNode from "../../basic/NullableNode";
import IntValue from "../../basic/IntValue";

export default class PartySlotModel extends ModelNode {

	/**
	 * @type IntValue
	 */
	characterId;

	/**
	 * @type NullableNode
	 */
	character;

	constructor() {
		super();

		this.characterId = this.addProperty('characterId', new IntValue(0));
		this.character = this.addProperty('character', new NullableNode(null, false));

	}

}
