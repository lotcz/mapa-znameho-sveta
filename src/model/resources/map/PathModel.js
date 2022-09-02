import ModelNodeCollection from "../../basic/ModelNodeCollection";
import WaypointModel, {WAYPOINT_TYPE_END, WAYPOINT_TYPE_MIDDLE, WAYPOINT_TYPE_START} from "./WaypointModel";
import IdentifiedModelNode from "../../basic/IdentifiedModelNode";
import NullableNode from "../../basic/NullableNode";
import IntValue from "../../basic/IntValue";
import Vector2 from "../../basic/Vector2";
import BoolValue from "../../basic/BoolValue";
import FloatValue from "../../basic/FloatValue";

export default class PathModel extends IdentifiedModelNode {

	/**
	 * @type BoolValue
	 */
	isVisible;

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
	 * @type FloatValue
	 */
	length;

	/**
	 * @type BoolValue
	 */
	isCurrentPath;

	/**
	 * @type FloatValue
	 */
	pathProgress;

	constructor(id) {
		super(id);

		this.isVisible = this.addProperty('isVisible', new BoolValue(true));

		this.waypoints = this.addProperty('waypoints', new ModelNodeCollection(() => new WaypointModel()));
		this.waypoints.addOnAddListener(() => this.updateWaypoints());
		this.waypoints.addOnRemoveListener(() => this.updateWaypoints());
		this.length = this.addProperty('length', new FloatValue(0));

		this.startLocationId = this.addProperty('startLocationId', new IntValue(0));
		this.startLocation = this.addProperty('startLocation', new NullableNode(null, false));
		this.endLocationId = this.addProperty('endLocationId', new IntValue(0));
		this.endLocation = this.addProperty('endLocation', new NullableNode(null, false));

		this.isCurrentPath = this.addProperty('isCurrentPath', new BoolValue(false, false));
		this.pathProgress = this.addProperty('pathProgress', new FloatValue(0, false));

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

	addWaypoint() {
		if (this.waypoints.count() >= 2) {
			const last = this.waypoints.last();
			const prev = this.waypoints.get(this.waypoints.count() - 2);
			const wp = new WaypointModel();
			wp.restoreState(last.getState());
			this.waypoints.add(wp);
			wp.b.set(wp.coordinates.add(new Vector2(50, 50)));

			last.a.set(last.coordinates.add(new Vector2(-50, -50)));
			const coords = prev.coordinates.add(last.coordinates).multiply(0.5);
			last.coordinates.set(coords);
		}
	}

}
