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
		console.log('updating');
		Pixies.emptyElement(this.container);

		this.model.properties.forEach((name, value) => {
			const cell = Pixies.createElement(this.container, 'td');
			if (value) {
				if (typeof value.get === 'function') {
					cell.innerText = value.get();
				} else {
					cell.innerText = value.toString();
				}
			}
		});
	}

	renderInternal() {
		this.updateRow();
	}

}
