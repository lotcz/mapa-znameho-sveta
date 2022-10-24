import ControllerNode from "../../../basic/ControllerNode";
import CollectionController from "../../../basic/CollectionController";
import SkillController from "./SkillController";
import HealthStatController from "./HealthStatController";
import StaminaStatController from "./StaminaStatController";
import DefenseChanceStatController from "./DefenseChanceStatController";

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
		this.addChild(new DefenseChanceStatController(this.game, this.model.combat.defensiveChance, this.model));

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
