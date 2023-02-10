import ModelNode from "../../../basic/ModelNode";
import StatModel from "./StatModel";
import {
	STAT_COOKING,
	STAT_CRAFTSMANSHIP,
	STAT_EVASION,
	STAT_HERBALISM,
	STAT_HUNTING,
	STAT_LESAN,
	STAT_MELEE_WEAPONS,
	STAT_MISSILE_WEAPONS,
	STAT_MORANA,
	STAT_PERUN,
	STAT_SCIENTIA,
	STAT_THROWN_WEAPONS,
	STAT_TRADING,
	STAT_VODAN,
	STAT_ZIVA
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

		this.craftsmanship = this.addProperty('craftsmanship', new StatModel(STAT_CRAFTSMANSHIP));
		this.all.add(this.craftsmanship);

		this.cooking = this.addProperty('cooking', new StatModel(STAT_COOKING));
		this.all.add(this.cooking);

		this.herbalism = this.addProperty('herbalism', new StatModel(STAT_HERBALISM));
		this.all.add(this.herbalism);

		this.trading = this.addProperty('trading', new StatModel(STAT_TRADING));
		this.all.add(this.trading);

		this.perun = this.addProperty('perun', new StatModel(STAT_PERUN));
		this.all.add(this.perun);

		this.lesan = this.addProperty('lesan', new StatModel(STAT_LESAN));
		this.all.add(this.lesan);

		this.vodan = this.addProperty('vodan', new StatModel(STAT_VODAN));
		this.all.add(this.vodan);

		this.ziva = this.addProperty('ziva', new StatModel(STAT_ZIVA));
		this.all.add(this.ziva);

		this.morana = this.addProperty('morana', new StatModel(STAT_MORANA));
		this.all.add(this.morana);

		this.scientia = this.addProperty('scientia', new StatModel(STAT_SCIENTIA));
		this.all.add(this.scientia);

	}

}
