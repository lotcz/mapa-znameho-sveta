import ControllerWithSaveGame from "../../basic/ControllerWithSaveGame";
import BattleItemModel from "../../../model/game/battle/BattleItemModel";

export default class ItemSlotsController extends ControllerWithSaveGame {

	/**
	 * @type SaveGameModel
	 */
	model;

	constructor(game, model) {
		super(game, model);

		this.model = model;

		this.addAutoEvent(
			this.model,
			'item-slot-selected',
			(slot) => {
				const selectedSlot = this.saveGame.selectedInventorySlot;

				if (selectedSlot.equalsTo(slot)) {
					selectedSlot.set(null);
					return;
				}

				if (selectedSlot.isSet()) {
					this.drop(slot);
				} else {
					this.pickUp(slot);
				}
			}
		);

	}

	drop(slot) {
		const selectedSlot = this.saveGame.selectedInventorySlot.get();
		if (!selectedSlot) {
			return;
		}
		const item = selectedSlot.item.get();
		if (!item) {
			console.error('empty item slot is selected!');
			return;
		}
		const def = this.game.resources.itemDefinitions.getById(item.definitionId.get());
		if (!slot.accepts(def.type.get())) {
			return;
		}
		selectedSlot.item.set(null);
		if (slot.name === 'ground' && selectedSlot.name !== 'ground') {
			this.dropToGround(item);
		}
		if (selectedSlot.name === 'ground' && slot.name !== 'ground') {
			this.removeFromGround(item);
		}
		this.pickUp(slot);
		if (slot.name === 'drop') {
			this.dropToGround(item);
			// trigger ground refresh
			const battle = this.saveGame.currentBattle.get();
			if (battle) battle.groundPosition.triggerEvent('change');
		} else {
			slot.item.set(item);
		}
	}

	pickUp(slot) {
		if (slot.name === 'drop' || slot.item.isEmpty()) {
			this.saveGame.selectedInventorySlot.set(null);
			return;
		}
		this.saveGame.selectedInventorySlot.set(slot);
	}

	dropToGround(item) {
		const battle = this.saveGame.currentBattle.get();
		if (!battle) return;
		const battleItem = new BattleItemModel();
		battleItem.item.set(item);
		const battleCharacter = battle.partyCharacters.selectedNode.get();
		battleItem.position.set(battleCharacter.position.round());
		battle.items.add(battleItem);
	}

	removeFromGround(item) {
		const battle = this.saveGame.currentBattle.get();
		if (!battle) return;
		const battleItem = battle.items.find((bi) => bi.item.equalsTo(item));
		battle.items.remove(battleItem);
	}

}
