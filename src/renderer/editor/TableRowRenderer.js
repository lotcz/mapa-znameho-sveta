import DomRenderer from "../basic/DomRenderer";
import Pixies from "../../class/basic/Pixies";

export default class TableRowRenderer extends DomRenderer {

	/**
	 * @type ModelNode
	 */
	model;

	name;

	constructor(game, model, dom, name = null) {
		super(game, model, dom);

		this.model = model;
		this.name = name;
		this.container = null;
	}

	activateInternal() {
		this.container = this.addElement('tr');

		this.container.addEventListener('click', () => this.game.editor.triggerEvent('row-selected', this.model));

		this.updateRow();
	}

	deactivateInternal() {
		this.removeElement(this.container);
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
						text = '[' + value.x + ',' + value.y;
						if (value.z !== undefined) {
							text += ',' + value.z;
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

	renderInternal() {
		this.updateRow();
	}

}
