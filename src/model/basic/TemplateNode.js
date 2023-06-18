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

	equalsTo(ch) {
		if (super.equalsTo(ch)) return true;
		if (typeof ch.getOriginalId !== 'function') return false;
		return (this.getOriginalId() === ch.getOriginalId());
	}

	isCloned() {
		return this.originalId.isSet();
	}

	getOriginalId() {
		if (this.originalId.isSet()) return this.originalId.get();
		return this.id.get();
	}

	isOriginalId(id) {
		if (this.originalId.isSet()) return this.originalId.equalsTo(id);
		return this.id.equalsTo(id);
	}
}
