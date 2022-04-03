import ModelNode from "../node/ModelNode";
import DirtyValue from "../node/DirtyValue";
import ModelCollectionNode from "../node/ModelCollectionNode";
import WaypointModel from "./WaypointModel";

export default class PathModel extends ModelNode {

	/**
	 * @type ModelCollectionNode
	 */
	waypoints;

	/**
	 * @type DirtyValue
	 */
	pathProgress;

	/**
	 * @type DirtyValue
	 */
	forward;

	constructor() {
		super();

		this.waypoints = this.addProperty('waypoints', new ModelCollectionNode(() => new WaypointModel()));
		this.pathProgress = this.addProperty('pathProgress', new DirtyValue(0));
		this.forward = this.addProperty('forward', new DirtyValue(true));
	}

}
