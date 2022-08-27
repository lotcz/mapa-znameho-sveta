import ModelNode from "../../basic/ModelNode";
import PathModel from "./PathModel";
import ModelNodeTable from "../../basic/ModelNodeTable";
import LocationModel from "./LocationModel";

export default class MapModel extends ModelNode {

	/**
	 * @type ModelNodeTable
	 */
	paths;

	/**
	 * @type ModelNodeTable
	 */
	locations;

	constructor() {
		super();

		this.locations = this.addProperty('locations', new ModelNodeTable((id) => new LocationModel(id)));
		this.paths = this.addProperty('paths', new ModelNodeTable((id) => new PathModel(id)));

	}

}
