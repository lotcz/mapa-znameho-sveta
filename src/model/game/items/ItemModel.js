import IntValue from "../../basic/IntValue";
import ModelNode from "../../basic/ModelNode";
import StatModel from "../party/stats/StatModel";

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

	/**
	 * @type StatModel
	 */
	condition;

	constructor() {
		super();

		this.definitionId = this.addProperty('definitionId', new IntValue());
		this.primaryMaterialId = this.addProperty('primaryMaterialId', new IntValue());

		this.condition = this.addProperty('condition', new StatModel());
	}

}
