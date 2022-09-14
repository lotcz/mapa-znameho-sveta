import ModelNode from "../../basic/ModelNode";
import Vector2 from "../../basic/Vector2";
import DirtyValue from "../../basic/DirtyValue";

export const WAYPOINT_TYPE_START = 0;
export const WAYPOINT_TYPE_MIDDLE = 1;
export const WAYPOINT_TYPE_END = 2;

export default class WaypointModel extends ModelNode {

	/**
	 * @type Vector2
	 */
	coordinates;

	/**
	 * @type Vector2
	 */
	a;

	/**
	 * @type Vector2
	 */
	b;

	/**
	 * @type DirtyValue
	 */
	type;

	constructor() {
		super();

		this.coordinates = this.addProperty('position', new Vector2());
		this.a = this.addProperty('a', new Vector2());
		this.b = this.addProperty('b', new Vector2());
		this.type = this.addProperty('type', new DirtyValue(WAYPOINT_TYPE_MIDDLE));

		// move control points together with main point
		this.coordinates.addOnChangeListener((param) => {
			const diff = param.newValue.subtract(param.oldValue);
			const distanceA = param.oldValue.subtract(this.a).size();
			if (distanceA > 20) {
				this.a.set(this.a.add(diff));
			}
			const distanceB = param.oldValue.subtract(this.b).size();
			if (distanceB > 20) {
				this.b.set(this.b.add(diff));
			}
		});
	}

}
