import DirtyValue from "../../../basic/DirtyValue";
import IdentifiedModelNode from "../../../basic/IdentifiedModelNode";

// abilities
export const STRENGTH_STAT = 1;

// skills
export const MELEE_WEAPONS_STAT = 11;

// stats
export const HEALTH_STAT = 101;
export const PHYSICAL_STAT = 102;
export const MENTAL_STAT = 103;

export default class StatDefinitionModel extends IdentifiedModelNode {

	/**
	 * @type DirtyValue
	 */
	name;

	/**
	 * @type DirtyValue
	 */
	description;

	constructor(name = '') {
		super();

		this.name = this.addProperty('name', new DirtyValue(name));
		this.description = this.addProperty('description', new DirtyValue('description'));
	}

}
