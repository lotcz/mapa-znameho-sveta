import ModelNode from "../node/ModelNode";
import Vector2 from "../node/Vector2";
import DirtyValue from "../node/DirtyValue";
import Rotation from "../node/Rotation";

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

	constructor() {
		super();

		this.coordinates = this.addProperty('position', new Vector2());
		this.a = this.addProperty('a', new Vector2());
		this.b = this.addProperty('b', new Vector2());

		// move control points together with main point
		this.coordinates.addOnChangeListener((param) => {
			const diff = param.newValue.subtract(param.oldValue);
			this.a.set(this.a.add(diff));
			this.b.set(this.b.add(diff));
		});
	}

}
