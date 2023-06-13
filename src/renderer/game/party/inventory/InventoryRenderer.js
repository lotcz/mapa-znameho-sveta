import Pixies from "../../../../class/basic/Pixies";
import InventoryTabItemsRenderer from "./InventoryTabItemsRenderer";
import ConditionalNodeRenderer from "../../../basic/ConditionalNodeRenderer";
import {
	INVENTORY_MODE_ITEMS,
	INVENTORY_MODE_QUESTS,
	INVENTORY_MODE_RITUALS,
	INVENTORY_MODE_STATS
} from "../../../../model/game/party/PartyModel";
import InventoryTabStatsRenderer from "./InventoryTabStatsRenderer";
import CollectionRenderer from "../../../basic/CollectionRenderer";
import StatCombatRenderer from "../stats/StatCombatRenderer";
import StatBasicRenderer from "../stats/StatBasicRenderer";
import InventoryTabQuestsRenderer from "./InventoryTabQuestsRenderer";
import DomRendererWithSaveGame from "../../../basic/DomRendererWithSaveGame";
import DirtyValueRenderer from "../../../basic/DirtyValueRenderer";

export default class InventoryRenderer extends DomRendererWithSaveGame {

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
		this.container = this.addElement('div', 'inventory row stretch p-1');
		this.container.addEventListener('click', (e) => {
			e.stopPropagation();
			e.preventDefault();
		});
		this.inner = Pixies.createElement(this.container, 'div', 'column flex-1');

		this.top = Pixies.createElement(this.inner, 'div', 'inventory-top column');
		this.heading = Pixies.createElement(this.top, 'div', 'row');
		this.name = Pixies.createElement(this.heading, 'div', 'flex-1 center');
		this.nameInner = Pixies.createElement(this.name, 'h1', 'name');
		this.addChild(new DirtyValueRenderer(this.game, this.model.name, this.nameInner));

		this.close = Pixies.createElement(
			this.heading,
			'button',
			'close',
			'X',
			() => {
				this.party.isInventoryVisible.set(false);
			}
		);

		this.middle = Pixies.createElement(this.top, 'div', 'inventory-basic column flex-1 space-around my-2');
		this.basic = Pixies.createElement(this.middle, 'div','stats-basic row px-3');
		this.combat = Pixies.createElement(this.middle, 'div', 'stats-combat row');

		this.addChild(
			new CollectionRenderer(
				this.game,
				this.model.stats.basic.all,
				(m) => new StatBasicRenderer(this.game, m, this.basic)
			)
		);

		this.addChild(
			new CollectionRenderer(
				this.game,
				this.model.stats.combat.all,
				(m) => new StatCombatRenderer(this.game, m, this.combat)
			)
		);

		this.bottom = Pixies.createElement(this.inner, 'div', 'inventory-bottom column flex-1 mt-2');
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

		this.questsTab = Pixies.createElement(
			this.tabs,
			'div',
			'tab-header',
			'Úkoly',
			() => {
				this.party.inventoryMode.set(INVENTORY_MODE_QUESTS);
			}
		);

		Pixies.createElement(
			this.tabs,
			'article',
			'flex-1 filler'
		);

		this.content = Pixies.createElement(this.bottom, 'div', 'tab-content container-host stretch flex-1');

		this.addChild(
			new ConditionalNodeRenderer(
				this.game,
				this.party.inventoryMode,
				() => this.party.inventoryMode.equalsTo(INVENTORY_MODE_ITEMS),
				() => new InventoryTabItemsRenderer(this.game, this.model, this.party, this.content)
			)
		);
		this.addChild(
			new ConditionalNodeRenderer(
				this.game,
				this.party.inventoryMode,
				() => this.party.inventoryMode.equalsTo(INVENTORY_MODE_STATS),
				() => new InventoryTabStatsRenderer(this.game, this.model, this.party, this.content)
			)
		);
		this.addChild(
			new ConditionalNodeRenderer(
				this.game,
				this.party.inventoryMode,
				() => this.party.inventoryMode.equalsTo(INVENTORY_MODE_QUESTS),
				() => new InventoryTabQuestsRenderer(this.game, this.saveGame.completedQuests, this.content)
			)
		);

		this.saveGame.triggerEvent('trigger-resize');
	}

	deactivateInternal() {
		this.resetChildren();
		this.removeElement(this.container);
		this.saveGame.triggerEvent('trigger-resize');
	}

	updateMode() {
		Pixies.removeClass(this.statsTab, 'active');
		Pixies.removeClass(this.itemsTab, 'active');
		Pixies.removeClass(this.ritualsTab, 'active');
		Pixies.removeClass(this.questsTab, 'active');

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
			case INVENTORY_MODE_QUESTS:
				Pixies.addClass(this.questsTab, 'active');
				break;
		}
	}
}
