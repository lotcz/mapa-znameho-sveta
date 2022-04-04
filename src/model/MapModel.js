import ModelNode from "../node/ModelNode";
import PathModel from "./PathModel";
import DirtyValue from "../node/DirtyValue";
import Vector2 from "../node/Vector2";
import ModelNodeTable from "../node/ModelNodeTable";
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

	/**
	 * @type Vector2
	 * current scroll position
	 */
	coordinates;

	/**
	 * @type DirtyValue
	 */
	zoom;

	/**
	 * @type DirtyValue
	 */
	focusedHelper;

	constructor() {
		super();

		this.paths = this.addProperty('paths', new ModelNodeTable((id) => new PathModel(id)));
		this.locations = this.addProperty('locations', new ModelNodeTable((id) => new LocationModel(id)));
		this.coordinates = this.addProperty('coordinates', new Vector2());
		this.zoom = this.addProperty('zoom', new DirtyValue(1));
		this.focusedHelper = this.addProperty('focusedHelper', new DirtyValue(null));

	}

}
