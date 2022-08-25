import DirtyValue from "../../basic/DirtyValue";
import ModelNode from "../../basic/ModelNode";

export default class PartySlot extends ModelNode {

	/**
	 * @type DirtyValue
	 */
	characterId;

	constructor() {
		super();

		this.characterId = this.addProperty('characterId', new DirtyValue(0));

	}

}
