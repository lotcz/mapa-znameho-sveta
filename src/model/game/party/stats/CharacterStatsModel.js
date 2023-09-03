import ModelNode from "../../../basic/ModelNode";
import ModelNodeCollection from "../../../basic/ModelNodeCollection";
import BasicStatsModel from "./BasicStatsModel";
import LevelStatsModel from "./LevelStatsModel";
import ConsumptionStatsModel from "./ConsumptionStatsModel";
import CombatStatsModel from "./CombatStatsModel";
import AbilitiesStatsModel from "./AbilitiesStatsModel";
import SkillsStatsModel from "./SkillsStatsModel";
import EffectSourceModel, {EFFECT_SOURCE_RITUAL} from "../rituals/EffectSourceModel";
import StatModel from "./StatModel";
import {SYMPATHY_TOWARDS_PARTY} from "./StatDefinitionModel";
import BoolValue from "../../../basic/BoolValue";

export default class CharacterStatsModel extends ModelNode {

	/**
	 * @type StatModel
	 */
	sympathyTowardsParty;

	/**
	 * @type BoolValue
	 */
	isAggressive;

	/**
	 * @type LevelStatsModel
	 */
	level;

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
	inventoryStatEffects;

	/**
	 * @type ModelNodeCollection<StatEffectDefinitionModel>
	 */
	environmentStatEffects;

	/**
	 * @type ModelNodeCollection<StatEffectDefinitionModel>
	 */
	raceStatEffects;

	/**
	 * @type ModelNodeCollection<StatEffectDefinitionModel>
	 */
	temporaryLevelUpEffects;

	/**
	 * @type EffectSourceModel
	 */
	levelUpEffectSource;

	/**
	 * @type ModelNodeCollection<StatEffectDefinitionModel>[]
	 */
	effectSources;

	constructor() {
		super();

		this.sympathyTowardsParty = this.addProperty('sympathyTowardsParty', new StatModel(SYMPATHY_TOWARDS_PARTY, 1));
		this.isAggressive = this.addProperty('isAggressive', new BoolValue(false));
		this.sympathyTowardsParty.currentFloat.addEventListener('change', () => this.isAggressive.set(this.sympathyTowardsParty.currentFloat.get() < 0.5));

		this.level = this.addProperty('level', new LevelStatsModel());
		this.basic = this.addProperty('basic', new BasicStatsModel());
		this.consumption = this.addProperty('consumption', new ConsumptionStatsModel());
		this.combat = this.addProperty('combat', new CombatStatsModel());
		this.abilities = this.addProperty('abilities', new AbilitiesStatsModel());
		this.skills = this.addProperty('skills', new SkillsStatsModel());

		this.inventoryStatEffects = this.addProperty('inventoryStatEffects', new ModelNodeCollection(null, false));
		this.environmentStatEffects = this.addProperty('environmentStatEffects', new ModelNodeCollection(null, false));
		this.raceStatEffects = this.addProperty('raceStatEffects', new ModelNodeCollection(null, false));

		this.temporaryLevelUpEffects = this.addProperty('temporaryLevelUpEffects', new ModelNodeCollection(null, false));

		this.levelUpEffectSource = new EffectSourceModel(EFFECT_SOURCE_RITUAL);
		this.levelUpEffectSource.name.set('Toto se můžeš naučit');

		this.effectSources = [this.inventoryStatEffects, this.environmentStatEffects, this.raceStatEffects, this.temporaryLevelUpEffects];
	}

}
