import DirtyValue from "../basic/DirtyValue";
import IdentifiedModelNode from "../basic/IdentifiedModelNode";
import * as THREE from "three";
import BoolValue from "../basic/BoolValue";
import IntValue from "../basic/IntValue";

export default class MaterialModel extends IdentifiedModelNode {

	/**
	 * @type DirtyValue
	 */
	name;

	/**
	 * @type DirtyValue
	 */
	threeType;

	/**
	 * @type DirtyValue
	 */
	color;

	/**
	 * @type BoolValue
	 */
	useTexture;

	/**
	 * @type DirtyValue
	 */
	uri;

	/**
	 * @type IntValue
	 */
	wrapS;

	/**
	 * @type IntValue
	 */
	wrapT;

	/**
	 * @type IntValue
	 */
	repeatX;

	/**
	 * @type IntValue
	 */
	repeatY;

	constructor(id) {
		super(id);

		this.name = this.addProperty('name', new DirtyValue(`Material ${id}`));
		this.threeType = this.addProperty('threeType', new DirtyValue('MeshBasicMaterial'));
		this.color = this.addProperty('color', new DirtyValue('#700000'));

		this.useTexture = this.addProperty('useTexture', new BoolValue(true));
		this.uri = this.addProperty('uri', new DirtyValue('img/texture/dirt.png'));
		this.wrapS = this.addProperty('wrapS', new IntValue(THREE.RepeatWrapping));
		this.wrapT = this.addProperty('wrapT', new IntValue(THREE.RepeatWrapping));
		this.repeatX = this.addProperty('repeatX', new IntValue(2));
		this.repeatY = this.addProperty('repeatY', new IntValue(2));
	}

}
