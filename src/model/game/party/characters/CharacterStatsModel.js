import ModelNode from "../../../basic/ModelNode";
import StatModel from "../stats/StatModel";
import {
	STAT_ACTION_POINTS,
	STAT_AGILITY,
	STAT_DEFENSIVE_CHANCE,
	STAT_DEFENSIVE_POWER,
	STAT_EVASION,
	STAT_HEALTH,
	STAT_HUNGER,
	STAT_HUNTING,
	STAT_MELEE_WEAPONS,
	STAT_MISSILE_WEAPONS,
	STAT_OFFENSIVE_CHANCE,
	STAT_OFFENSIVE_POWER,
	STAT_SMARTNESS,
	STAT_STAMINA,
	STAT_STRENGTH,
	STAT_THIRST,
	STAT_THROWN_WEAPONS,
	STAT_TOUGHNESS,
	STAT_WILLPOWER,
	STAT_WISDOM
} from "../stats/StatDefinitionModel";
import ModelNodeCollection from "../../../basic/ModelNodeCollection";

export default class CharacterStatsModel extends ModelNode {

	/**
	 * @type ModelNodeCollection<StatModel>
	 */
	all;

	/**
	 * @type ModelNodeCollection<StatModel>
	 */
	basic;

	/**
	 * @type StatModel
	 */
	health;

	/**
	 * @type StatModel
	 */
	stamina;

	/**
	 * @type ModelNodeCollection<StatModel>
	 */
	consumption;

	/**
	 * @type StatModel
	 */
	hunger;

	/**
	 * @type StatModel
	 */
	thirst;

	/**
	 * @type ModelNodeCollection<StatModel>
	 */
	combat;

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

	/**
	 * @type StatModel
	 */
	actionPoints;

	/**
	 * @type ModelNodeCollection<StatModel>
	 */
	abilities;

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

	/**
	 * @type ModelNodeCollection<StatModel>
	 */
	skills;

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

		// BASIC
		this.basic = this.addProperty('basic', new ModelNodeCollection(null, false));

		this.health = this.addProperty('health', new StatModel(STAT_HEALTH));
		this.all.add(this.health);
		this.basic.add(this.health);

		this.stamina = this.addProperty('stamina', new StatModel(STAT_STAMINA));
		this.all.add(this.stamina);
		this.basic.add(this.stamina);

		// CONSUMPTION
		this.consumption = this.addProperty('consumption', new ModelNodeCollection(null, false));

		this.hunger = this.addProperty('hunger', new StatModel(STAT_HUNGER));
		this.all.add(this.hunger);
		this.consumption.add(this.hunger);

		this.thirst = this.addProperty('thirst', new StatModel(STAT_THIRST));
		this.all.add(this.thirst);
		this.consumption.add(this.thirst);

		// COMBAT
		this.combat = this.addProperty('combat', new ModelNodeCollection(null, false));

		this.actionPoints = this.addProperty('actionPoints', new StatModel(STAT_ACTION_POINTS));
		this.all.add(this.actionPoints);
		this.combat.add(this.actionPoints);
		
		this.offensiveChance = this.addProperty('offensiveChance', new StatModel(STAT_OFFENSIVE_CHANCE));
		this.all.add(this.offensiveChance);
		this.combat.add(this.offensiveChance);

		this.offensivePower = this.addProperty('offensivePower', new StatModel(STAT_OFFENSIVE_POWER));
		this.all.add(this.offensivePower);
		this.combat.add(this.offensivePower);

		this.defensiveChance = this.addProperty('defensiveChance', new StatModel(STAT_DEFENSIVE_CHANCE));
		this.all.add(this.defensiveChance);
		this.combat.add(this.defensiveChance);

		this.defensivePower = this.addProperty('defensivePower', new StatModel(STAT_DEFENSIVE_POWER));
		this.all.add(this.defensivePower);
		this.combat.add(this.defensivePower);

		// ABILITIES
		this.abilities = this.addProperty('abilities', new ModelNodeCollection(null, false));

		this.strength = this.addProperty('strength', new StatModel(STAT_STRENGTH));
		this.all.add(this.strength);
		this.abilities.add(this.strength);

		this.agility = this.addProperty('agility', new StatModel(STAT_AGILITY));
		this.all.add(this.agility);
		this.abilities.add(this.agility);

		this.toughness = this.addProperty('toughness', new StatModel(STAT_TOUGHNESS));
		this.all.add(this.toughness);
		this.abilities.add(this.toughness);

		this.smartness = this.addProperty('smartness', new StatModel(STAT_SMARTNESS));
		this.all.add(this.smartness);
		this.abilities.add(this.smartness);

		this.wisdom = this.addProperty('wisdom', new StatModel(STAT_WISDOM));
		this.all.add(this.wisdom);
		this.abilities.add(this.wisdom);

		this.willpower = this.addProperty('willpower', new StatModel(STAT_WILLPOWER));
		this.all.add(this.willpower);
		this.abilities.add(this.willpower);

		// SKILLS
		this.skills = this.addProperty('skills', new ModelNodeCollection(null, false));

		this.meleeWeapons = this.addProperty('meleeWeapons', new StatModel(STAT_MELEE_WEAPONS));
		this.all.add(this.meleeWeapons);
		this.skills.add(this.meleeWeapons);

		this.thrownWeapons = this.addProperty('thrownWeapons', new StatModel(STAT_THROWN_WEAPONS));
		this.all.add(this.thrownWeapons);
		this.skills.add(this.thrownWeapons);

		this.missileWeapons = this.addProperty('missileWeapons', new StatModel(STAT_MISSILE_WEAPONS));
		this.all.add(this.missileWeapons);
		this.skills.add(this.missileWeapons);

		this.evasion = this.addProperty('evasion', new StatModel(STAT_EVASION));
		this.all.add(this.evasion);
		this.skills.add(this.evasion);

		this.hunting = this.addProperty('hunting', new StatModel(STAT_HUNTING));
		this.all.add(this.hunting);
		this.skills.add(this.hunting);
	}

}
