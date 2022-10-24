import ModelNode from "../../../basic/ModelNode";
import ModelNodeCollection from "../../../basic/ModelNodeCollection";
import BasicStatsModel from "./BasicStatsModel";
import LevelStatsModel from "./LevelStatsModel";
import ConsumptionStatsModel from "./ConsumptionStatsModel";
import CombatStatsModel from "./CombatStatsModel";
import AbilitiesStatsModel from "./AbilitiesStatsModel";
import SkillsStatsModel from "./SkillsStatsModel";

export default class CharacterStatsModel extends ModelNode {

	/**
	 * @type LevelStatsModel
	 */
	levelProgress;

	/**
	 * @type BasicStatsModel
	 */
	basic;

	/**
	 * @type ConsumptionStatsModel
	 */
	consumption;

	/**
	 * @type AbilitiesStatsModel
	 */
	abilities;

	/**
	 * @type SkillsStatsModel
	 */
	skills;

	/**
	 * @type ModelNodeCollection<StatEffectDefinitionModel>
	 */
	statEffects;

	constructor() {
		super();

		this.levelProgress = this.addProperty('levelProgress', new LevelStatsModel());
		this.basic = this.addProperty('basic', new BasicStatsModel());
		this.consumption = this.addProperty('consumption', new ConsumptionStatsModel());
		this.combat = this.addProperty('combat', new CombatStatsModel());
		this.abilities = this.addProperty('abilities', new AbilitiesStatsModel());
		this.skills = this.addProperty('skills', new SkillsStatsModel());

		this.statEffects = this.addProperty('statEffects', new ModelNodeCollection(null, false));
	}

}
