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
		
		this.stopEventPropagationHandler = (e) => e.stopPropagation();
	}

	activateInternal() {
		this.container = this.addElement('div', ['editor', 'container-host']);

		this.nav = Pixies.createElement(this.container, 'nav', 'bg');
		this.nav.addEventListener('click', this.stopEventPropagationHandler);
		this.nav.addEventListener('mousemove', this.stopEventPropagationHandler);

		this.gameMode = Pixies.createElement(this.nav, 'div', 'game-mode');
		this.gameMode.addEventListener('click', this.stopEventPropagationHandler);
		this.gameMode.addEventListener('mousemove', this.stopEventPropagationHandler);

		this.dock = Pixies.createElement(this.container, 'div', 'dock');

		this.tables = Pixies.createElement(this.dock, 'div', 'table-selection bg');
		this.tables.addEventListener('click', this.stopEventPropagationHandler);
		this.tables.addEventListener('mousemove', this.stopEventPropagationHandler);

		this.table = Pixies.createElement(this.dock, 'div', 'active-table');
		this.table.addEventListener('click', this.stopEventPropagationHandler);
		this.table.addEventListener('mousemove', this.stopEventPropagationHandler);

		this.form = Pixies.createElement(this.dock, 'div', 'active-form');
		this.form.addEventListener('click', this.stopEventPropagationHandler);
		this.form.addEventListener('mousemove', this.stopEventPropagationHandler);

		this.updateMode();
		this.updateTables();
	}

	deactivateInternal() {
		this.removeElement(this.container);
	}

	renderInternal() {
		if (this.model.activeTable.isDirty) {
			this.updateTables();
		}
		if (this.game.saveGame.get().mode.isDirty) {
			this.updateMode();
		}
	}

	updateMode() {
		Pixies.emptyElement(this.gameMode);
		const buttons = Pixies.createElement(this.gameMode, 'div', 'buttons');
		const buttonsLeft = Pixies.createElement(buttons, 'div');
		const mapButton = Pixies.createElement(buttonsLeft, 'button', this.game.saveGame.get().mode.equalsTo(GAME_MODE_MAP) ? 'active' : null);
		mapButton.innerText = 'MAP';
		mapButton.addEventListener('click', () => this.game.saveGame.get().mode.set(GAME_MODE_MAP));
		const battleButton = Pixies.createElement(buttonsLeft, 'button', this.game.saveGame.get().mode.equalsTo(GAME_MODE_BATTLE) ? 'active' : null);
		battleButton.innerText = 'BATTLE';
		battleButton.addEventListener('click', () => this.game.saveGame.get().mode.set(GAME_MODE_BATTLE));

		const buttonsMiddle = Pixies.createElement(buttons, 'div');
		const saveButton = Pixies.createElement(
			buttonsMiddle,
			'button',
			null,
			'Save',
			() => this.game.saveGame.triggerEvent('save')
		);

		const buttonsRight = Pixies.createElement(buttons, 'div');
		const switchButton = Pixies.createElement(
			buttonsRight,
			'button',
			null,
			'Switch',
			() => Pixies.toggleClass(this.dom, 'full')
		);
	}

	updateTables() {
		Pixies.emptyElement(this.tables);
		this.addMenuSection(this.model.resourcesOptions, 'Resources');
		this.addMenuSection(this.model.mapOptions, 'Map');
		this.addMenuSection(this.model.saveGameOptions, 'SaveGame');
	}

	addMenuSection(options, name) {
		const h = Pixies.createElement(this.tables, 'h3', null, name);
		const menu = Pixies.createElement(this.tables, 'ul', 'menu');
		Object.keys(options).forEach((key) => this.addMenuLink(menu, options, key));
	}

	addMenuLink(wrapper, options, key) {
		const table = this.game.getTableByName(key);
		const isActive = this.model.activeTable.equalsTo(table);
		const item = Pixies.createElement(wrapper,'li', isActive ? 'active' : '');
		const link = Pixies.createElement(item,'a', null, options[key]);
		link.addEventListener('click', () => this.model.triggerEvent('table-selected', key));
	}

}
