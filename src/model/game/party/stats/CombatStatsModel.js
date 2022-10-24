import ModelNode from "../../../basic/ModelNode";
import StatModel from "./StatModel";
import {
	STAT_ACTION_POINTS,
	STAT_DEFENSIVE_CHANCE,
	STAT_DEFENSIVE_POWER,
	STAT_OFFENSIVE_CHANCE,
	STAT_OFFENSIVE_POWER
} from "./StatDefinitionModel";
import ModelNodeCollection from "../../../basic/ModelNodeCollection";

export default class CombatStatsModel extends ModelNode {

	/**
	 * @type ModelNodeCollection<StatModel>
	 */
	all;

	/**
	 * @type StatModel
	 */
	actionPoints;

	/**
	 * @type StatModel
	 */
	offensiveChance;

	/**
	 * @type StatModel
	 */
	offensivePower;

	/**
	 * @type StatModel
	 */
	defensiveChance;

	/**
	 * @type StatModel
	 */
	defensivePower;

	constructor() {
		super();

		this.all = this.addProperty('all', new ModelNodeCollection(null, false));

		this.actionPoints = this.addProperty('actionPoints', new StatModel(STAT_ACTION_POINTS));
		this.all.add(this.actionPoints);

		this.offensiveChance = this.addProperty('offensiveChance', new StatModel(STAT_OFFENSIVE_CHANCE));
		this.all.add(this.offensiveChance);

		this.offensivePower = this.addProperty('offensivePower', new StatModel(STAT_OFFENSIVE_POWER));
		this.all.add(this.offensivePower);

		this.defensiveChance = this.addProperty('defensiveChance', new StatModel(STAT_DEFENSIVE_CHANCE));
		this.all.add(this.defensiveChance);

		this.defensivePower = this.addProperty('defensivePower', new StatModel(STAT_DEFENSIVE_POWER));
		this.all.add(this.defensivePower);
	}

}
