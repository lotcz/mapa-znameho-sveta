import ModelNode from "../../basic/ModelNode";
import StatFloatModel from "./StatFloatModel";
import StatIntModel from "./StatIntModel";
import {HEALTH_STAT, MELEE_WEAPONS_STAT, MENTAL_STAT, PHYSICAL_STAT, STRENGTH_STAT} from "./StatDefinitionModel";

export default class CharacterStatsModel extends ModelNode {

	/**
	 * @type StatFloatModel
	 */
	health;

	/**
	 * @type StatFloatModel
	 */
	physical;

	/**
	 * @type StatFloatModel
	 */
	mental;

	/**
	 * @type StatIntModel
	 */
	strength;


	/**
	 * @type StatIntModel
	 */
	meleeWeapons;

	constructor() {
		super();

		this.health = this.addProperty('health', new StatFloatModel(HEALTH_STAT));
		this.physical = this.addProperty('physical', new StatFloatModel(PHYSICAL_STAT));
		this.mental = this.addProperty('mental', new StatFloatModel(MENTAL_STAT));

		this.strength = this.addProperty('strength', new StatIntModel(STRENGTH_STAT));

		this.meleeWeapons = this.addProperty('meleeWeapons', new StatIntModel(MELEE_WEAPONS_STAT));

	}

}
