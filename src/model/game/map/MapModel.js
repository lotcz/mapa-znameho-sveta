import ModelNode from "../../basic/ModelNode";
import PathModel from "./PathModel";
import ModelNodeTable from "../../basic/ModelNodeTable";
import LocationModel from "./LocationModel";
import BiotopeModel from "./BiotopeModel";
import BattleMapModel from "./BattleMapModel";

export default class MapModel extends ModelNode {

	/**
	 * @type ModelNodeTable
	 */
	biotopes;

	/**
	 * @type ModelNodeTable
	 */
	paths;

	/**
	 * @type ModelNodeTable
	 */
	locations;

	/**
	 * @type ModelNodeTable
	 */
	battleMaps;

	constructor() {
		super();

		this.biotopes = this.addProperty('biotopes', new ModelNodeTable((id) => new BiotopeModel(id)));
		this.paths = this.addProperty('paths', new ModelNodeTable((id) => new PathModel(id)));
		this.locations = this.addProperty('locations', new ModelNodeTable((id) => new LocationModel(id)));
		this.battleMaps = this.addProperty('battleMaps', new ModelNodeTable((id) => new BattleMapModel(id)));

	}

}
