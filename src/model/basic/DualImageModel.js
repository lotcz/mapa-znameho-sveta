import ModelNodeCollection from "./ModelNodeCollection";
import ImageModel from "./ImageModel";
import Vector2 from "./Vector2";

export default class DualImageModel extends ModelNodeCollection {

	/**
	 * @type ImageModel
	 */
	imageA;

	/**
	 * @type ImageModel
	 */
	imageB;

	/**
	 * @type Vector2
	 */
	size;

	constructor(persistent) {
		super(null, persistent);

		this.imageA = this.addProperty('imageA', new ImageModel());
		this.imageB = this.addProperty('imageB', new ImageModel());
		this.size = this.addProperty('size', new Vector2());

		this.add(this.imageA);
		this.add(this.imageB);

	}

}
