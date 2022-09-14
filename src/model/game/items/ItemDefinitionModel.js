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
	 * @type DirtyValue
	 */
	type;

	/**
	 * @type IntValue
	 */
	modelId;

	/**
	 * @type IntValue
	 */
	primaryMaterialId;

	/**
	 * @type IntValue
	 */
	secondaryMaterialId;

	/**
	 * @type Vector3
	 */
	scale;

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

	/**
	 * @type Quaternion
	 */
	mountingRotation;

	/**
	 * @type Vector3
	 */
	mountingPosition;

	/**
	 * @type Quaternion
	 */
	altMountingRotation;

	/**
	 * @type Vector3
	 */
	altMountingPosition;

	constructor(id) {
		super(id);

		this.name = this.addProperty('name', new DirtyValue(`Item ${id}`));
		this.type = this.addProperty('type', new DirtyValue('item'));
		this.modelId = this.addProperty('modelId', new IntValue());
		this.primaryMaterialId = this.addProperty('primaryMaterialId', new IntValue());
		this.secondaryMaterialId = this.addProperty('secondaryMaterialId', new IntValue());

		this.scale = this.addProperty('scale', new Vector3(1,1,1));

		this.cameraQuaternion = this.addProperty('cameraQuaternion', new Quaternion());
		this.cameraPosition = this.addProperty('cameraPosition', new Vector3());
		this.cameraSize = this.addProperty('cameraSize', new FloatValue(20));

		this.mountingRotation = this.addProperty('mountingRotation', new Vector3());
		this.mountingPosition = this.addProperty('mountingPosition', new Vector3());
		this.altMountingRotation = this.addProperty('altMountingRotation', new Vector3());
		this.altMountingPosition = this.addProperty('altMountingPosition', new Vector3());
	}

}
