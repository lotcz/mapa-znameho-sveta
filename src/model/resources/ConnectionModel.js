import DirtyValue from "../basic/DirtyValue";
import ModelNode from "../basic/ModelNode";
import IntValue from "../basic/IntValue";

export const DIRECTION_NORTH = 'north';
export const DIRECTION_SOUTH = 'south';

export default class ConnectionModel extends ModelNode {

	/**
	 * @type DirtyValue
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

	constructor() {
		super();

		this.direction = this.addProperty('direction', new DirtyValue(DIRECTION_NORTH));
		this.forward = this.addProperty('forward', new DirtyValue(true));
		this.pathId = this.addProperty('pathId', new IntValue(0));
	}

}
