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
				this.pickUp(slot);
			}
		);

		this.addAutoEvent(
			this.model,
			'drop-selected-item',
			() => {
				this.dropSelectedItemSomewhere();
			}
		);

	}

	drop(slot) {
		const selectedSlot = this.saveGame.selectedItemSlot;
		const selectedItem = selectedSlot.item.get();
		if (!selectedItem) {
			return;
		}
		const def = this.game.resources.itemDefinitions.getById(selectedItem.definitionId.get());
		if (!slot.accepts(def.type.get())) {
			return;
		}
		const item = slot.item.get();
		selectedSlot.item.set(item);
		if (slot.name === 'ground') {
			this.dropToGround(selectedItem);
			if (item) this.removeFromGround(item);
		}
		if (slot.name === 'drop') {
			this.dropToGround(selectedItem);
			const battle = this.saveGame.currentBattle.get();
			if (battle) battle.groundSlots.getFreeSlot().item.set(selectedItem);
		} else {
			slot.item.set(selectedItem);
		}
	}

	pickUp(slot) {
		const selectedSlot = this.saveGame.selectedItemSlot;
		const selectedItem = selectedSlot.item.get();
		if (selectedItem) {
			this.drop(slot);
			return;
		}
		const item = slot.item.get();
		if (slot.name === 'drop' || !item) {
			return;
		}
		selectedSlot.item.set(item);
		slot.item.set(null);
		this.saveGame.lastSelectedInventorySlot.set(slot);
		if (slot.name === 'ground') {
			this.removeFromGround(item);
		}
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

	dropSelectedItemSomewhere() {
		const selectedSlot = this.saveGame.selectedItemSlot;
		const selectedItem = selectedSlot.item.get();
		if (!selectedItem) return;

		const def = this.game.resources.itemDefinitions.getById(selectedItem.definitionId.get());
		const itemType = def.type.get();
		const lastSlot = this.saveGame.lastSelectedInventorySlot.get();
		if (lastSlot && lastSlot.name !== 'ground' && lastSlot.item.isEmpty() && lastSlot.accepts(itemType)) {
			this.drop(lastSlot);
			return
		}
		const partySlot = this.saveGame.party.findFreeItemSlot(itemType);
		if (partySlot) {
			this.drop(partySlot);
			return;
		}
		const battle = this.saveGame.currentBattle.get();
		if (battle) {
			const groundSlot = battle.groundSlots.getFreeSlot();
			if (groundSlot) {
				this.drop(groundSlot);
				return;
			}
		}
		console.log('Nowhere to drop!');
	}
}
