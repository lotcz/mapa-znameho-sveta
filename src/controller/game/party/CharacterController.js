import CharacterStatsController from "./stats/CharacterStatsController";
import ControllerWithSaveGame from "../../basic/ControllerWithSaveGame";

export default class CharacterController extends ControllerWithSaveGame {

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
			this.model.raceId,
			'change',
			() => this.model.race.set(this.game.resources.races.getById(this.model.raceId.get())),
			true
		);

		this.addAutoEvent(
			this.model.race,
			'change',
			() =>{
				const race = this.model.race.get();
				this.model.stats.raceStatEffects.reset();
				race.statEffects.forEach((eff) => {
					this.model.stats.raceStatEffects.add(eff);
				});
			},
			true
		);

		this.addAutoEvent(
			this.model.inventory,
			'item-changed',
			() => this.updateInventoryEffects(),
			true
		);

		this.addAutoEvent(
			this.saveGame.time,
			'time-passed',
			(duration) => {
				if (!(duration > 0)) return;
				if (this.saveGame.partyResting.get() > 0) {
					this.model.stats.basic.stamina.restore(duration * 5);
					this.model.stats.basic.health.restore(duration);
					this.model.stats.consumption.hunger.consume(duration * 0.25);
					this.model.stats.consumption.thirst.consume(duration * 0.25);
				} else {
					this.model.stats.basic.stamina.consume(duration * 5);
					this.model.stats.consumption.hunger.consume(duration);
					this.model.stats.consumption.thirst.consume(duration * 1.5);
				}
			}
		);
	}

	updateInventoryEffects() {
		const slots = [this.model.inventory.leftHand, this.model.inventory.rightHand, this.model.inventory.body, this.model.inventory.hips, this.model.inventory.feet, this.model.inventory.head];
		const items = [];
		slots.forEach((slot) => {
			if (slot.item.isSet()) {
				items.push(slot.item.get());
			}
		});
		this.model.stats.inventoryStatEffects.reset();
		items.forEach((item) => {
			const def = this.game.resources.itemDefinitions.getById(item.definitionId.get());
			if (def) {
				def.statEffects.forEach((eff) => this.model.stats.inventoryStatEffects.add(eff));
			}
		});
	}

}
