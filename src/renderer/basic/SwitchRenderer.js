import DomRenderer from "./DomRenderer";
import Pixies from "../../class/basic/Pixies";
import AssetLoader from "../../class/loaders/AssetLoader";

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
		this.labelContainer = Pixies.createElement(this.container, 'div', 'label-container');
		if (this.label) {
			const type = Pixies.extractId(this.label, 0);
			if (type === 'img') {
	 			const url = AssetLoader.urlFromUri(this.label);
				this.labelImage = Pixies.createElement(this.labelContainer, 'img');
				this.labelImage.src = url;
			} else {
				Pixies.createElement(this.labelContainer, 'span', 'switch-label', this.label);
			}
		}

		this.switchContainer = Pixies.createElement(this.container, 'div', 'switch-inner-container');
		this.switch = Pixies.createElement(this.switchContainer, 'div', 'switch');

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
