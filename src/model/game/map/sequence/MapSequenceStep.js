import DirtyValue from "../../../basic/DirtyValue";
import ModelNode from "../../../basic/ModelNode";
import FloatValue from "../../../basic/FloatValue";
import Vector2 from "../../../basic/Vector2";

export default class MapSequenceStepModel extends ModelNode {

	/**
	 * @type FloatValue
	 */
	duration;

	/**
	 * @type Vector2
	 */
	coordinates;

	/**
	 * @type FloatValue
	 */
	zoom;

	/**
	 * @type DirtyValue
	 */
	image;

	/**
	 * @type DirtyValue
	 */
	text;

	constructor() {
		super();

		this.duration = this.addProperty('duration', new FloatValue());
		this.coordinates = this.addProperty('coordinates', new Vector2());
		this.zoom = this.addProperty('zoom', new FloatValue());
		this.image = this.addProperty('image', new DirtyValue());
		this.text = this.addProperty('text', new DirtyValue());
	}

}
