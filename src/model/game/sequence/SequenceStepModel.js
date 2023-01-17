import ModelNode from "../../basic/ModelNode";
import FloatValue from "../../basic/FloatValue";
import Vector2 from "../../basic/Vector2";
import StringValue from "../../basic/StringValue";

export default class SequenceStepModel extends ModelNode {

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
	 * @type StringValue
	 */
	image;

	/**
	 * @type StringValue
	 */
	text;

	constructor() {
		super();

		this.duration = this.addProperty('duration', new FloatValue(1));
		this.coordinates = this.addProperty('coordinates', new Vector2());
		this.zoom = this.addProperty('zoom', new FloatValue(0));
		this.image = this.addProperty('image', new StringValue());
		this.text = this.addProperty('text', new StringValue());
	}

}
