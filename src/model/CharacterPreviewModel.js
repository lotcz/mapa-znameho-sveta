import DirtyValue from "../node/DirtyValue";
import ModelNode from "../node/ModelNode";
import Vector2 from "../node/Vector2";
import Vector3 from "../node/Vector3";

export const SEX_MALE = 'male';
export const SEX_FEMALE = 'female';

export default class CharacterPreviewModel extends ModelNode {

	/**
	 * @type DirtyValue
	 */
	sex;

	/**
	 * @type DirtyValue
	 */
	skinColor;

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

	/**
	 * @type Vector3
	 */
	scale;

	/**
	 * @type Vector3
	 */
	itemPosition;

	/**
	 * @type Vector3
	 */
	itemScale;

	/**
	 * @type Vector3
	 */
	itemRotation;

	constructor(id, name) {
		super(id, name);

		this.sex = this.addProperty('sex', new DirtyValue(SEX_MALE));
		this.skinColor = this.addProperty('skinColor', new DirtyValue('#FF0000'));
		this.rotation = this.addProperty('rotation', new DirtyValue(0));
		this.coordinates = this.addProperty('coordinates', new Vector2(25, 25));
		this.size = this.addProperty('size', new Vector2(850, 550));
		this.scale = this.addProperty('scale', new Vector3(1, 1, 1));

		this.itemPosition = this.addProperty('itemPosition', new Vector3());
		this.itemScale = this.addProperty('itemScale', new Vector3(1, 1, 1));
		this.itemRotation = this.addProperty('itemRotation', new Vector3());
	}

}
