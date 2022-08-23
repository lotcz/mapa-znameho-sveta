import DomRenderer from "../basic/DomRenderer";
import Pixies from "../../class/basic/Pixies";
import {GAME_MODE_BATTLE, GAME_MODE_MAP} from "../../model/savegame/SaveGameModel";
import NodeTableRenderer from "./NodeTableRenderer";
import NullableNodeRenderer from "../basic/NullableNodeRenderer";
import ConversationRenderer from "../conversation/ConversationRenderer";

export default class EditorRenderer extends DomRenderer {

	/**
	 * @type EditorModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;

		this.container = null;
		this.menu = null;

		this.updateModeHandler = () => this.updateMode();

		this.tableRenderer = new NullableNodeRenderer(this.game, this.model.activeTable, (model) => new NodeTableRenderer(this.game, model, this.dock));
		this.addChild(this.tableRenderer);
	}

	activateInternal() {
		this.container = this.addElement('div', ['editor', 'container-host']);
		this.container.addEventListener('mousemove', (e) => e.stopPropagation());
		this.container.addEventListener('click', (e) => e.stopPropagation());

		this.nav = Pixies.createElement(this.container, 'nav');
		this.dock = Pixies.createElement(this.container, 'div', 'dock');

		this.updateMenu();

		this.updateMode();
		this.game.saveGame.mode.addOnChangeListener(this.updateModeHandler);

	}

	deactivateInternal() {
		//this.model.activeTable.removeOnChangeListener(this.updateMenuHandler);
		this.game.saveGame.mode.removeOnChangeListener(this.updateModeHandler);
		this.removeElement(this.container);
	}

	updateMode() {
		if (this.debugMenu) {
			Pixies.destroyElement(this.debugMenu);
			this.debugMenu = null;
		}
		this.debugMenu = Pixies.createElement(this.nav, 'div', 'debug-menu');
		const mapButton = Pixies.createElement(this.debugMenu, 'button', this.game.saveGame.mode.equalsTo(GAME_MODE_MAP) ? 'active' : null);
		mapButton.innerText = 'MAP';
		mapButton.addEventListener('click', () => this.game.saveGame.mode.set(GAME_MODE_MAP));
		const battleButton = Pixies.createElement(this.debugMenu, 'button', this.game.saveGame.mode.equalsTo(GAME_MODE_BATTLE) ? 'active' : null);
		battleButton.innerText = 'BATTLE';
		battleButton.addEventListener('click', () => this.game.saveGame.mode.set(GAME_MODE_BATTLE));
	}

	updateMenu() {
		if (this.menu) {
			Pixies.destroyElement(this.menu);
		}
		this.menu = Pixies.createElement(this.dock, 'div');
		this.addMenuSection(this.model.resourcesOptions, 'Resources');
		this.addMenuSection(this.model.mapOptions, 'Map');
		this.addMenuSection(this.model.saveGameOptions, 'SaveGame');

		//this.updateTable();
	}

	addMenuSection(options, name) {
		const h = Pixies.createElement(this.menu, 'h3');
		h.innerText = name;
		const menu = Pixies.createElement(this.menu, 'ul', 'menu');
		Object.keys(options).forEach((key) => this.addMenuLink(menu, options, key));
	}

	addMenuLink(wrapper, options, key) {
		//const isActive = this.model.activeTable.equalsTo(table);
		const item = Pixies.createElement(wrapper,'li');
		const link = Pixies.createElement(item,'a');
		link.innerText = options[key];
		link.addEventListener('click', () => this.model.triggerEvent('table-selected', key));
	}

}
