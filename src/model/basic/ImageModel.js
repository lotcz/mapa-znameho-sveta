import ModelNode from "./ModelNode";
import StringValue from "./StringValue";
import FloatValue from "./FloatValue";
import Vector2 from "./Vector2";

export default class ImageModel extends ModelNode {

	/**
	 * @type StringValue
	 */
	url;

	/**
	 * @type FloatValue
	 */
	opacity;

	/**
	 * @type Vector2
	 */
	coordinates;

	/**
	 * @type FloatValue
	 */
	zoom;

	/**
	 * @type Vector2
	 */
	size;

	constructor(persistent = true) {
		super(persistent);

		this.url = this.addProperty('url', new StringValue());
		this.opacity = this.addProperty('opacity', new FloatValue());
		this.coordinates = this.addProperty('coordinates', new Vector2());
		this.size = this.addProperty('size', new Vector2());
		this.zoom = this.addProperty('startZoom', new FloatValue(1));
	}

}
