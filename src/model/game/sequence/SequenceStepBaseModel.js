import ModelNode from "../../basic/ModelNode";
import IntValue from "../../basic/IntValue";

export default class SequenceStepBaseModel extends ModelNode {

	/**
	 * @type IntValue
	 */
	duration;

	constructor() {
		super();

		this.duration = this.addProperty('duration', new IntValue(4000));

	}

}
