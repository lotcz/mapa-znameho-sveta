import DirtyValue from "./DirtyValue";
import ModelNode from "./ModelNode";

export default class IdentifiedModelNode extends ModelNode {

	/**
	 * @type DirtyValue
	 */
	id;

	constructor(id = 0) {
		super();

		this.id = this.addProperty('id', new DirtyValue(id));
	}

}
