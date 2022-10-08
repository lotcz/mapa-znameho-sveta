import ModelNode from "../../../basic/ModelNode";
import StatModel from "../stats/StatModel";
import {STAT_HEALTH, STAT_MELEE_WEAPONS, STAT_MENTAL, STAT_PHYSICAL, STAT_STRENGTH} from "../stats/StatDefinitionModel";

export default class CharacterStatsModel extends ModelNode {

	/**
	 * @type StatModel
	 */
	health;

	/**
	 * @type StatModel
	 */
	physical;

	/**
	 * @type StatModel
	 */
	mental;

	/**
	 * @type StatModel
	 */
	strength;

	/**
	 * @type StatModel
	 */
	meleeWeapons;

	constructor() {
		super();

		this.stats = [];
		this.stats[STAT_HEALTH] = this.health = this.addProperty('health', new StatModel(STAT_HEALTH));
		this.stats[STAT_PHYSICAL] = this.physical = this.addProperty('physical', new StatModel(STAT_PHYSICAL));
		this.stats[STAT_MENTAL] = this.mental = this.addProperty('mental', new StatModel(STAT_MENTAL));

		this.stats[STAT_STRENGTH] = this.strength = this.addProperty('strength', new StatModel(STAT_STRENGTH));

		this.stats[STAT_MELEE_WEAPONS] = this.meleeWeapons = this.addProperty('meleeWeapons', new StatModel(STAT_MELEE_WEAPONS));

	}

}
