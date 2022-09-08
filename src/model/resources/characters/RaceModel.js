import DirtyValue from "../../basic/DirtyValue";
import IdentifiedModelNode from "../../basic/IdentifiedModelNode";
import IntValue from "../../basic/IntValue";
import Vector3 from "../../basic/Vector3";

export default class RaceModel extends IdentifiedModelNode {

	/**
	 * @type DirtyValue
	 */
	name;

	/**
	 * @type DirtyValue
	 */
	description;

	/**
	 * @type IntValue
	 */
	skinMaterialId;

	/**
	 * @type IntValue
	 */
	male3dModelId;

	/**
	 * @type IntValue
	 */
	female3dModelId;

	/**
	 * @type Vector3
	 */
	scale;

	constructor(id) {
		super(id);

		this.name = this.addProperty('name', new DirtyValue('Adelan'));
		this.description = this.addProperty('description', new DirtyValue('Popis národa'));
		this.skinMaterialId = this.addProperty('skinMaterialId', new IntValue(0));

		this.male3dModelId = this.addProperty('male3dModelId', new IntValue(1));
		this.female3dModelId = this.addProperty('female3dModelId', new IntValue(2));

		this.scale = this.addProperty('scale', new Vector3(1,1,1));
	}

}