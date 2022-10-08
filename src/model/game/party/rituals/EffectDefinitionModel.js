import IntValue from "../../../basic/IntValue";
import ModelNode from "../../../basic/ModelNode";

export default class EffectDefinitionModel extends ModelNode {

	/**
	 * @type IntValue
	 */
	statId;

	/**
	 * @type IntValue
	 */
	amount;

	constructor() {
		super();

		this.statId = this.addProperty('statId', new IntValue());
		this.amount = this.addProperty('amount', new IntValue(1));
	}

}
