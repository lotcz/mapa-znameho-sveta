import DomRenderer from "./DomRenderer";
import Pixies from "../../class/basic/Pixies";

export default class DirtyValueRenderer extends DomRenderer {

	/**
	 * @type DirtyValue
	 */
	model;

	constructor(game, model, dom, formatter = null) {
		super(game, model, dom);

		this.model = model;
		this.formatter = formatter;
		this.container = null;
	}

	activateInternal() {
		this.container = Pixies.createElement(this.dom, 'span');
		this.updateValue();
	}

	deactivateInternal() {
		this.removeElement(this.container);
		this.container = null;
	}

	renderInternal() {
		this.updateValue();
	}

	updateValue() {
		this.container.innerText = this.formatter ? this.formatter(this.model.get()) : this.model.get();
	}
}
