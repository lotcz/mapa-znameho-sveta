import DomRenderer from "../../../basic/DomRenderer";
import Pixies from "../../../../class/basic/Pixies";

export default class InventoryStatFloatRenderer extends DomRenderer {

	/**
	 * @type StatModel
	 */
	model;

	constructor(game, model, dom) {
		super(game, model, dom);

		this.model = model;
	}

	activateInternal() {
		this.container = Pixies.createElement(this.dom, 'div', 'row', this.model.current.get());

	}

	renderInternal() {
		this.container.innerText = this.model.current.get();
	}

	deactivateInternal() {
		this.removeElement(this.container);
	}

}
