import ModelNode from "../../../basic/ModelNode";
import Vector2 from "../../../basic/Vector2";
import IntValue from "../../../basic/IntValue";

export default class BattleNpcSpawnModel extends ModelNode {

	/**
	 * @type Vector2
	 */
	position;

	/**
	 * @type IntValue
	 */
	characterTemplateId;

	constructor() {
		super();

		this.position = this.addProperty('position', new Vector2());
		this.characterTemplateId = this.addProperty('characterTemplateId', new IntValue());
	}

	getResourcesForPreload() {
		return [`chp/${this.characterTemplateId.toString()}`];
	}
}
