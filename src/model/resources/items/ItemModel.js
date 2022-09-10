import IntValue from "../../basic/IntValue";
import ModelNode from "../../basic/ModelNode";

export default class ItemModel extends ModelNode {

	/**
	 * @type IntValue
	 */
	definitionId;

	constructor() {
		super();

		this.definitionId = this.addProperty('definitionId', new IntValue());
	}

}
