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

	equalsTo(ch) {
		if (super.equalsTo(ch)) return true;
		if (typeof ch.id !== 'object') return false;
		if (typeof ch.id.get !== 'function') return false;
		return this.equalsTo(ch.id.get());
	}

}
