import IdentifiedModelNode from "../basic/IdentifiedModelNode";
import ModelNodeTable from "../basic/ModelNodeTable";
import MaterialModel from "./MaterialModel";
import RaceModel from "./RaceModel";
import MapModel from "./MapModel";

export default class ResourcesModel extends IdentifiedModelNode {

	/**
	 * @type MapModel
	 */
	map;

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

		this.map = this.addProperty('map', new MapModel());
		this.materials = this.addProperty('materials', new ModelNodeTable((id) => new MaterialModel(id)));
		this.races = this.addProperty('races', new ModelNodeTable((id) => new RaceModel(id)));
	}

}
