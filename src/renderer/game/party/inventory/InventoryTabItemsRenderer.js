import DomRenderer from "../../../basic/DomRenderer";
import Pixies from "../../../../class/basic/Pixies";
import InventorySlotRenderer from "./InventorySlotRenderer";
import ItemModel from "../../../../model/game/items/ItemModel";
import TableLookupRenderer from "../../../editor/TableLookupRenderer";
import CollectionRenderer from "../../../basic/CollectionRenderer";
import StatConsumptionRenderer from "../stats/StatConsumptionRenderer";

export default class InventoryTabItemsRenderer extends DomRenderer {

	/**
	 * @type CharacterModel
	 */
	model;

	/**
	 * @type PartyModel
	 */
	party;

	constructor(game, model, party, dom) {
		super(game, model, dom);

		this.model = model;
		this.party = party;
	}

	activateInternal() {
		this.container = Pixies.createElement(this.dom, 'div', 'inventory-items row stretch flex-1');

		this.inventoryCharacter = Pixies.createElement(this.container, 'div', 'inventory-character flex-1');
		this.consumption = Pixies.createElement(this.inventoryCharacter, 'div', 'stats-consumption column');
		this.addChild(
			new CollectionRenderer(
				this.game,
				this.model.stats.consumption.all,
				(m) => new StatConsumptionRenderer(this.game, m, this.consumption, false)
			)
		);
		this.addChild(new InventorySlotRenderer(this.game, this.model.inventory.head, this.inventoryCharacter));
		this.addChild(new InventorySlotRenderer(this.game, this.model.inventory.leftHand, this.inventoryCharacter));
		this.addChild(new InventorySlotRenderer(this.game, this.model.inventory.rightHand, this.inventoryCharacter));
		this.addChild(new InventorySlotRenderer(this.game, this.model.inventory.clothing, this.inventoryCharacter));

		this.inventorySlots = Pixies.createElement(this.container, 'div', 'inventory-slots');
		this.inventorySlotsTop = Pixies.createElement(this.inventorySlots, 'div', 'inventory-slots-top');
		this.addChild(new InventorySlotRenderer(this.game, this.model.inventory.slot1, this.inventorySlotsTop));
		this.addChild(new InventorySlotRenderer(this.game, this.model.inventory.slot2, this.inventorySlotsTop));
		this.addChild(new InventorySlotRenderer(this.game, this.model.inventory.slot3, this.inventorySlotsTop));

		this.inventorySlotsBottom = Pixies.createElement(this.inventorySlots, 'div', 'inventory-slots-bottom');
		this.addChild(new InventorySlotRenderer(this.game, this.model.dropSlot, this.inventorySlotsBottom));

		Pixies.createElement(this.inventorySlotsBottom, 'button', 'special', 'Add item', () => {
			const slot = this.model.inventory.slot1;
			const item = new ItemModel();
			let renderer = new TableLookupRenderer(this.game, item.definitionId, this.dom, 'definitionId');

			item.definitionId.addEventListener(
				'table-closed',
				() => {
					if (renderer) {
						slot.item.set(item);
						renderer.deactivate();
						renderer = null;
					}
				});
			renderer.activate();
		});
	}

	deactivateInternal() {
		this.resetChildren();
		this.removeElement(this.container);
	}

}
