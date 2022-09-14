import ModelNode from "../../../basic/ModelNode";
import IntValue from "../../../basic/IntValue";

export default class StatBaseModel extends ModelNode {

	/**
	 * @type IntValue
	 */
	definitionId;

	constructor(definitionId = 0) {
		super();

		this.definitionId = this.addProperty('definitionId', new IntValue(definitionId));
	}

}
