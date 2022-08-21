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

		this.editRowHandler = (item) => this.editRow(item);
		this.closeFormHandler = () => this.closeForm();

		this.formRenderer = null;
	}

	activateInternal() {
		this.container = Pixies.createElement(this.dom, 'div', 'table');
		this.container.addEventListener('mousemove', (e) => e.stopPropagation());
		this.container.addEventListener('click', (e) => e.stopPropagation());

		this.buttons = Pixies.createElement(this.container, 'div');
		this.addButton = Pixies.createElement(this.buttons, 'button');
		this.addButton.innerText = 'Add';
		this.addButton.addEventListener('click', () => this.addRow());

		this.table = Pixies.createElement(this.container, 'table');
		this.rendererFactory = (item) => new TableRowRenderer(game, item, this.table, this.name);

		const header = Pixies.createElement(this.table, 'tr');
		const dummy = this.model.nodeFactory();
		dummy.properties.forEach((name, value) => {
			const cell = Pixies.createElement(header, 'th');
			cell.innerText = name;
		});

		this.game.editor.addEventListener('edit', this.editRowHandler);

		super.activateInternal();
	}

	deactivateInternal() {
		super.deactivateInternal();
		this.game.editor.removeEventListener('edit', this.editRowHandler);
		Pixies.destroyElement(this.container);
	}

	addRow() {
		const item = this.model.createNode();
		this.editRow(item);
	}

	editRow(item) {
		if (this.formRenderer) {
			this.removeChild(this.formRenderer);
			this.formRenderer = null;
		}
		item.addEventListener('closed', this.closeFormHandler);
		this.formRenderer = this.addChild(new NodeFormRenderer(this.game, item, this.dom, this.name));
	}

	closeForm() {
		if (this.formRenderer) {
			this.formRenderer.model.removeEventListener('closed', this.closeFormHandler);
			this.removeChild(this.formRenderer);
			this.formRenderer = null;
		}
	}

}
