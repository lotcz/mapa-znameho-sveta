import ModelNode from "../node/ModelNode";
import PathModel from "./PathModel";
import DirtyValue from "../node/DirtyValue";
import Vector2 from "../node/Vector2";

export default class MapModel extends ModelNode {

	/**
	 * @type PathModel
	 */
	path;

	/**
	 * @type Vector2
	 */
	coordinates;

	/**
	 * @type DirtyValue
	 */
	zoom;

	constructor() {
		super();

		this.path = this.addProperty('path', new PathModel());
		this.coordinates = this.addProperty('coordinates', new Vector2());
		this.zoom = this.addProperty('zoom', new DirtyValue(1));

	}

}
