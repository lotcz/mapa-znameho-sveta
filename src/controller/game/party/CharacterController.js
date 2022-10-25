import ControllerNode from "../../basic/ControllerNode";
import CharacterStatsController from "./stats/CharacterStatsController";

export default class CharacterController extends ControllerNode {

	/**
	 * @type CharacterModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

		this.addChild(
			new CharacterStatsController(
				this.game,
				this.model.stats
			)
		);

		this.addAutoEvent(
			this.model.inventory,
			'item-changed',
			() => this.updateInventoryEffects(),
			true
		);
	}

	activateInternal() {
		const race = this.game.resources.races.getById(this.model.raceId.get());
		this.model.stats.raceStatEffects.reset();
		race.statEffects.forEach((eff) => {
			this.model.stats.raceStatEffects.add(eff);
			console.log(eff);
		});
	}

	updateInventoryEffects() {
		const slots = [this.model.inventory.leftHand, this.model.inventory.rightHand, this.model.inventory.clothing, this.model.inventory.head];
		const items = [];
		slots.forEach((slot) => {
			if (slot.item.isSet()) {
				items.push(slot.item.get());
			}
		});
		this.model.stats.inventoryStatEffects.reset();
		items.forEach((item) => {
			item.statEffects.forEach((eff) => this.model.stats.inventoryStatEffects.add(eff));
			const def = this.game.resources.itemDefinitions.getById(item.definitionId.get());
			if (def) {
				def.statEffects.forEach((eff) => this.model.stats.inventoryStatEffects.add(eff));
			}
		});
	}

}
