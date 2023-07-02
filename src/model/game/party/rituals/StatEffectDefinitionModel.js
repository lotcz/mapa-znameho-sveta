import IntValue from "../../../basic/IntValue";
import ModelNode from "../../../basic/ModelNode";
import FloatValue from "../../../basic/FloatValue";

export default class StatEffectDefinitionModel extends ModelNode {

	/**
	 * @type EffectSourceModel
	 */
	effectSource;

	/**
	 * @type IntValue
	 */
	statId;

	/**
	 * @type FloatValue
	 */
	amount;

	constructor(source, statId = Number.NaN, amount = 1) {
		super();

		this.effectSource = this.addProperty('effectSource', source);
		this.statId = this.addProperty('statId', new IntValue(statId));
		this.amount = this.addProperty('amount', new FloatValue(amount));
	}

}
