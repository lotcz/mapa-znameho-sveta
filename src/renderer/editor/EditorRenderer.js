import DomRenderer from "../basic/DomRenderer";
import Pixies from "../../class/basic/Pixies";
import {GAME_MODE_BATTLE, GAME_MODE_MAP} from "../../model/savegame/SaveGameModel";
import NodeTableRenderer from "./NodeTableRenderer";
import NullableNodeRenderer from "../basic/NullableNodeRenderer";
import NodeFormRenderer from "./NodeFormRenderer";

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

		this.tableRenderer = new NullableNodeRenderer(this.game, this.model.activeTable, (model) => new NodeTableRenderer(this.game, model, this.table));
		this.addChild(this.tableRenderer);

		this.formRenderer = new NullableNodeRenderer(this.game, this.model.activeForm, (model) => new NodeFormRenderer(this.game, model, this.form));
		this.addChild(this.formRenderer);

		this.updateModeHandler = () => this.updateMode();
	}

	activateInternal() {
		this.container = this.addElement('div', ['editor', 'container-host']);
		this.container.addEventListener('mousemove', (e) => e.stopPropagation());
		this.container.addEventListener('click', (e) => e.stopPropagation());

		this.nav = Pixies.createElement(this.container, 'nav', 'bg');
		this.gameMode = Pixies.createElement(this.nav, 'div', 'game-mode');
		this.dock = Pixies.createElement(this.container, 'div', 'dock');
		this.tables = Pixies.createElement(this.dock, 'div', 'table-selection bg');
		this.table = Pixies.createElement(this.dock, 'div', 'active-table');
		this.form = Pixies.createElement(this.dock, 'div', 'active-form');

		this.updateMode();
		this.game.saveGame.mode.addOnChangeListener(this.updateModeHandler);

		this.updateTables();
	}

	deactivateInternal() {
		this.game.saveGame.mode.removeOnChangeListener(this.updateModeHandler);
		this.removeElement(this.container);
	}

	renderInternal() {
		if (this.model.activeTable.isDirty) {
			this.updateTables();
		}
	}

	updateMode() {
		Pixies.emptyElement(this.gameMode);
		const mapButton = Pixies.createElement(this.gameMode, 'button', this.game.saveGame.mode.equalsTo(GAME_MODE_MAP) ? 'active' : null);
		mapButton.innerText = 'MAP';
		mapButton.addEventListener('click', () => this.game.saveGame.mode.set(GAME_MODE_MAP));
		const battleButton = Pixies.createElement(this.gameMode, 'button', this.game.saveGame.mode.equalsTo(GAME_MODE_BATTLE) ? 'active' : null);
		battleButton.innerText = 'BATTLE';
		battleButton.addEventListener('click', () => this.game.saveGame.mode.set(GAME_MODE_BATTLE));
	}

	updateTables() {
		Pixies.emptyElement(this.tables);
		this.addMenuSection(this.model.resourcesOptions, 'Resources');
		this.addMenuSection(this.model.mapOptions, 'Map');
		this.addMenuSection(this.model.saveGameOptions, 'SaveGame');
	}

	addMenuSection(options, name) {
		const h = Pixies.createElement(this.tables, 'h3');
		h.innerText = name;
		const menu = Pixies.createElement(this.tables, 'ul', 'menu');
		Object.keys(options).forEach((key) => this.addMenuLink(menu, options, key));
	}

	addMenuLink(wrapper, options, key) {
		const table = this.game.getTableByName(key);
		const isActive = this.model.activeTable.equalsTo(table);
		console.log(isActive);
		const item = Pixies.createElement(wrapper,'li', isActive ? 'active' : '');
		const link = Pixies.createElement(item,'a');
		link.innerText = options[key];
		link.addEventListener('click', () => this.model.triggerEvent('table-selected', key));
	}

}
