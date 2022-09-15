import IntValue from "../../basic/IntValue";
import ModelNode from "../../basic/ModelNode";

export default class ItemModel extends ModelNode {

	/**
	 * @type IntValue
	 */
	definitionId;

	/**
	 * @type IntValue
	 * Used for rendering hair
	 */
	primaryMaterialId;

	constructor() {
		super();

		this.definitionId = this.addProperty('definitionId', new IntValue());
		this.primaryMaterialId = this.addProperty('primaryMaterialId', new IntValue());
	}

}
