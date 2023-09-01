import BattleCharacterModel from "./BattleCharacterModel";
import Vector2 from "../../basic/Vector2";

export default class BattleNpcCharacterModel extends BattleCharacterModel {

	/**
	 * @type Vector2
	 */
	homePosition;

	constructor() {
		super();

		this.homePosition = this.addProperty('homePosition', new Vector2());
	}

}
