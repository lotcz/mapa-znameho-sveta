import ModelNode from "../../basic/ModelNode";
import StatModel from "./StatModel";

export default class CharacterStatsModel extends ModelNode {

	/**
	 * @type StatModel
	 */
	health;

	constructor() {
		super();

		this.health = this.addProperty('health', new StatModel());

	}

}
