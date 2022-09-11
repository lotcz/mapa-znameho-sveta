import DomRenderer from "../../basic/DomRenderer";
import Pixies from "../../../class/basic/Pixies";
import ImageRenderer from "../../basic/ImageRenderer";
import InventorySlotRenderer from "./InventorySlotRenderer";
import ItemModel from "../../../model/resources/items/ItemModel";

export default class InventoryRenderer extends DomRenderer {

	/**
	 * @type CharacterModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;

	}

	activateInternal() {
		this.container = this.addElement('div', 'inventory column paper');
		this.container.addEventListener('click', (e) => {
			e.stopPropagation();
			e.preventDefault();
		});
		this.inner = Pixies.createElement(this.container, 'div', 'inner row');

		this.statsWrapper = Pixies.createElement(this.inner, 'div', 'inventory-stats column');
		this.stats = Pixies.createElement(this.statsWrapper, 'div', 'column');

		this.name = Pixies.createElement(this.stats, 'div', 'name');
		this.updateName();

		this.portrait = Pixies.createElement(this.stats, 'div', 'portrait');
		this.addChild(
			new ImageRenderer(this.game, this.model.portrait, this.portrait)
		);

		this.buttons = Pixies.createElement(this.stats, 'div', 'row');
		Pixies.createElement(this.buttons, 'button', 'special', 'Axe', () => {
			const slot = this.model.inventory.slot1;
			const item = new ItemModel();
			item.definitionId.set(1);
			slot.item.set(item);
		});

		Pixies.createElement(this.buttons, 'button', 'special', 'Sword', () => {
			const slot = this.model.inventory.slot3;
			const item = new ItemModel();
			item.definitionId.set(2);
			slot.item.set(item);
		});

		Pixies.createElement(this.buttons, 'button', 'special', 'Hair', () => {
			const slot = this.model.inventory.head;
			const item = new ItemModel();
			item.definitionId.set(3);
			slot.item.set(item);
		});

		this.inventoryCharacter = Pixies.createElement(this.inner, 'div', 'inventory-character ');
		this.addChild(new InventorySlotRenderer(this.game, this.model.inventory.head, this.inventoryCharacter));
		this.addChild(new InventorySlotRenderer(this.game, this.model.inventory.leftHand, this.inventoryCharacter));
		this.addChild(new InventorySlotRenderer(this.game, this.model.inventory.rightHand, this.inventoryCharacter));

		this.inventorySlots = Pixies.createElement(this.inner, 'div', 'inventory-slots');
		this.addChild(new InventorySlotRenderer(this.game, this.model.inventory.slot1, this.inventorySlots));
		this.addChild(new InventorySlotRenderer(this.game, this.model.inventory.slot2, this.inventorySlots));
		this.addChild(new InventorySlotRenderer(this.game, this.model.inventory.slot3, this.inventorySlots));
	}

	deactivateInternal() {
		this.resetChildren();
		this.removeElement(this.container);
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
