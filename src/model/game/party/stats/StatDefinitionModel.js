import DirtyValue from "../../../basic/DirtyValue";
import IdentifiedModelNode from "../../../basic/IdentifiedModelNode";
import IntValue from "../../../basic/IntValue";

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

// other
export const STAT_ITEM_CONDITION = 1001;

export default class StatDefinitionModel extends IdentifiedModelNode {

	/**
	 * @type DirtyValue
	 */
	name;

	/**
	 * @type DirtyValue
	 */
	description;

	/**
	 * @type IntValue
	 */
	max;

	constructor(id) {
		super(id);

		this.name = this.addProperty('name', new DirtyValue(`Stat ${id}`));
		this.description = this.addProperty('description', new DirtyValue('description'));
		this.max = this.addProperty('max', new IntValue(10));
	}

}
