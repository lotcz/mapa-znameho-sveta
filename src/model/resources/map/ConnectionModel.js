import ModelNode from "../../basic/ModelNode";
import IntValue from "../../basic/IntValue";
import Vector2 from "../../basic/Vector2";
import BoolValue from "../../basic/BoolValue";

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
	 * @type BoolValue
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
		this.forward = this.addProperty('forward', new BoolValue(true));
		this.pathId = this.addProperty('pathId', new IntValue(0));

	}

}
