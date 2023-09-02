import ControllerNode from "../../../basic/ControllerNode";
import CollectionController from "../../../basic/CollectionController";
import StatController from "./StatController";
import HealthStatController from "./basic/HealthStatController";
import StaminaStatController from "./basic/StaminaStatController";
import DefenseChanceStatController from "./combat/DefenseChanceStatController";
import ActionPointsStatController from "./combat/ActionPointsStatController";
import DefensePowerStatController from "./combat/DefensePowerStatController";
import AttackChanceStatController from "./combat/AttackChanceStatController";
import AttackPowerStatController from "./combat/AttackPowerStatController";
import TemperatureStatController from "./basic/TemperatureStatController";

export default class CharacterStatsController extends ControllerNode {

	/**
	 * @type CharacterStatsModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

		this.addChild(new StatController(this.game, this.model.sympathyTowardsParty, this.model));

		this.addChild(new HealthStatController(this.game, this.model.basic.health, this.model));
		this.addChild(new StaminaStatController(this.game, this.model.basic.stamina, this.model));

		this.addChild(new ActionPointsStatController(this.game, this.model.combat.actionPoints, this.model));

		this.addChild(new DefenseChanceStatController(this.game, this.model.combat.defensiveChance, this.model));
		this.addChild(new DefensePowerStatController(this.game, this.model.combat.defensivePower, this.model));

		this.addChild(new AttackChanceStatController(this.game, this.model.combat.offensiveChance, this.model));
		this.addChild(new AttackPowerStatController(this.game, this.model.combat.offensivePower, this.model));

		this.addChild(new StatController(this.game, this.model.consumption.thirst, this.model));
		this.addChild(new StatController(this.game, this.model.consumption.hunger, this.model));
		this.addChild(new TemperatureStatController(this.game, this.model.consumption.temperature, this.model));

		this.addChild(new StatController(this.game, this.model.level.experience, this.model));
		this.addChild(new StatController(this.game, this.model.level.abilityPoints, this.model));
		this.addChild(new StatController(this.game, this.model.level.skillPoints, this.model));

		this.addChild(
			new CollectionController(
				this.game,
				this.model.abilities.all,
				(m) => new StatController(this.game, m, this.model)
			)
		);

		this.addChild(
			new CollectionController(
				this.game,
				this.model.skills.all,
				(m) => new StatController(this.game, m, this.model)
			)
		);

		this.addAutoEvent(
			this.model,
			'apply-ability-points',
			() => this.applyAbilityPoints()
		);

		this.addAutoEvent(
			this.model,
			'apply-skill-points',
			() => this.applySkillPoints()
		);

		this.addAutoEvent(
			this.model,
			'reset-level-points',
			() => this.resetLevePoints()
		);

	}

	resetLevePoints() {
		this.model.temporaryLevelUpEffects.reset();
	}

	applyLevelPoints(levelStats) {
		const applied = [];
		this.model.temporaryLevelUpEffects.forEach(
			(eff) => {
				const stat = levelStats.find((s) => s.definitionId.equalsTo(eff.statId.get()));
				if (!stat) {
					console.warn(`stat ${eff.statId.get()} not found`);
					return;
				}
				stat.baseValue.increase(eff.amount.get());
				applied.push(eff);
			}
		);
		applied.forEach((eff) => this.model.temporaryLevelUpEffects.remove(eff));
	}

	applyAbilityPoints() {
		const levelStats = [];
		levelStats.push(this.model.level.abilityPoints);
		levelStats.push(...this.model.abilities.all.asArray());
		this.applyLevelPoints(levelStats);
	}

	applySkillPoints() {
		const levelStats = [];
		levelStats.push(this.model.level.skillPoints);
		levelStats.push(...this.model.skills.all.asArray());
		this.applyLevelPoints(levelStats);
	}

}
