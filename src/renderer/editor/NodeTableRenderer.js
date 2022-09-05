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
		this.formRenderer = null;

		this.onFormClosedHandler = () => this.hideForm();
		this.onNodeDeleteHandler = (node) => this.onNodeDelete(node);
	}

	activateInternal() {
		this.container = Pixies.createElement(this.dom, 'div', 'table bg');
		this.container.addEventListener('mousemove', (e) => e.stopPropagation());
		this.container.addEventListener('click', (e) => {
			e.stopPropagation();
			e.preventDefault();
		});

		this.buttons = Pixies.createElement(this.container, 'div', 'buttons');
		const buttonsLeft = Pixies.createElement(this.buttons, 'div');
		const buttonsRight = Pixies.createElement(this.buttons, 'div');

		this.addButton = Pixies.createElement(buttonsLeft, 'button');
		this.addButton.innerText = 'Add';
		this.addButton.addEventListener('click', () => this.addRow());

		this.closeButton = Pixies.createElement(buttonsRight, 'button');
		this.closeButton.innerText = 'Close';
		this.closeButton.addEventListener('click', () => {
			if (this.game.editor.activeTable.equalsTo(this.model)) {
				this.game.editor.triggerEvent('table-closed');
			}
		});

		this.scrollable = Pixies.createElement(this.container, 'div', 'scroll');
		this.table = Pixies.createElement(this.scrollable, 'table');

		let dummy = null;

		if (typeof this.model.nodeFactory === 'function') {
			dummy = this.model.nodeFactory();
		} else if (this.model.count() > 0) {
			dummy = this.model.first();
		}

		if (dummy) {
			const thead = Pixies.createElement(this.table, 'thead');
			const header = Pixies.createElement(thead, 'tr');
			dummy.properties.forEach((name, value) => {
				const cell = Pixies.createElement(header, 'th');
				cell.innerText = name;
			});
		}

		this.tbody = Pixies.createElement(this.table, 'tbody');
		this.rendererFactory = (item) => new TableRowRenderer(game, item, this.tbody, this.name);

		super.activateInternal();
	}

	deactivateInternal() {
		super.deactivateInternal();
		this.hideForm();
		Pixies.destroyElement(this.container);
	}

	addRow() {
		const item = this.model.add();
		this.showForm(item);
	}

	showForm(node) {
		this.hideForm();
		this.formRenderer = new NodeFormRenderer(this.game, node, this.dom);
		this.addChild(this.formRenderer);
		node.addEventListener('form-closed', this.onFormClosedHandler);
		node.addEventListener('node-delete', this.onNodeDeleteHandler);
	}

	hideForm() {
		if (this.formRenderer) {
			this.removeChild(this.formRenderer);
			this.formRenderer.model.removeEventListener('form-closed', this.onFormClosedHandler);
			this.formRenderer.model.removeEventListener('node-delete', this.onNodeDeleteHandler);
		}
		this.formRenderer = null;
	}

	onNodeDelete(node) {
		this.game.editor.triggerEvent('node-delete', {table: this.model, node: node});
	}

}
