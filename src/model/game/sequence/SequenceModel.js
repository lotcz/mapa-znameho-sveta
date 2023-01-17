import IdentifiedModelNode from "../../basic/IdentifiedModelNode";
import DirtyValue from "../../basic/DirtyValue";
import ModelNodeCollection from "../../basic/ModelNodeCollection";
import SequenceStepTextModel from "./SequenceStepTextModel";
import Vector2 from "../../basic/Vector2";
import SequenceStepBackgroundModel from "./SequenceStepBackgroundModel";
import StringValue from "../../basic/StringValue";

export default class SequenceModel extends IdentifiedModelNode {

	/**
	 * @type DirtyValue
	 */
	name;

	/**
	 * @type ModelNodeCollection<SequenceStepBackgroundModel>
	 */
	stepsBg;

	/**
	 * @type ModelNodeCollection<SequenceStepTextModel>
	 */
	stepsText;

	/**
	 * @type Vector2
	 */
	theatreSize;

	/**
	 * @type Vector2
	 */
	theatreCoordinates;

	/**
	 * @type ModelNodeCollection<SequenceStepBackgroundModel>
	 */
	runningSteps;

	/**
	 * @type StringValue
	 */
	text;

	constructor(id) {
		super(id);

		this.name = this.addProperty('name', new DirtyValue(`Sequence ${id}`));

		this.stepsBg = this.addProperty('stepsBg', new ModelNodeCollection(() => new SequenceStepBackgroundModel()));
		this.stepsText = this.addProperty('stepsText', new ModelNodeCollection(() => new SequenceStepTextModel()));

		this.theatreSize = this.addProperty('theatreSize', new Vector2(0, 0, false));
		this.theatreCoordinates = this.addProperty('theatreCoordinates', new Vector2(0, 0, false));

		this.runningSteps = this.addProperty('runningSteps', new ModelNodeCollection(null, false));
		this.text = this.addProperty('text', new StringValue('', false));
	}

}
