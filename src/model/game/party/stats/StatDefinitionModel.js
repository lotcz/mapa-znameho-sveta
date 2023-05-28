import IdentifiedModelNode from "../../../basic/IdentifiedModelNode";
import IntValue from "../../../basic/IntValue";
import StringValue from "../../../basic/StringValue";

// stats
export const STAT_HEALTH = 1;
export const STAT_STAMINA = 2;
export const STAT_HUNGER = 3;
export const STAT_THIRST = 4;
export const STAT_TEMPERATURE = 5;
export const STAT_OFFENSIVE_CHANCE = 6;
export const STAT_OFFENSIVE_POWER = 7;
export const STAT_DEFENSIVE_CHANCE = 8;
export const STAT_DEFENSIVE_POWER = 9;
export const STAT_ACTION_POINTS = 10;

// abilities
export const STAT_STRENGTH = 11;
export const STAT_AGILITY = 12;
export const STAT_TOUGHNESS = 13;
export const STAT_SMARTNESS = 14;
export const STAT_WISDOM = 15;
export const STAT_WILLPOWER = 16;

// skills
export const STAT_MELEE_WEAPONS = 101;
export const STAT_THROWN_WEAPONS = 102;
export const STAT_MISSILE_WEAPONS = 103;
export const STAT_EVASION = 104;
export const STAT_HUNTING = 105;
export const STAT_CRAFTSMANSHIP = 106;
export const STAT_COOKING = 107;
export const STAT_HERBALISM = 108;
export const STAT_TRADING = 109;
export const STAT_PERUN = 110;
export const STAT_LESAN = 111;
export const STAT_VODAN = 112;
export const STAT_ZIVA = 113;
export const STAT_MORANA = 114;
export const STAT_SCIENTIA = 115;

// other
export const STAT_LEVEL_PROGRESS = 1001;
export const STAT_EXPERIENCE = 1002;
export const STAT_ABILITY_POINTS = 1003;
export const STAT_SKILL_POINTS = 1004;

export const STAT_ITEM_CONDITION = 2000;

export default class StatDefinitionModel extends IdentifiedModelNode {

	/**
	 * @type StringValue
	 */
	name;

	/**
	 * @type StringValue
	 */
	description;

	/**
	 * @type IntValue
	 */
	max;

	constructor(id) {
		super(id);

		this.name = this.addProperty('name', new StringValue(`Stat ${id}`));
		this.description = this.addProperty('description', new StringValue('description'));
		this.max = this.addProperty('max', new IntValue(10));
	}

}
