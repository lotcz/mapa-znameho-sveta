import DirtyValue from "../../basic/DirtyValue";
import IntValue from "../../basic/IntValue";
import IdentifiedModelNode from "../../basic/IdentifiedModelNode";
import Quaternion from "../../basic/Quaternion";
import FloatValue from "../../basic/FloatValue";
import Vector3 from "../../basic/Vector3";

export default class ItemDefinitionModel extends IdentifiedModelNode {

	/**
	 * @type DirtyValue
	 */
	name;

	/**
	 * @type IntValue
	 */
	modelId;

	/**
	 * @type Quaternion
	 */
	cameraQuaternion;

	/**
	 * @type Vector3
	 */
	cameraPosition;

	/**
	 * @type FloatValue
	 */
	cameraSize;

	constructor(id) {
		super(id);

		this.name = this.addProperty('name', new DirtyValue(`Item ${id}`));
		this.modelId = this.addProperty('modelId', new IntValue());

		this.cameraQuaternion = this.addProperty('cameraQuaternion', new Quaternion());
		this.cameraPosition = this.addProperty('cameraPosition', new Vector3());
		this.cameraSize = this.addProperty('cameraSize', new FloatValue(80));
	}

}
