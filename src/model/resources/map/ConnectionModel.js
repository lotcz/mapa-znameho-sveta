import DirtyValue from "../../basic/DirtyValue";
import ModelNode from "../../basic/ModelNode";
import IntValue from "../../basic/IntValue";
import Vector2 from "../../basic/Vector2";

export default class ConnectionModel extends ModelNode {

	/**
	 * @type Vector2
	 */
	direction;

	/**
	 * @type IntValue
	 */
	pathId;

	/**
	 * @type DirtyValue
	 */
	forward;

	/**
	 * @type LocationModel
	 */
	location;

	constructor(location) {
		super();

		this.location = location;

		this.direction = this.addProperty('direction', new Vector2());
		this.forward = this.addProperty('forward', new DirtyValue(true));
		this.pathId = this.addProperty('pathId', new IntValue(0));

	}

}
