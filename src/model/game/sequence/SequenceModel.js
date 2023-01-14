import IdentifiedModelNode from "../../basic/IdentifiedModelNode";
import DirtyValue from "../../basic/DirtyValue";
import ModelNodeCollection from "../../basic/ModelNodeCollection";
import NullableNode from "../../basic/NullableNode";
import SequenceStepModel from "./SequenceStepModel";
import Vector2 from "../../basic/Vector2";

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

	/**
	 * @type Vector2
	 */
	theatreSize;

	/**
	 * @type Vector2
	 */
	theatreCoordinates;

	constructor(id) {
		super(id);

		this.name = this.addProperty('name', new DirtyValue(`Sequence ${id}`));
		this.steps = this.addProperty('steps', new ModelNodeCollection(() => new SequenceStepModel()));

		this.currentStep = this.addProperty('currentStep', new NullableNode(null, false));

		this.theatreSize = this.addProperty('theatreSize', new Vector2(0, 0, false));
		this.theatreCoordinates = this.addProperty('theatreCoordinates', new Vector2(0, 0, false));
	}

}
