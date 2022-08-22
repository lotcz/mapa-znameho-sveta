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

		this.container.addEventListener('click', () => this.game.editor.triggerEvent('edit', this.model));

		this.updateRow();
	}

	deactivateInternal() {
		this.removeElement(this.container);
	}

	updateRow() {
		Pixies.emptyElement(this.container);

		this.model.properties.forEach((name, value) => {
			const cell = Pixies.createElement(this.container, 'td');
			if (value) {
				const text = (typeof value.get === 'function') ? value.get() : value.toString();
				if (typeof text === 'string') {
					let short = text.substring(0, 15);
					if (short.length < text.length) {
						short += '...';
					}
					cell.innerText = short;
				} else {
					cell.innerText = text;
				}
			}
		});
	}

	renderInternal() {
		this.updateRow();
	}

}
