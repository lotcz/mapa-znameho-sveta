import ModelNode from "../../../basic/ModelNode";
import StatModel from "./StatModel";
import {STAT_HUNGER, STAT_TEMPERATURE, STAT_THIRST} from "./StatDefinitionModel";
import ModelNodeCollection from "../../../basic/ModelNodeCollection";

export default class ConsumptionStatsModel extends ModelNode {

	/**
	 * @type ModelNodeCollection<StatModel>
	 */
	all;

	/**
	 * @type StatModel
	 */
	hunger;

	/**
	 * @type StatModel
	 */
	thirst;

	/**
	 * @type StatModel
	 */
	temperature;

	constructor() {
		super();

		this.all = this.addProperty('all', new ModelNodeCollection(null, false));

		this.hunger = this.addProperty('hunger', new StatModel(STAT_HUNGER));
		this.all.add(this.hunger);

		this.thirst = this.addProperty('thirst', new StatModel(STAT_THIRST));
		this.all.add(this.thirst);

		this.temperature = this.addProperty('temperature', new StatModel(STAT_TEMPERATURE));
		this.all.add(this.temperature);
	}

}
