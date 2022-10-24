import ModelNode from "../../../basic/ModelNode";
import StatModel from "./StatModel";
import {STAT_HEALTH, STAT_STAMINA} from "./StatDefinitionModel";
import ModelNodeCollection from "../../../basic/ModelNodeCollection";

export default class BasicStatsModel extends ModelNode {

	/**
	 * @type ModelNodeCollection<StatModel>
	 */
	all;

	/**
	 * @type StatModel
	 */
	health;

	/**
	 * @type StatModel
	 */
	stamina;

	constructor() {
		super();

		this.all = this.addProperty('all', new ModelNodeCollection(null, false));

		this.health = this.addProperty('health', new StatModel(STAT_HEALTH));
		this.all.add(this.health);

		this.stamina = this.addProperty('stamina', new StatModel(STAT_STAMINA));
		this.all.add(this.stamina);

	}

}
