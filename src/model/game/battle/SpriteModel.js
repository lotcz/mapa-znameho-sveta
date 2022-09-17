import Vector2 from "../../basic/Vector2";
import BoolValue from "../../basic/BoolValue";
import Vector3 from "../../basic/Vector3";
import IdentifiedModelNode from "../../basic/IdentifiedModelNode";
import DirtyValue from "../../basic/DirtyValue";

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
	 * @type BoolValue
	 */
	isBlocking;

	constructor(id) {
		super(id);

		this.name = this.addProperty('name', new DirtyValue(`Sprite ${id}`));
		this.uri = this.addProperty('uri', new DirtyValue('img/texture/dirt.png'));
		this.coordinates = this.addProperty('coordinates', new Vector3());
		this.size = this.addProperty('size', new Vector2());
		this.isBlocking = this.addProperty('isBlocking', new BoolValue(true));

	}

}
