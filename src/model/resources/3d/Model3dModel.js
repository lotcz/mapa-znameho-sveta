import DirtyValue from "../../basic/DirtyValue";
import IdentifiedModelNode from "../../basic/IdentifiedModelNode";
import Vector3 from "../../basic/Vector3";

export default class Model3dModel extends IdentifiedModelNode {

	/**
	 * @type DirtyValue
	 */
	name;

	/**
	 * @type DirtyValue
	 */
	uri;

	/**
	 * @type Vector3
	 */
	scale;

	constructor(id) {
		super(id);

		this.name = this.addProperty('name', new DirtyValue(`3D Model ${id}`));
		this.uri = this.addProperty('uri', new DirtyValue('glb/races/male.glb'));
		this.scale = this.addProperty('scale', new Vector3(1,1,1));
	}

}
