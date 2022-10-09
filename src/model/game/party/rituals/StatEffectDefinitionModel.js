import IntValue from "../../../basic/IntValue";
import ModelNode from "../../../basic/ModelNode";
import FloatValue from "../../../basic/FloatValue";

export default class StatEffectDefinitionModel extends ModelNode {

	/**
	 * @type IntValue
	 */
	statId;

	/**
	 * @type FloatValue
	 */
	amount;

	constructor() {
		super();

		this.statId = this.addProperty('statId', new IntValue());
		this.amount = this.addProperty('amount', new FloatValue(1));
	}

}
