import BoolValue from "../../basic/BoolValue";
import BattleCharacterModel from "./BattleCharacterModel";
import Vector2 from "../../basic/Vector2";

export default class BattleNpcCharacterModel extends BattleCharacterModel {

	/**
	 * @type BoolValue
	 */
	isAggressive;

	/**
	 * @type Vector2
	 */
	homePosition;

	constructor() {
		super();

		this.isAggressive = this.addProperty('isAggressive', new BoolValue(false));

		this.homePosition = this.addProperty('homePosition', new Vector2());
	}

}
