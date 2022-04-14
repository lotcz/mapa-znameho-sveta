import ModelNode from "../node/ModelNode";
import DirtyValue from "../node/DirtyValue";
import Vector2 from "../node/Vector2";

export default class ThreeModel extends ModelNode {

	/**
	 * @type DirtyValue
	 */
	rotation;

	/**
	 * @type Vector2
	 */
	coordinates;

	/**
	 * @type Vector2
	 */
	size;

	constructor() {
		super();

		this.rotation = this.addProperty('rotation', new DirtyValue(0));
		this.coordinates = this.addProperty('coordinates', new Vector2(25, 25));
		this.size = this.addProperty('size', new Vector2(450, 250));

	}

}
