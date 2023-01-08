import IdentifiedModelNode from "../../../basic/IdentifiedModelNode";
import DirtyValue from "../../../basic/DirtyValue";
import ModelNodeCollection from "../../../basic/ModelNodeCollection";
import MapSequenceStepModel from "./MapSequenceStep";

export default class MapSequenceModel extends IdentifiedModelNode {

	/**
	 * @type DirtyValue
	 */
	name;

	/**
	 * @type ModelNodeCollection<MapSequenceStepModel>
	 */
	steps;

	constructor() {
		super();

		this.name = this.addProperty('name', new DirtyValue());
		this.steps = this.addProperty('steps', new ModelNodeCollection(() => new MapSequenceStepModel()));
	}

}
