import IntValue from "../../basic/IntValue";
import ModelNode from "../../basic/ModelNode";
import DirtyValue from "../../basic/DirtyValue";

export default class AdditionalItemModel extends ModelNode {

	/**
	 * @type DirtyValue
	 */
	slotName;

	/**
	 * @type IntValue
	 */
	definitionId;

	constructor() {
		super();

		this.slotName = this.addProperty('slotName', new DirtyValue(''));
		this.definitionId = this.addProperty('definitionId', new IntValue());
	}

}
