import Pixies from "../../class/basic/Pixies";
import CollectionRenderer from "../basic/CollectionRenderer";
import TableRowRenderer from "./TableRowRenderer";
import NodeFormRenderer from "./NodeFormRenderer";
import NullableNodeRenderer from "../basic/NullableNodeRenderer";
import DomRenderer from "../basic/DomRenderer";

export default class NodeTableRenderer extends DomRenderer {

	/**
	 * @type ModelNodeTable|ModelNodeCollection
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;
		this.dom = dom;
		this.container = null;

		this.addChild(
			new NullableNodeRenderer(
				this.game,
				this.model.selectedNode,
				(m) => new NodeFormRenderer(this.game, m, this.dom, this.model)
			)
		);

		this.addChild(
			new CollectionRenderer(
				this.game,
				this.model,
				(m) => new TableRowRenderer(game, m, this.tbody, this.model)
			)
		);
	}

	activateInternal() {
		this.container = Pixies.createElement(this.dom, 'div', 'table bg');

		this.buttons = Pixies.createElement(this.container, 'div', 'buttons');
		const buttonsLeft = Pixies.createElement(this.buttons, 'div');
		const buttonsRight = Pixies.createElement(this.buttons, 'div');

		Pixies.createElement(
			buttonsLeft,
			'button',
			null,
			'Add',
			(e) => {
				e.preventDefault();
				this.model.selectedNode.set(this.model.add());
			}
		);

		this.input = Pixies.createElement(buttonsLeft,'input', 'flex-1')
		this.input.setAttribute('type', 'text');
		this.input.addEventListener('input', () => this.updateItems());
		Pixies.createElement(buttonsLeft,'button',null,'Reset',() => {
			this.input.value = '';
			this.updateItems();
		});

		Pixies.createElement(
			buttonsRight,
			'button',
			null,
			'Close',
			(e) => {
				e.preventDefault();
				if (this.game.editor.activeTable.equalsTo(this.model)) {
					this.game.editor.triggerEvent('table-closed');
				}
			}
		);

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
			dummy.properties.forEach((name) => {
				const cell = Pixies.createElement(header, 'th');
				cell.innerText = name;
			});
		}

		this.tbody = Pixies.createElement(this.table, 'tbody');

		super.activateInternal();
	}

	deactivateInternal() {
		super.deactivateInternal();
		Pixies.destroyElement(this.container);
	}

	updateItems() {
		const rows = this.tbody.querySelectorAll('tr');
		const search = this.input.value.toLowerCase();
		rows.forEach((row) => {
			const str = row.innerText.toLowerCase();
			const visible = (search === '') || str.includes(search);
			if (visible) {
				Pixies.removeClass(row, 'hidden');
			} else {
				Pixies.addClass(row, 'hidden');
			}
		});
	}
}
