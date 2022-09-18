import Vector2 from "../../basic/Vector2";
import Vector3 from "../../basic/Vector3";
import IdentifiedModelNode from "../../basic/IdentifiedModelNode";
import DirtyValue from "../../basic/DirtyValue";
import ModelNodeCollection from "../../basic/ModelNodeCollection";
import BlockModel from "./BlockModel";

export default class SpriteModel extends IdentifiedModelNode {

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
	coordinates;

	/**
	 * @type Vector2
	 */
	size;

	/**
	 * @type ModelNodeCollection
	 */
	blocks;

	constructor(id) {
		super(id);

		this.name = this.addProperty('name', new DirtyValue(`Sprite ${id}`));
		this.uri = this.addProperty('uri', new DirtyValue('img/texture/dirt.png'));
		this.coordinates = this.addProperty('coordinates', new Vector3());
		this.size = this.addProperty('size', new Vector2());
		this.blocks = this.addProperty('blocks', new ModelNodeCollection(() => new BlockModel()));
	}

}
