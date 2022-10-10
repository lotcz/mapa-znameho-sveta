import ControllerNode from "../../basic/ControllerNode";
import CollectionController from "../../basic/CollectionController";
import SkillController from "./SkillController";
import HealthStatController from "./HealthStatController";
import StaminaStatController from "./StaminaStatController";
import DefenseChanceStatController from "./DefenseChanceStatController";

export default class CharacterController extends ControllerNode {

	/**
	 * @type CharacterModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

		this.addChild(
			new CollectionController(
				this.game,
				this.model.stats.skills,
				(m) => new SkillController(this.game, m, this.model)
			)
		);

		this.addChild(
			new CollectionController(
				this.game,
				this.model.stats.abilities,
				(m) => new SkillController(this.game, m, this.model)
			)
		);

		this.addChild(
			new CollectionController(
				this.game,
				this.model.stats.combat,
				(m) => new SkillController(this.game, m, this.model)
			)
		);

		this.addChild(new HealthStatController(this.game, this.model.stats.health, this.model));
		this.addChild(new StaminaStatController(this.game, this.model.stats.stamina, this.model));
		this.addChild(new DefenseChanceStatController(this.game, this.model.stats.defensiveChance, this.model));

		this.addAutoEvent(
			this.model.inventory,
			'item-changed',
			() => this.updateInventoryEffects(),
			true
		);
	}

	updateInventoryEffects() {
		const slots = [this.model.inventory.leftHand, this.model.inventory.rightHand, this.model.inventory.clothing, this.model.inventory.head];
		const items = [];
		slots.forEach((slot) => {
			if (slot.item.isSet()) {
				items.push(slot.item.get());
			}
		});
		this.model.statEffects.reset();
		items.forEach((item) => {
			item.statEffects.forEach((eff) => this.model.statEffects.add(eff));
			const def = this.game.resources.itemDefinitions.getById(item.definitionId.get());
			if (def) {
				def.statEffects.forEach((eff) => this.model.statEffects.add(eff));
			}
		});
	}

}
