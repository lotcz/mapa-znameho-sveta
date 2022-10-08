import DomRenderer from "../../../basic/DomRenderer";
import Pixies from "../../../../class/basic/Pixies";
import ImageRenderer from "../../../basic/ImageRenderer";
import InventorySlotRenderer from "./InventorySlotRenderer";
import ItemModel from "../../../../model/game/items/ItemModel";
import TableLookupRenderer from "../../../editor/TableLookupRenderer";

export default class InventoryRenderer extends DomRenderer {

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
		this.container = this.addElement('div', 'inventory column');
		this.container.addEventListener('click', (e) => {
			e.stopPropagation();
			e.preventDefault();
		});
		this.inner = Pixies.createElement(this.container, 'div', 'column');

		this.statsWrapper = Pixies.createElement(this.inner, 'div', 'inventory-stats row');
		this.portrait = Pixies.createElement(this.statsWrapper, 'div', 'portrait');
		this.addChild(
			new ImageRenderer(this.game, this.model.portrait, this.portrait)
		);

		this.stats = Pixies.createElement(this.statsWrapper, 'div', 'column');

		this.name = Pixies.createElement(this.stats, 'div', 'name');
		this.updateName();

		this.buttons = Pixies.createElement(this.stats, 'div', 'row');

		Pixies.createElement(this.buttons, 'button', 'special', 'Add item', () => {
			const slot = this.model.inventory.slot1;
			const item = new ItemModel();
			let renderer = new TableLookupRenderer(this.game, item.definitionId, this.buttons, 'definitionId');

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

		this.bottom = Pixies.createElement(this.inner, 'div', 'row');

		this.inventoryCharacter = Pixies.createElement(this.bottom, 'div', 'inventory-character');
		this.addChild(new InventorySlotRenderer(this.game, this.model.inventory.head, this.inventoryCharacter));
		this.addChild(new InventorySlotRenderer(this.game, this.model.inventory.leftHand, this.inventoryCharacter));
		this.addChild(new InventorySlotRenderer(this.game, this.model.inventory.rightHand, this.inventoryCharacter));
		this.addChild(new InventorySlotRenderer(this.game, this.model.inventory.clothing, this.inventoryCharacter));

		this.inventorySlots = Pixies.createElement(this.bottom, 'div', 'inventory-slots');
		this.inventorySlotsTop = Pixies.createElement(this.inventorySlots, 'div', 'inventory-slots-top');
		this.addChild(new InventorySlotRenderer(this.game, this.model.inventory.slot1, this.inventorySlotsTop));
		this.addChild(new InventorySlotRenderer(this.game, this.model.inventory.slot2, this.inventorySlotsTop));
		this.addChild(new InventorySlotRenderer(this.game, this.model.inventory.slot3, this.inventorySlotsTop));

		this.inventorySlotsBottom = Pixies.createElement(this.inventorySlots, 'div', 'inventory-slots-bottom');
		this.addChild(new InventorySlotRenderer(this.game, this.model.dropSlot, this.inventorySlotsBottom));

		this.party.triggerEvent('inventory-resize');
	}

	deactivateInternal() {
		this.resetChildren();
		this.removeElement(this.container);
		this.party.triggerEvent('inventory-resize');
	}

	renderInternal() {
		if (this.model.name.isDirty) {
			this.updateName();
		}
	}

	updateName() {
		this.name.innerText = this.model.name.get();
	}

}
