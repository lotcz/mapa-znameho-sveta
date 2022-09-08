import IdentifiedModelNode from "./IdentifiedModelNode";
import IntValue from "./IntValue";

export default class TemplateNode extends IdentifiedModelNode {

	/**
	 * @type IntValue
	 */
	originalId;

	constructor(id = 0) {
		super(id);

		this.originalId = this.addProperty('originalId', new IntValue());
	}

	clone() {
		const n = parent.clone();
		n.originalId.set(this.id.get());
		return n;
	}

}
