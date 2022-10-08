import DirtyValue from "../../../basic/DirtyValue";
import IdentifiedModelNode from "../../../basic/IdentifiedModelNode";
import IntValue from "../../../basic/IntValue";

// stats
export const STAT_HEALTH = 1;
export const STAT_PHYSICAL = 2;
export const STAT_MENTAL = 3;

// abilities
export const STAT_STRENGTH = 11;

// skills
export const STAT_MELEE_WEAPONS = 101;

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
