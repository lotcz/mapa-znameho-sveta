import DomRenderer from "../../../basic/DomRenderer";
import Pixies from "../../../../class/basic/Pixies";
import ImageRenderer from "../../../basic/ImageRenderer";
import InventoryItemsRenderer from "./InventoryItemsRenderer";
import ConditionalNodeRenderer from "../../../basic/ConditionalNodeRenderer";
import {
	INVENTORY_MODE_ITEMS,
	INVENTORY_MODE_RITUALS,
	INVENTORY_MODE_STATS
} from "../../../../model/game/party/PartyModel";
import InventoryStatsRenderer from "../stats/InventoryStatsRenderer";
import CollectionRenderer from "../../../basic/CollectionRenderer";
import InventoryStatConsumptionRenderer from "../stats/InventoryStatConsumptionRenderer";
import InventoryStatCombatRenderer from "../stats/InventoryStatCombatRenderer";
import InventoryStatBasicRenderer from "../stats/InventoryStatBasicRenderer";

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

		this.addAutoEvent(
			this.party.inventoryMode,
			'change',
			() => this.updateMode(),
			true
		);
	}

	activateInternal() {
		this.container = this.addElement('div', 'inventory row stretch ml-1');
		this.container.addEventListener('click', (e) => {
			e.stopPropagation();
			e.preventDefault();
		});
		this.inner = Pixies.createElement(this.container, 'div', 'column flex-1');

		this.top = Pixies.createElement(this.inner, 'div', 'inventory-top column');
		this.heading = Pixies.createElement(this.top, 'div', 'row space-between');
		this.name = Pixies.createElement(this.heading, 'h1', 'name', this.model.name.get());
		this.name = Pixies.createElement(
			this.heading,
			'button',
			'close',
			'X',
			() => {
				this.party.isInventoryVisible.set(false);
			}
		);

		this.middle = Pixies.createElement(this.top, 'div', 'row');
		this.col1 = Pixies.createElement(this.middle, 'div', 'column');

		this.portrait = Pixies.createElement(this.col1, 'div', 'portrait');
		this.addChild(
			new ImageRenderer(this.game, this.model.portrait, this.portrait)
		);

		this.col2 = Pixies.createElement(this.middle, 'div', 'inventory-basic column flex-1');
		this.basic = Pixies.createElement(this.col2, 'div','stats-basic row pb-1');
		this.consumption = Pixies.createElement(this.col2, 'div', 'stats-consumption row py-1 mx-1');
		this.combat = Pixies.createElement(this.col2, 'div', 'stats-combat row pt-1');

		this.addChild(
			new CollectionRenderer(
				this.game,
				this.model.stats.basic,
				(m) => new InventoryStatBasicRenderer(this.game, m, this.basic)
			)
		);

		this.addChild(
			new CollectionRenderer(
				this.game,
				this.model.stats.consumption,
				(m) => new InventoryStatConsumptionRenderer(this.game, m, this.consumption, false)
			)
		);

		this.addChild(
			new CollectionRenderer(
				this.game,
				this.model.stats.combat,
				(m) => new InventoryStatCombatRenderer(this.game, m, this.combat)
			)
		);

		this.bottom = Pixies.createElement(this.inner, 'div', 'inventory-bottom column flex-1 mt-1');
		this.tabs = Pixies.createElement(this.bottom, 'div', 'tabs row');

		this.itemsTab = Pixies.createElement(
			this.tabs,
			'div',
			'tab-header',
			'Předměty',
			() => {
				this.party.inventoryMode.set(INVENTORY_MODE_ITEMS);
			}
		);

		this.statsTab = Pixies.createElement(
			this.tabs,
			'div',
			'tab-header',
			'Postava',
			() => {
				this.party.inventoryMode.set(INVENTORY_MODE_STATS);
			}
		);

		this.ritualsTab = Pixies.createElement(
			this.tabs,
			'div',
			'tab-header',
			'Rituály',
			() => {
				this.party.inventoryMode.set(INVENTORY_MODE_RITUALS);
			}
		);

		Pixies.createElement(
			this.tabs,
			'div',
			'flex-1 filler'
		);

		this.content = Pixies.createElement(this.bottom, 'div', 'tab-content row stretch flex-1');

		this.addChild(
			new ConditionalNodeRenderer(
				this.game,
				this.party.inventoryMode,
				() => this.party.inventoryMode.equalsTo(INVENTORY_MODE_ITEMS),
				() => new InventoryItemsRenderer(this.game, this.model, this.party, this.content)
			)
		);
		this.addChild(
			new ConditionalNodeRenderer(
				this.game,
				this.party.inventoryMode,
				() => this.party.inventoryMode.equalsTo(INVENTORY_MODE_STATS),
				() => new InventoryStatsRenderer(this.game, this.model, this.party, this.content)
			)
		);

		this.party.triggerEvent('inventory-resize');
	}

	deactivateInternal() {
		this.resetChildren();
		this.removeElement(this.container);
		this.party.triggerEvent('inventory-resize');
	}

	updateMode() {
		Pixies.removeClass(this.statsTab, 'active');
		Pixies.removeClass(this.itemsTab, 'active');
		Pixies.removeClass(this.ritualsTab, 'active');

		switch (this.party.inventoryMode.get()) {
			case INVENTORY_MODE_ITEMS:
				Pixies.addClass(this.itemsTab, 'active');
				break;
			case INVENTORY_MODE_STATS:
				Pixies.addClass(this.statsTab, 'active');
				break;
			case INVENTORY_MODE_RITUALS:
				Pixies.addClass(this.ritualsTab, 'active');
				break;
		}
	}
}
