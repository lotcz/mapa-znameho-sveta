import ModelNode from "../../basic/ModelNode";
import DirtyValue from "../../basic/DirtyValue";
import FloatValue from "../../basic/FloatValue";

export default class BiotopeImageModel extends ModelNode {

	/**
	 * @type DirtyValue
	 */
	uri;

	/**
	 * @type FloatValue
	 */
	time;

	constructor() {
		super();

		this.uri = this.addProperty('uri', new DirtyValue('img/art/adelan-night.jpeg'));
		this.time = this.addProperty('time', new FloatValue(0));
	}

	getResourcesForPreloadInternal() {
		if (this.uri.isEmpty()) return [];
		return [this.uri.get()];
	}

}
