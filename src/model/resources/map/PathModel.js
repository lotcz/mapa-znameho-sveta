import DirtyValue from "../../basic/DirtyValue";
import ModelNodeCollection from "../../basic/ModelNodeCollection";
import WaypointModel, {WAYPOINT_TYPE_END, WAYPOINT_TYPE_MIDDLE, WAYPOINT_TYPE_START} from "./WaypointModel";
import IdentifiedModelNode from "../../basic/IdentifiedModelNode";
import NullableNode from "../../basic/NullableNode";
import IntValue from "../../basic/IntValue";

export default class PathModel extends IdentifiedModelNode {

	/**
	 * @type ModelNodeCollection
	 */
	waypoints;

	/**
	 * @type IntValue
	 */
	startLocationId;

	/**
	 * @type NullableNode
	 */
	startLocation;

	/**
	 * @type IntValue
	 */
	endLocationId;

	/**
	 * @type NullableNode
	 */
	endLocation;

	/**
	 * @type DirtyValue
	 */
	length;

	/**
	 * @type DirtyValue<bool>
	 */
	isCurrentPath;

	/**
	 * @type DirtyValue<float>
	 */
	pathProgress;

	constructor(id) {
		super(id);

		this.waypoints = this.addProperty('waypoints', new ModelNodeCollection(() => new WaypointModel()));
		this.waypoints.addOnAddListener(() => this.updateWaypoints());
		this.waypoints.addOnRemoveListener(() => this.updateWaypoints());
		this.length = this.addProperty('length', new DirtyValue(0));

		this.startLocationId = this.addProperty('startLocationId', new IntValue(0));
		this.startLocation = this.addProperty('startLocation', new NullableNode(null, false));
		this.endLocationId = this.addProperty('endLocationId', new IntValue(0));
		this.endLocation = this.addProperty('endLocation', new NullableNode(null, false));

		this.isCurrentPath = this.addProperty('isCurrentPath', new DirtyValue(false, false));
		this.pathProgress = this.addProperty('pathProgress', new DirtyValue(0, false));

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
