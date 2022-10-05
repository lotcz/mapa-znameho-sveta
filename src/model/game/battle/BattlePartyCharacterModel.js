import DirtyValue from "../../basic/DirtyValue";
import BattleCharacterModel from "./BattleCharacterModel";

export default class BattlePartyCharacterModel extends BattleCharacterModel {

	/**
	 * @type DirtyValue
	 */
	something;

	constructor() {
		super();


		this.something = this.addProperty('something', new DirtyValue());

	}

}
