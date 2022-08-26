import ModelNode from "./ModelNode";
import IntValue from "./IntValue";

export default class IdentifiedModelNode extends ModelNode {

	/**
	 * @type IntValue
	 */
	id;

	constructor(id = 0) {
		super();

		this.id = this.addProperty('id', new IntValue(id));
	}

}
