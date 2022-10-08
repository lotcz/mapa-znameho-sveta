import DomRenderer from "../../../basic/DomRenderer";
import Pixies from "../../../../class/basic/Pixies";
import ImageRenderer from "../../../basic/ImageRenderer";
import ItemModel from "../../../../model/game/items/ItemModel";
import TableLookupRenderer from "../../../editor/TableLookupRenderer";
import InventoryItemsRenderer from "./InventoryItemsRenderer";
import ConditionalNodeRenderer from "../../../basic/ConditionalNodeRenderer";
import {INVENTORY_MODE_ITEMS, INVENTORY_MODE_STATS} from "../../../../model/game/party/PartyModel";
import InventoryStatsRenderer from "../stats/InventoryStatsRenderer";

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

		Pixies.createElement(
			this.buttons,
			'button',
			null,
			'Items',
			() => {
				this.party.inventoryMode.set(INVENTORY_MODE_ITEMS);
			}
		);

		Pixies.createElement(
			this.buttons,
			'button',
			null,
			'Stats',
			() => {
				this.party.inventoryMode.set(INVENTORY_MODE_STATS);
			}
		);

		this.bottom = Pixies.createElement(this.inner, 'div', 'column');
		this.addChild(
			new ConditionalNodeRenderer(
				this.game,
				this.party.inventoryMode,
				() => this.party.inventoryMode.equalsTo(INVENTORY_MODE_ITEMS),
				() => new InventoryItemsRenderer(this.game, this.model, this.party, this.bottom)
			)
		);
		this.addChild(
			new ConditionalNodeRenderer(
				this.game,
				this.party.inventoryMode,
				() => this.party.inventoryMode.equalsTo(INVENTORY_MODE_STATS),
				() => new InventoryStatsRenderer(this.game, this.model, this.party, this.bottom)
			)
		);

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
