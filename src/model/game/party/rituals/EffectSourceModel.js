import ModelNode from "../../../basic/ModelNode";
import StringValue from "../../../basic/StringValue";

export const EFFECT_SOURCE_ITEM = 'item';
export const EFFECT_SOURCE_RACE = 'race';
export const EFFECT_SOURCE_WEATHER = 'weather';

export default class EffectSourceModel extends ModelNode {

	/**
	 * @type StringValue
	 */
	name;

	/**
	 * @type string
	 */
	type;

	constructor(type = EFFECT_SOURCE_ITEM) {
		super(false);

		this.type = type;
		this.name = this.addProperty('name', new StringValue(''));

	}

}
