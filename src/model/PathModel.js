import DirtyValue from "../node/DirtyValue";
import ModelNodeCollection from "../node/ModelNodeCollection";
import WaypointModel, {WAYPOINT_TYPE_END, WAYPOINT_TYPE_MIDDLE, WAYPOINT_TYPE_START} from "./WaypointModel";
import IdentifiedModelNode from "../node/IdentifiedModelNode";

export default class PathModel extends IdentifiedModelNode {

	/**
	 * @type ModelNodeCollection
	 */
	waypoints;

	/**
	 * @type DirtyValue
	 */
	startLocationId;

	/**
	 * @type DirtyValue
	 */
	endLocationId;

	/**
	 * @type DirtyValue
	 */
	length;

	/**
	 * @type DirtyValue
	 */
	pathProgress;

	/**
	 * @type DirtyValue
	 */
	forward;

	constructor(id) {
		super(id);

		this.waypoints = this.addProperty('waypoints', new ModelNodeCollection(() => new WaypointModel()));
		this.waypoints.addOnAddListener(() => this.updateWaypoints());
		this.waypoints.addOnRemoveListener(() => this.updateWaypoints());
		this.length = this.addProperty('length', new DirtyValue(0));
		this.pathProgress = this.addProperty('pathProgress', new DirtyValue(0));
		this.forward = this.addProperty('forward', new DirtyValue(true));
		this.startLocationId = this.addProperty('startLocationId', new DirtyValue(0));
		this.endLocationId = this.addProperty('endLocationId', new DirtyValue(0));
	}

	updateWaypoints() {
		for (let i = 0, max = this.waypoints.count(); i < max; i++) {
			const wp = this.waypoints.get(i);
			switch (i) {
				case 0:
					wp.type.set(WAYPOINT_TYPE_START);
					break;
				case max - 1:
					wp.type.set(WAYPOINT_TYPE_END);
					break;
				default:
					wp.type.set(WAYPOINT_TYPE_MIDDLE);
			}
		}
	}

}
