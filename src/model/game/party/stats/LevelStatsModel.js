import ModelNode from "../../../basic/ModelNode";
import StatModel from "./StatModel";
import {STAT_ABILITY_POINTS, STAT_EXPERIENCE, STAT_LEVEL, STAT_SKILL_POINTS} from "./StatDefinitionModel";

export default class LevelStatsModel extends ModelNode {

	/**
	 * @type StatModel
	 */
	level;

	/**
	 * @type StatModel
	 */
	experience;

	/**
	 * @type StatModel
	 */
	abilityPoints;

	/**
	 * @type StatModel
	 */
	skillPoints;

	constructor() {
		super();

		this.level = this.addProperty('level', new StatModel(STAT_LEVEL));
		this.experience = this.addProperty('experience', new StatModel(STAT_EXPERIENCE));
		this.abilityPoints = this.addProperty('abilityPoints', new StatModel(STAT_ABILITY_POINTS));
		this.skillPoints = this.addProperty('skillPoints', new StatModel(STAT_SKILL_POINTS));
	}

}
