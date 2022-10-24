import ModelNode from "../../../basic/ModelNode";
import StatModel from "./StatModel";
import {STAT_ABILITY_POINTS, STAT_EXPERIENCE, STAT_LEVEL, STAT_SKILL_POINTS} from "./StatDefinitionModel";
import ModelNodeCollection from "../../../basic/ModelNodeCollection";

export default class LevelStatsModel extends ModelNode {

	/**
	 * @type ModelNodeCollection<StatModel>
	 */
	all;

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

		this.all = this.addProperty('all', new ModelNodeCollection(null, false));

		this.level = this.addProperty('level', new StatModel(STAT_LEVEL));
		this.all.add(this.level);

		this.experience = this.addProperty('experience', new StatModel(STAT_EXPERIENCE));
		this.all.add(this.experience);

		this.abilityPoints = this.addProperty('abilityPoints', new StatModel(STAT_ABILITY_POINTS));
		this.all.add(this.abilityPoints);

		this.skillPoints = this.addProperty('skillPoints', new StatModel(STAT_SKILL_POINTS));
		this.all.add(this.skillPoints);
	}

}
