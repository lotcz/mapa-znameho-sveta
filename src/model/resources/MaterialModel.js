import DirtyValue from "../basic/DirtyValue";
import IdentifiedModelNode from "../basic/IdentifiedModelNode";
import NullableNode from "../basic/NullableNode";
import TextureModel from "./TextureModel";

export default class MaterialModel extends IdentifiedModelNode {

	/**
	 * @type DirtyValue
	 */
	threeType;

	/**
	 * @type DirtyValue
	 */
	color;

	/**
	 * @type NullableNode
	 */
	texture;

	constructor(id, name) {
		super(id, name);

		this.threeType = this.addProperty('threeType', new DirtyValue('MeshBasicMaterial'));
		this.color = this.addProperty('color', new DirtyValue('#700000'));
		this.texture = this.addProperty('texture', new NullableNode(() => new TextureModel()));
	}

}
