import ControllerNode from "../../../basic/ControllerNode";
import CollectionController from "../../../basic/CollectionController";
import SkillController from "./SkillController";
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

		this.addChild(new HealthStatController(this.game, this.model.basic.health, this.model));
		this.addChild(new StaminaStatController(this.game, this.model.basic.stamina, this.model));

		this.addChild(new ActionPointsStatController(this.game, this.model.combat.actionPoints, this.model));

		this.addChild(new DefenseChanceStatController(this.game, this.model.combat.defensiveChance, this.model));
		this.addChild(new DefensePowerStatController(this.game, this.model.combat.defensivePower, this.model));

		this.addChild(new AttackChanceStatController(this.game, this.model.combat.offensiveChance, this.model));
		this.addChild(new AttackPowerStatController(this.game, this.model.combat.offensivePower, this.model));

		this.addChild(new TemperatureStatController(this.game, this.model.consumption.temperature, this.model));
		this.addChild(new SkillController(this.game, this.model.consumption.temperature, this.model));

		this.addChild(
			new CollectionController(
				this.game,
				this.model.combat.all,
				(m) => new SkillController(this.game, m, this.model)
			)
		);

		this.addChild(
			new CollectionController(
				this.game,
				this.model.abilities.all,
				(m) => new SkillController(this.game, m, this.model)
			)
		);

		this.addChild(
			new CollectionController(
				this.game,
				this.model.skills.all,
				(m) => new SkillController(this.game, m, this.model)
			)
		);

	}

}
