import DirtyValue from "../../basic/DirtyValue";
import TemplateNode from "../../basic/TemplateNode";
import IntValue from "../../basic/IntValue";

export default class ItemModel extends TemplateNode {

	/**
	 * @type DirtyValue
	 */
	name;

	/**
	 * @type IntValue
	 */
	modelId;

	constructor(id) {
		super(id);

		this.name = this.addProperty('name', new DirtyValue(`Item ${id}`));
		this.modelId = this.addProperty('modelId', new IntValue());
	}

	clone() {
		const n = new ItemModel();
		n.restoreState(this.getState());
		n.originalId.set(this.id.get());
		return n;
	}
}
