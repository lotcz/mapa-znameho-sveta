import StringValue from "../../basic/StringValue";
import SequenceStepBaseModel from "./SequenceStepBaseModel";

export default class SequenceStepTextModel extends SequenceStepBaseModel {

	/**
	 * @type StringValue
	 */
	text;

	constructor() {
		super();

		this.text = this.addProperty('text', new StringValue());

	}

}
