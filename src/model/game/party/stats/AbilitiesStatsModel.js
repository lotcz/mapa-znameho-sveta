import ModelNode from "../../../basic/ModelNode";
import StatModel from "./StatModel";
import {
	STAT_AGILITY,
	STAT_SMARTNESS,
	STAT_STRENGTH,
	STAT_TOUGHNESS,
	STAT_WILLPOWER,
	STAT_WISDOM
} from "./StatDefinitionModel";
import ModelNodeCollection from "../../../basic/ModelNodeCollection";

export default class AbilitiesStatsModel extends ModelNode {

	/**
	 * @type ModelNodeCollection<StatModel>
	 */
	all;

	/**
	 * @type StatModel
	 */
	strength;

	/**
	 * @type StatModel
	 */
	agility;

	/**
	 * @type StatModel
	 */
	toughness;

	/**
	 * @type StatModel
	 */
	smartness;

	/**
	 * @type StatModel
	 */
	wisdom;

	/**
	 * @type StatModel
	 */
	willpower;

	constructor() {
		super();

		this.all = this.addProperty('all', new ModelNodeCollection(null, false));

		this.strength = this.addProperty('strength', new StatModel(STAT_STRENGTH));
		this.all.add(this.strength);

		this.agility = this.addProperty('agility', new StatModel(STAT_AGILITY));
		this.all.add(this.agility);

		this.toughness = this.addProperty('toughness', new StatModel(STAT_TOUGHNESS));
		this.all.add(this.toughness);

		this.smartness = this.addProperty('smartness', new StatModel(STAT_SMARTNESS));
		this.all.add(this.smartness);

		this.wisdom = this.addProperty('wisdom', new StatModel(STAT_WISDOM));
		this.all.add(this.wisdom);

		this.willpower = this.addProperty('willpower', new StatModel(STAT_WILLPOWER));
		this.all.add(this.willpower);
	}

}
