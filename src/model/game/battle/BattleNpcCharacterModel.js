import BoolValue from "../../basic/BoolValue";
import BattleCharacterModel from "./BattleCharacterModel";

export default class BattleNpcCharacterModel extends BattleCharacterModel {

	/**
	 * @type BoolValue
	 */
	isAggressive;

	constructor() {
		super();

		this.isAggressive = this.addProperty('isAggressive', new BoolValue(false));

	}

}
