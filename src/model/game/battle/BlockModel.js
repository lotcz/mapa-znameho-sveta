import Vector2 from "../../basic/Vector2";
import ModelNode from "../../basic/ModelNode";

export default class BlockModel extends ModelNode {

	/**
	 * @type Vector2
	 */
	position;

	constructor() {
		super();

		this.position = this.addProperty('position', new Vector2());

	}

}
