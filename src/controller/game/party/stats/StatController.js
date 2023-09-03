import ControllerNode from "../../../basic/ControllerNode";
import Collection from "../../../../class/basic/Collection";
import StatEffectDefinitionModel from "../../../../model/game/party/rituals/StatEffectDefinitionModel";
import {STAT_ABILITY_POINTS, STAT_SKILL_POINTS} from "../../../../model/game/party/stats/StatDefinitionModel";

export default class StatController extends ControllerNode {

	/**
	 * @type StatModel
	 */
	model;

	/**
	 * @type CharacterStatsModel
	 */
	stats;

	constructor(game, model, stats) {
		super(game, model);

		this.model = model;
		this.stats = stats;

		this.cache = new Collection();

		this.addEffectHandler = (eff) => {
			if (eff.statId.equalsTo(this.model.definitionId.get())) {
				this.cache.add(eff);
			}
		};
		this.removeEffectHandler = (eff) => {
			if (eff.statId.equalsTo(this.model.definitionId.get())) {
				this.cache.remove(eff)
			}
		};

		this.addAutoEvent(
			this.model.definitionId,
			'change',
			() => this.model.definition.set(this.game.resources.statDefinitions.getById(this.model.definitionId.get())),
			true
		);

		this.addAutoEvent(
			this.cache,
			'change',
			() => this.updateCurrent()
		);

		this.addAutoEvent(
			this.model.baseValue,
			'change',
			() => this.updateCurrent(),
			true
		);

		this.addAutoEvent(
			this.model,
			'add-ability-point',
			() => {
				if (this.stats.level.abilityPoints.current.get() > 0) {
					this.addTemporaryLevelPoint(STAT_ABILITY_POINTS)
				}
			}
		);

		this.addAutoEvent(
			this.model,
			'add-skill-point',
			() => {
				if (this.stats.level.skillPoints.current.get() > 0) {
					this.addTemporaryLevelPoint(STAT_SKILL_POINTS);
				}
			}
		);

		this.addAutoEvent(
			this.model,
			'remove-ability-point',
			() => this.removeTemporaryLevelPoint(STAT_ABILITY_POINTS)
		);

		this.addAutoEvent(
			this.model,
			'remove-skill-point',
			() => this.removeTemporaryLevelPoint(STAT_SKILL_POINTS)
		);
	}

	activateInternal() {
		this.stats.effectSources.forEach((effects) => {
			effects.forEach(this.addEffectHandler);
			effects.addOnAddListener(this.addEffectHandler);
			effects.addOnRemoveListener(this.removeEffectHandler);
		});
	}

	deactivateInternal() {
		this.stats.effectSources.forEach((effects) => {
			effects.removeOnAddListener(this.addEffectHandler);
			effects.removeOnRemoveListener(this.removeEffectHandler);
		});
	}

	updateCurrent() {
		const total = this.cache.reduce((prev, current) => prev + current.amount.get(), 0);
		this.model.currentFloat.set(this.model.baseValue.get() + total);
	}

	addTemporaryLevelPoint(pointStatDefId) {
		const statEffect = new StatEffectDefinitionModel(this.stats.levelUpEffectSource);
		statEffect.statId.set(this.model.definitionId.get());
		statEffect.amount.set(1);
		this.stats.temporaryLevelUpEffects.add(statEffect);
		const pointEffect = new StatEffectDefinitionModel(this.stats.levelUpEffectSource);
		pointEffect.statId.set(pointStatDefId);
		pointEffect.amount.set(-1);
		this.stats.temporaryLevelUpEffects.add(pointEffect);
	}

	removeTemporaryLevelPoint(pointStatDefId) {
		const statEffect = this.stats.temporaryLevelUpEffects.find((eff) => eff.statId.equalsTo(this.model.definitionId.get()));
		const pointEffect = this.stats.temporaryLevelUpEffects.find((eff) => eff.statId.equalsTo(pointStatDefId));
		if (statEffect && pointEffect) {
			this.stats.temporaryLevelUpEffects.remove(pointEffect);
			this.stats.temporaryLevelUpEffects.remove(statEffect);
		}
	}

}
