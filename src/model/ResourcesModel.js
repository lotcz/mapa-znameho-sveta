import IdentifiedModelNode from "../node/IdentifiedModelNode";
import ModelNodeTable from "../node/ModelNodeTable";
import MaterialModel from "./MaterialModel";
import RaceModel from "./RaceModel";

export default class ResourcesModel extends IdentifiedModelNode {

	/**
	 * @type ModelNodeTable
	 */
	materials;

	/**
	 * @type ModelNodeTable
	 */
	races;

	constructor(id) {
		super(id);

		this.materials = this.addProperty('materials', new ModelNodeTable((id) => new MaterialModel(id)));
		this.races = this.addProperty('races', new ModelNodeTable((id) => new RaceModel(id)));
	}

}
