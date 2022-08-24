import Pixies from "../../class/basic/Pixies";
import CollectionRenderer from "../basic/CollectionRenderer";
import TableRowRenderer from "./TableRowRenderer";
import NodeFormRenderer from "./NodeFormRenderer";

export default class NodeTableRenderer extends CollectionRenderer {

	/**
	 * @type ModelNodeTable
	 */
	model;

	dom;

	name;

	constructor(game, model, dom, name = null) {
		super(game, model, null);

		this.model = model;
		this.dom = dom;
		this.name = name;
		this.container = null;

	}

	activateInternal() {
		this.container = Pixies.createElement(this.dom, 'div', 'table bg');
		this.container.addEventListener('mousemove', (e) => e.stopPropagation());
		this.container.addEventListener('click', (e) => e.stopPropagation());

		this.buttons = Pixies.createElement(this.container, 'div', 'buttons');
		const buttonsLeft = Pixies.createElement(this.buttons, 'div');
		const buttonsRight = Pixies.createElement(this.buttons, 'div');

		this.addButton = Pixies.createElement(buttonsLeft, 'button');
		this.addButton.innerText = 'Add';
		this.addButton.addEventListener('click', () => this.addRow());

		this.closeButton = Pixies.createElement(buttonsRight, 'button');
		this.closeButton.innerText = 'Close';
		this.closeButton.addEventListener('click', () => this.game.editor.triggerEvent('table-closed'));

		this.table = Pixies.createElement(this.container, 'table');
		this.rendererFactory = (item) => new TableRowRenderer(game, item, this.table, this.name);

		const header = Pixies.createElement(this.table, 'tr');
		const dummy = this.model.nodeFactory();
		dummy.properties.forEach((name, value) => {
			const cell = Pixies.createElement(header, 'th');
			cell.innerText = name;
		});

		super.activateInternal();
	}

	deactivateInternal() {
		super.deactivateInternal();
		Pixies.destroyElement(this.container);
	}

	addRow() {
		const item = this.model.add();
		this.game.editor.triggerEvent('row-selected', item);
	}

}
