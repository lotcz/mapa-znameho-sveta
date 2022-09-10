import DomRenderer from "../../basic/DomRenderer";
import Pixies from "../../../class/basic/Pixies";
import ImageRenderer from "../../basic/ImageRenderer";
import CollectionRenderer from "../../basic/CollectionRenderer";
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

		this.addChild(new CollectionRenderer(this.game, this.model.inventory.slots, (m) => new InventorySlotRenderer(this.game, m, this.bottom)));
	}

	activateInternal() {
		this.container = this.addElement('div', 'inventory paper');
		this.container.addEventListener('click', (e) => {
			e.stopPropagation();
			e.preventDefault();
		});

		this.inner = Pixies.createElement(this.container, 'div', 'inner');

		this.top = Pixies.createElement(this.inner, 'div');

		this.name = Pixies.createElement(this.top, 'div', 'name');
		this.updateName();

		Pixies.createElement(this.top, 'button', 'special', 'Axe', () => {
			const slot = this.model.inventory.slots.first();
			const item = new ItemModel();
			item.definitionId.set(1);
			slot.item.set(item);
		});

		Pixies.createElement(this.top, 'button', 'special', 'Sword', () => {
			const slot = this.model.inventory.slots.get(2);
			const item = new ItemModel();
			item.definitionId.set(2);
			slot.item.set(item);
		});

		this.portrait = Pixies.createElement(this.top, 'div', 'portrait');
		this.addChild(
			new ImageRenderer(this.game, this.model.portrait, this.portrait)
		);

		this.bottom = Pixies.createElement(this.inner, 'div', 'inventory-slots');
	}

	deactivateInternal() {
		this.resetChildren();
		this.removeElement(this.container);
	}

	renderInternal() {
		if (this.model.name.isDirty) {
			this.updateName();
		}
		this.updateInventory();
	}

	updateInventory() {

	}

	updateName() {
		this.name.innerText = this.model.name.get();
	}

}
