import DirtyValue from "./DirtyValue";
import IdentifiedModelNode from "./IdentifiedModelNode";

export default class TemplateNode extends IdentifiedModelNode {

	/**
	 * @type DirtyValue
	 */
	isTemplate;

	constructor(id = 0) {
		super(id);

		this.isTemplate = this.addProperty('isTemplate', new DirtyValue(true));
	}

	clone() {
		const n = parent.clone();
		n.isTemplate.set(false);
	}

}
