import DomRenderer from "../basic/DomRenderer";
import Pixies from "../../class/basic/Pixies";
import NodeTableRenderer from "./NodeTableRenderer";
import NullableNodeRenderer from "../basic/NullableNodeRenderer";
import NodeFormRenderer from "./NodeFormRenderer";
import ItemImageRenderer from "./ItemImageRenderer";
import ItemMountingRenderer from "./ItemMountingRenderer";
import MaterialPreviewRenderer from "./MaterialPreviewRenderer";
import SaveGameMenuRenderer from "./SaveGameMenuRenderer";
import BattleEditorRenderer from "./battle/BattleEditorRenderer";

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

		this.addChild(
			new NullableNodeRenderer(
				this.game,
				this.game.saveGame,
				(m) => new SaveGameMenuRenderer(this.game, m, this.buttonsRight)
			)
		);

		this.addChild(
			new NullableNodeRenderer(
				this.game,
				this.model.battleEditor,
				(m) => new BattleEditorRenderer(this.game, m, this.container)
			)
		);

		this.tableRenderer = new NullableNodeRenderer(this.game, this.model.activeTable, (model) => new NodeTableRenderer(this.game, model, this.table));
		this.addChild(this.tableRenderer);

		this.formRenderer = new NullableNodeRenderer(this.game, this.model.activeForm, (model) => new NodeFormRenderer(this.game, model, this.form));
		this.addChild(this.formRenderer);

		this.itemImageRenderer = new NullableNodeRenderer(this.game, this.model.activeItemImageDefinition, (model) => new ItemImageRenderer(this.game, model, this.item));
		this.addChild(this.itemImageRenderer);

		this.itemMountingRenderer = new NullableNodeRenderer(this.game, this.model.activeItemMounting, (model) => new ItemMountingRenderer(this.game, model, this.item));
		this.addChild(this.itemMountingRenderer);

		this.materialPreviewRenderer = new NullableNodeRenderer(this.game, this.model.activeMaterial, (model) => new MaterialPreviewRenderer(this.game, model, this.item));
		this.addChild(this.materialPreviewRenderer);

		this.materialPreviewRenderer = new NullableNodeRenderer(this.game, this.model.activeMaterial, (model) => new MaterialPreviewRenderer(this.game, model, this.item));
		this.addChild(this.materialPreviewRenderer);

		this.stopEventPropagationHandler = (e) => e.stopPropagation();
	}

	activateInternal() {
		this.container = this.addElement('div', 'editor');
		this.nav = Pixies.createElement(this.container, 'nav', 'bg row');

		const buttons = Pixies.createElement(this.nav, 'div', 'buttons row');
		const buttonsLeft = Pixies.createElement(buttons, 'div');
		this.switch = Pixies.createElement(buttonsLeft,'input');
		this.switch.setAttribute('type', 'checkbox');
		this.switch.setAttribute('name', 'switch');
		this.switch.addEventListener('change', () => this.model.triggerEvent('switch-options'));

		Pixies.createElement(
			buttonsLeft,
			'button',
			'special',
			'Download Resources',
			() => this.model.triggerEvent('download-resources')
		);
		this.buttonsRight = Pixies.createElement(this.nav, 'div');

		this.dock = Pixies.createElement(this.container, 'div', 'dock');
		this.tables = Pixies.createElement(this.dock, 'div', 'table-selection bg');
		this.table = Pixies.createElement(this.dock, 'div', 'active-table');
		this.form = Pixies.createElement(this.dock, 'div', 'active-form');
		this.item = Pixies.createElement(this.dock, 'div', 'active-item');

		const events = ['click', 'mousemove', 'mousedown', 'mouseup', 'wheel'];
		const elements = [this.nav, this.tables, this.table, this.form, this.item];
		for (const eli in elements) {
			for (const evi in events) {
				this.addAutoEvent(elements[eli], events[evi], this.stopEventPropagationHandler);
			}
		}

		this.updateTables();
	}

	deactivateInternal() {
		this.removeElement(this.container);
	}

	renderInternal() {
		if (this.model.activeTable.isDirty || this.model.isOptionsVisible.isDirty) {
			this.updateTables();
		}
	}

	updateTables() {
		Pixies.emptyElement(this.tables);
		this.switch.checked = this.model.isOptionsVisible.get();
		if (!this.model.isOptionsVisible.get()) return;
		const wrapper = Pixies.createElement(this.tables, 'div', 'inner');
		this.addMenuSection(wrapper, this.model.resourcesOptions, 'Resources');
		this.addMenuSection(wrapper, this.model.mapOptions, 'Map');
		this.addMenuSection(wrapper, this.model.saveGameOptions, 'SaveGame');
	}

	addMenuSection(wrapper, options, name) {
		Pixies.createElement(wrapper, 'h3', null, name);
		const menu = Pixies.createElement(wrapper, 'ul', 'menu');
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
