import Vector3 from "../../basic/Vector3";
import IdentifiedModelNode from "../../basic/IdentifiedModelNode";
import DirtyValue from "../../basic/DirtyValue";
import ModelNodeCollection from "../../basic/ModelNodeCollection";
import BlockModel from "./BlockModel";
import IntValue from "../../basic/IntValue";

export default class Sprite3dModel extends IdentifiedModelNode {

	/**
	 * @type DirtyValue
	 */
	name;

	/**
	 * @type IntValue
	 */
	modelId;

	/**
	 * @type Vector3
	 */
	coordinates;

	/**
	 * @type Vector3
	 */
	scale;

	/**
	 * @type IntValue
	 */
	primaryMaterialId;

	/**
	 * @type IntValue
	 */
	secondaryMaterialId;

	/**
	 * @type ModelNodeCollection
	 */
	blocks;

	constructor(id) {
		super(id);

		this.name = this.addProperty('name', new DirtyValue(`3D Sprite ${id}`));
		this.modelId = this.addProperty('modelId', new IntValue());
		this.coordinates = this.addProperty('coordinates', new Vector3());
		this.scale = this.addProperty('scale', new Vector3(1,1,1));
		this.primaryMaterialId = this.addProperty('primaryMaterialId', new IntValue());
		this.secondaryMaterialId = this.addProperty('secondaryMaterialId', new IntValue());
		this.blocks = this.addProperty('blocks', new ModelNodeCollection(() => new BlockModel()));
	}

}
