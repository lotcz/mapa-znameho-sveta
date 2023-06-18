import CharacterStatsController from "./stats/CharacterStatsController";
import ControllerWithSaveGame from "../../basic/ControllerWithSaveGame";
import ItemModel from "../../../model/game/items/ItemModel";
import BattleItemSlotController from "../battle/BattleItemSlotController";

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

		// to update additional items
		this.addChild(new BattleItemSlotController(this.game, this.model.inventory.body));
		this.addChild(new BattleItemSlotController(this.game, this.model.inventory.hips));
		this.addChild(new BattleItemSlotController(this.game, this.model.inventory.feet));

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
			this.model.stats.level,
			'level-up',
			(level) => (level === 1) ? this.gainFirstLevel() : null
		);

		this.addAutoEvent(
			this.model.inventory.head.item,
			'change',
			() => this.updateHair(),
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

	activateInternal() {
		this.updateEyes();
		this.updateBeard();
	}

	updateEyes() {
		if (this.model.eyesItemDefinitionId.isSet()) {
			const item = new ItemModel();
			item.definitionId.set(this.model.eyesItemDefinitionId.get());
			item.primaryMaterialId.set(this.model.eyesMaterialId.get());
			this.model.inventory.eyesSlot.item.set(item);
		} else {
			this.model.inventory.eyesSlot.item.set(null);
		}
	}

	updateBeard() {
		if (this.model.beardItemDefinitionId.isSet()) {
			const item = new ItemModel();
			item.definitionId.set(this.model.beardItemDefinitionId.get());
			item.primaryMaterialId.set(this.model.beardMaterialId.get());
			this.model.inventory.beardSlot.item.set(item);
		} else {
			this.model.inventory.beardSlot.item.set(null);
		}
	}

	updateHair() {
		if (this.model.inventory.head.item.isEmpty() && this.model.hairItemDefinitionId.isSet()) {
			const item = new ItemModel();
			item.definitionId.set(this.model.hairItemDefinitionId.get());
			if (this.model.hairMaterialId.isSet()) {
				item.primaryMaterialId.set(this.model.hairMaterialId.get());
			}
			this.model.inventory.hairSlot.item.set(item);
		} else {
			this.model.inventory.hairSlot.item.set(null);
		}
	}

	updateInventoryEffects() {
		this.model.stats.inventoryStatEffects.reset();
		const slots = [this.model.inventory.leftHand, this.model.inventory.rightHand, this.model.inventory.body, this.model.inventory.hips, this.model.inventory.feet, this.model.inventory.head];

		slots.forEach((slot) => {
			if (slot.item.isSet()) {
				const item= slot.item.get();
				if (!item) return;
				const def = this.game.resources.itemDefinitions.getById(item.definitionId.get());
				if (!def) {
					console.error(`Stat definition ${item.definitionId.get()} not found`);
					return;
				}
				let applyEffect = true;
				if (slot.name === 'leftHand' || slot.name === 'rightHand') {
					applyEffect = ['weapon', 'item'].includes(def.type.get());
				}
				if (applyEffect) {
					def.statEffects.forEach((eff) => this.model.stats.inventoryStatEffects.add(eff));
				}
			}
		});
	}

	gainFirstLevel() {
		const race = this.model.race.get();
		race.permanentEffects.forEach((eff) => {
			this.model.stats.abilities.all.forEach((ability) => {
				if (ability.definitionId.equalsTo(eff.statId.get()))
				ability.baseValue.set(eff.amount.get());
			});
			this.model.stats.skills.all.forEach((skill) => {
				if (skill.definitionId.equalsTo(eff.statId.get()))
					skill.baseValue.set(eff.amount.get());
			});
		});
	}

}
