import ModelNode from "../../../basic/ModelNode";
import Vector2 from "../../../basic/Vector2";
import IntValue from "../../../basic/IntValue";

export default class BattleMapItemModel extends ModelNode {

	/**
	 * @type Vector2
	 */
	position;

	/**
	 * @type IntValue
	 */
	itemDefId;

	constructor() {
		super();

		this.position = this.addProperty('position', new Vector2());
		this.itemDefId = this.addProperty('itemDefId', new IntValue());
	}

}
