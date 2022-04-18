import DirtyValue from "../node/DirtyValue";
import ModelNode from "../node/ModelNode";
import Vector2 from "../node/Vector2";

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

	constructor(id, name) {
		super(id, name);

		this.sex = this.addProperty('sex', new DirtyValue(SEX_MALE));
		this.skinColor = this.addProperty('skinColor', new DirtyValue('#FF0000'));
		this.rotation = this.addProperty('rotation', new DirtyValue(0));
		this.coordinates = this.addProperty('coordinates', new Vector2(25, 25));
		this.size = this.addProperty('size', new Vector2(850, 550));
	}

}
