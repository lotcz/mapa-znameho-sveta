import DomRenderer from "../basic/DomRenderer";
import Pixies from "../../class/basic/Pixies";

export default class TableRowRenderer extends DomRenderer {

	/**
	 * @type ModelNode
	 */
	model;

	/**
	 * @type ModelNodeTable|ModelNodeCollection
	 */
	table;

	constructor(game, model, dom, collection) {
		super(game, model, dom);

		this.model = model;
		this.collection = collection;

		this.container = null;

		this.addAutoEvent(
			this.collection.selectedNode,
			'change',
			() => {
				if (this.collection.selectedNode.equalsTo(this.model)) {
					Pixies.addClass(this.container, 'active');
				} else {
					Pixies.removeClass(this.container, 'active');
				}
			},
			true
		);
	}

	activateInternal() {
		this.container = this.addElement('tr');
		this.container.addEventListener('click', () => this.collection.selectedNode.set(this.model));

		this.updateRow();
	}

	deactivateInternal() {
		this.removeElement(this.container);
	}

	renderInternal() {
		this.updateRow();
	}

	updateRow() {
		Pixies.emptyElement(this.container);

		this.model.properties.forEach((name, value) => {
			const cell = Pixies.createElement(this.container, 'td');
			let text = '';
			if (value !== undefined && value !== null) {
				if (typeof value === 'object') {
					if (value.value !== undefined) {
						text = value.value;
					} else if (value.x !== undefined && value.y !== undefined) {
						text = '[' + Pixies.round(value.x, 2)+ ',' + Pixies.round(value.y, 2);
						if (value.z !== undefined) {
							text += ',' + Pixies.round(value.z, 2);
						}
						if (value.w !== undefined) {
							text += ',' + Pixies.round(value.w, 2);
						}
						text += ']';
					} else {
						text = Pixies.shorten(value.toString());
					}
				} else {
					text = Pixies.shorten(value);
				}
			}
			cell.innerText = text;
		});

	}

}
