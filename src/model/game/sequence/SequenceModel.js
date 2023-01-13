import IdentifiedModelNode from "../../basic/IdentifiedModelNode";
import DirtyValue from "../../basic/DirtyValue";
import ModelNodeCollection from "../../basic/ModelNodeCollection";
import NullableNode from "../../basic/NullableNode";
import SequenceStepModel from "./SequenceStepModel";

export default class SequenceModel extends IdentifiedModelNode {

	/**
	 * @type DirtyValue
	 */
	name;

	/**
	 * @type ModelNodeCollection<SequenceStepModel>
	 */
	steps;

	/**
	 * @type NullableNode<SequenceStepModel>
	 */
	currentStep;

	constructor(id) {
		super(id);

		this.name = this.addProperty('name', new DirtyValue(`Sequence ${id}`));
		this.steps = this.addProperty('steps', new ModelNodeCollection(() => new SequenceStepModel()));

		this.currentStep = this.addProperty('currentStep', new NullableNode(() => new SequenceStepModel(), false));
	}

}
