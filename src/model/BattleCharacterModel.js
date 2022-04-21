import DirtyValue from "../node/DirtyValue";
import ModelNode from "../node/ModelNode";
import Vector2 from "../node/Vector2";
import Vector3 from "../node/Vector3";
import {SEX_FEMALE} from "./CharacterPreviewModel";
import Rotation from "../node/Rotation";

export const CHARACTER_STATE_IDLE = 'Idle';
export const CHARACTER_STATE_RUN = 'Run';
export const CHARACTER_STATE_SWORD = 'Sword';

export default class BattleCharacterModel extends ModelNode {

	/**
	 * @type Vector2
	 */
	position;

	/**
	 * @type Rotation
	 */
	rotation;

	/**
	 * @type DirtyValue
	 */
	state;

	/**
	 * @type DirtyValue
	 */
	sex;

	/**
	 * @type DirtyValue
	 */
	skinColor;

	/**
	 * @type Vector3
	 */
	scale;

	/**
	 * @type DirtyValue
	 */
	item;

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

	constructor() {
		super();

		this.position = this.addProperty('position', new Vector2(0, 0));
		this.rotation = this.addProperty('rotation', new Rotation(0));
		this.state = this.addProperty('state', new DirtyValue('Idle'));

		this.sex = this.addProperty('sex', new DirtyValue(SEX_FEMALE));
		this.skinColor = this.addProperty('skinColor', new DirtyValue('#083e16'));
		this.scale = this.addProperty('scale', new Vector3(1, 1, 1));

		this.item = this.addProperty('item', new DirtyValue('glb/hair.glb'));
		this.itemPosition = this.addProperty('itemPosition', new Vector3(0, 5, -4));
		this.itemScale = this.addProperty('itemScale', new Vector3(100,100,100));
		this.itemRotation = this.addProperty('itemRotation', new Vector3(-0.279, 0.698, 0.069));
	}

}
