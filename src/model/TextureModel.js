import DirtyValue from "../node/DirtyValue";
import * as THREE from "three";
import ModelNode from "../node/ModelNode";

export default class TextureModel extends ModelNode {

	/**
	 * @type DirtyValue
	 */
	uri;

	/**
	 * @type DirtyValue
	 */
	wrapS;

	/**
	 * @type DirtyValue
	 */
	wrapT;

	/**
	 * @type DirtyValue
	 */
	repeatX;

	/**
	 * @type DirtyValue
	 */
	repeatY;

	constructor() {
		super();

		this.uri = this.addProperty('uri', new DirtyValue());
		this.wrapS = this.addProperty('wrapS', new DirtyValue(THREE.RepeatWrapping));
		this.wrapT = this.addProperty('wrapT', new DirtyValue(THREE.RepeatWrapping));
		this.repeatX = this.addProperty('repeatX', new DirtyValue(2));
		this.repeatY = this.addProperty('repeatY', new DirtyValue(2));
	}

}
