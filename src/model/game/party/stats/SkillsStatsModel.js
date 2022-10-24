import ModelNode from "../../../basic/ModelNode";
import StatModel from "./StatModel";
import {
	STAT_EVASION,
	STAT_HUNTING,
	STAT_MELEE_WEAPONS,
	STAT_MISSILE_WEAPONS,
	STAT_THROWN_WEAPONS
} from "./StatDefinitionModel";
import ModelNodeCollection from "../../../basic/ModelNodeCollection";

export default class SkillsStatsModel extends ModelNode {

	/**
	 * @type ModelNodeCollection<StatModel>
	 */
	all;

	/**
	 * @type StatModel
	 */
	meleeWeapons;

	/**
	 * @type StatModel
	 */
	thrownWeapons;

	/**
	 * @type StatModel
	 */
	missileWeapons;

	/**
	 * @type StatModel
	 */
	evasion;

	/**
	 * @type StatModel
	 */
	hunting;

	constructor() {
		super();

		this.all = this.addProperty('all', new ModelNodeCollection(null, false));

		this.meleeWeapons = this.addProperty('meleeWeapons', new StatModel(STAT_MELEE_WEAPONS));
		this.all.add(this.meleeWeapons);

		this.thrownWeapons = this.addProperty('thrownWeapons', new StatModel(STAT_THROWN_WEAPONS));
		this.all.add(this.thrownWeapons);

		this.missileWeapons = this.addProperty('missileWeapons', new StatModel(STAT_MISSILE_WEAPONS));
		this.all.add(this.missileWeapons);

		this.evasion = this.addProperty('evasion', new StatModel(STAT_EVASION));
		this.all.add(this.evasion);

		this.hunting = this.addProperty('hunting', new StatModel(STAT_HUNTING));
		this.all.add(this.hunting);
	}

}
