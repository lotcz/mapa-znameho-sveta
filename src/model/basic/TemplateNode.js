import IdentifiedModelNode from "./IdentifiedModelNode";
import BoolValue from "./BoolValue";

export default class TemplateNode extends IdentifiedModelNode {

	/**
	 * @type BoolValue
	 */
	isTemplate;

	constructor(id = 0) {
		super(id);

		this.isTemplate = this.addProperty('isTemplate', new BoolValue(true));
	}

	clone() {
		const n = parent.clone();
		n.isTemplate.set(false);
	}

}
