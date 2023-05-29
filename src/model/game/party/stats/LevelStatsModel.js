import ModelNode from "../../../basic/ModelNode";
import IntValue from "../../../basic/IntValue";
import StatModel from "./StatModel";
import {STAT_ABILITY_POINTS, STAT_LEVEL_PROGRESS, STAT_SKILL_POINTS} from "./StatDefinitionModel";

export default class LevelStatsModel extends ModelNode {

	/**
	 * @type IntValue
	 */
	currentLevel;

	/**
	 * @type StatModel
	 */
	levelProgress;

	/**
	 * @type IntValue
	 */
	experience;

	/**
	 * @type IntValue
	 */
	experienceNextLevel;

	/**
	 * @type StatModel
	 */
	abilityPoints;

	/**
	 * @type StatModel
	 */
	skillPoints;

	constructor() {
		super();

		this.currentLevel = this.addProperty('currentLevel', new IntValue(0));

		this.experience = this.addProperty('experience', new IntValue(0));
		this.experienceNextLevel = this.addProperty('experienceNextLevel', new IntValue(0));

		this.abilityPoints = this.addProperty('abilityPoints', new StatModel(STAT_ABILITY_POINTS, 0));
		this.skillPoints = this.addProperty('skillPoints', new StatModel(STAT_SKILL_POINTS, 0));

		this.levelProgress = this.addProperty('levelProgress', new StatModel(STAT_LEVEL_PROGRESS, 0, false));

		this.experience.addOnChangeListener(() => this.updateLevelProgress());
		this.currentLevel.addOnChangeListener(() => this.updateLevelProgress());
	}

	gainExperience(exp) {
		this.experience.increase(exp);
	}

	gainLevel(level) {
		this.currentLevel.set(level);
		this.abilityPoints.baseValue.increase(LevelStatsModel.getLevelAbilityPoints(level));
		this.skillPoints.baseValue.increase(LevelStatsModel.getLevelSkillPoints(level));
		this.triggerEvent('level-up', level);
	}

	updateLevelProgress() {
		const currentReq = LevelStatsModel.getLevelExperienceRequirement(this.currentLevel.get());
		const nextReq = LevelStatsModel.getLevelExperienceRequirement(this.currentLevel.get() + 1)
		this.experienceNextLevel.set(nextReq);
		//debugger;
		const req = nextReq - currentReq;
		const current = this.experience.get() - currentReq;
		this.levelProgress.baseValue.set(req);
		this.levelProgress.currentFloat.set(current);
		if (this.levelProgress.getProgress() >= 1) {
			this.gainLevel(this.currentLevel.get() + 1);
		}
	}

	static getLevelExperienceRequirement(level) {
		if (level <= 0) return 0;
		return Math.pow(level - 1, 2) * 500;
	}

	static getLevelAbilityPoints(level) {
		if (level === 1) return 3;
		return (level % 5 === 0) ? 1 : 0;
	}

	static getLevelSkillPoints(level) {
		if (level === 1) return 3;
		return Math.ceil(level / 5);
	}

}
