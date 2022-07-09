import DirtyValue from "./basic/DirtyValue";
import ModelNode from "./basic/ModelNode";
import Vector2 from "./basic/Vector2";
import Vector3 from "./basic/Vector3";

export const SEX_MALE = 'male';
export const SEX_FEMALE = 'female';
export const SEX_WOLF = 'wolf';
export const SEX_MAMMOTH = 'mammoth';

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
		this.skinColor = this.addProperty('skinColor', new DirtyValue('#083e16'));
		this.rotation = this.addProperty('rotation', new DirtyValue(0));
		this.coordinates = this.addProperty('coordinates', new Vector2(25, 25));
		this.size = this.addProperty('size', new Vector2(850, 550));
		this.scale = this.addProperty('scale', new Vector3(1, 1, 1));

		this.itemPosition = this.addProperty('itemPosition', new Vector3(0, 5, -4));
		this.itemScale = this.addProperty('itemScale', new Vector3(100,100,100));
		this.itemRotation = this.addProperty('itemRotation', new Vector3(-0.279, 0.698, 0.069));
	}

}
