import ModelNode from "../../../basic/ModelNode";
import IntValue from "../../../basic/IntValue";
import StatModel from "./StatModel";
import {STAT_LEVEL_PROGRESS} from "./StatDefinitionModel";

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
	abilityPoints;

	/**
	 * @type IntValue
	 */
	skillPoints;

	constructor() {
		super();

		this.currentLevel = this.addProperty('currentLevel', new IntValue(0));
		this.experience = this.addProperty('experience', new IntValue(0));

		this.abilityPoints = this.addProperty('abilityPoints', new IntValue(0));
		this.skillPoints = this.addProperty('skillPoints', new IntValue(0));

		this.levelProgress = this.addProperty('levelProgress', new StatModel(STAT_LEVEL_PROGRESS, 1, false));
		this.experience.addOnChangeListener(() => this.updateLevelProgress());
	}

	gainExperience(exp) {
		this.experience.increase(exp);
		if (this.levelProgress.getProgress() > 1) {
			this.gainLevel(this.currentLevel.get() + 1);
		}
	}

	gainLevel(level) {
		this.currentLevel.set(level);
		this.abilityPoints.increase(LevelStatsModel.getLevelAbilityPoints(level));
		this.skillPoints.increase(LevelStatsModel.getLevelSkillPoints(level));
		this.updateLevelProgress();
	}

	updateLevelProgress() {
		if (this.currentLevel.equalsTo(0)) return;
		const currentReq = LevelStatsModel.getLevelExperienceRequirement(this.currentLevel.get());
		const nextReq = LevelStatsModel.getLevelExperienceRequirement(this.currentLevel.get() + 1)
		const req = nextReq - currentReq;
		const current = this.experience.get() - currentReq;
		this.levelProgress.currentFloat.set(current/req);
	}

	static getLevelExperienceRequirement(level) {
		return Math.pow(level, 2) * 500;
	}

	static getLevelAbilityPoints(level) {
		if (level === 1) return 6;
		return (level % 5 === 0) ? 1 : 0;
	}

	static getLevelSkillPoints(level) {
		if (level === 1) return 3;
		return Math.ceil(level / 5);
	}

}
