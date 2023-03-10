import DomRenderer from "./DomRenderer";
import Pixies from "../../class/basic/Pixies";

export default class SwitchRenderer extends DomRenderer {

	/**
	 * @type BoolValue
	 */
	model;

	constructor(game, model, dom, label = null) {
		super(game, model, dom);

		this.model = model;
		this.label = label;
		this.container = null;
	}

	activateInternal() {
		this.container = Pixies.createElement(this.dom, 'div', 'switch-container');
		if (this.label) {
			Pixies.createElement(this.container, 'span', 'switch-label', this.label);
		}
		this.switch = Pixies.createElement(this.container, 'div', 'switch');
		this.container.addEventListener(
			'click',
			(e) => {
				e.stopPropagation();
				this.model.invert();
			}
		);
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
		if (this.model.get()) {
			Pixies.addClass(this.switch, 'checked');
			this.switch.innerText = 'x';
		} else {
			Pixies.removeClass(this.switch, 'checked');
			this.switch.innerText = '';
		}
	}
}
